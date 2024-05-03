import { HttpStatus, Injectable } from '@nestjs/common';
import configError from 'src/Config/error.message.config';
import { MetaDataCommon } from 'src/Definition/Dto';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { ConvertZip } from 'src/Utils/DataFrame/zip';
import { generatePassword } from 'src/Utils/tools';
import { AuthRepository } from '../Auth/auth.repository';
import { CommonService } from '../Common/common.service';
import { InsertEventResp } from '../Mot/Dto/insert.event.dto';
import { MotRepository } from '../Mot/mot.repository';
import {
  DownloadReportExportDto,
  DownloadReportExportResp
} from './Dto/download.report.export.dto';
import {
  GetReportExportListDto,
  GetReportExportListResp
} from './Dto/get.report.export.list.dto';
import { ReportRepository } from './report.repository';
const https = require('https');
const fs = require('fs');

@Injectable()
export class ReportService {
  constructor(
    private commonService: CommonService,
    private reportRepository: ReportRepository,
    private authRepository: AuthRepository,
    private motRepository: MotRepository,
    private convertZip: ConvertZip
  ) {}

  /**
   * 取得匯出報表列表
   *
   * @param req
   * @returns
   */
  async getReportExportList(
    req: GetReportExportListDto
  ): Promise<GetReportExportListResp> {
    const reportExportList = await this.reportRepository.getReportExportList(
      req
    );

    const reportExportListCount =
      await this.reportRepository.getReportExportListCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: reportExportListCount,
      totalPage: Math.ceil(reportExportListCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetReportExportListResp>{};
    result.metaData = metaData;
    result.reportExportList = reportExportList;

    return result;
  }

  /**
   * 下載報表匯出檔案
   *
   * @param req
   * @returns
   */
  async downloadReportExport(
    req: DownloadReportExportDto
  ): Promise<DownloadReportExportResp> {
    const reportExportDetail =
      await this.reportRepository.getReportExportDetail(req?.exportId);
    if (!reportExportDetail) {
      throw new CustomerException(configError._350004, HttpStatus.OK);
    }

    const fileDetail = reportExportDetail?.fileName?.split('.');

    const xlsxFolderPath = `${__dirname}/xlsx`;
    if (!fs.existsSync(xlsxFolderPath)) fs.mkdirSync(xlsxFolderPath);

    await this.downloadReportExcelToLocal(
      reportExportDetail?.fileName,
      reportExportDetail?.url,
      xlsxFolderPath
    );

    const password = generatePassword();

    // zip 目錄的路徑
    const zipFolderPath = `${__dirname}/zip`;
    // zip 檔案的路径
    const zipFilePath = `${zipFolderPath}/${fileDetail[0]}.zip`;

    await this.convertZip.filesCompressionForPassword(
      zipFolderPath,
      zipFilePath,
      xlsxFolderPath,
      password
    );

    const fileList = [
      {
        name: `${fileDetail[0]}.zip`,
        localPath: zipFilePath
      }
    ];

    const filesUploadRes = await this.commonService.fileUploadToGS(
      fileList,
      'report',
      ''
    );

    // 刪除 暫存檔
    fs.rmSync(xlsxFolderPath, { recursive: true });
    fs.rmSync(zipFolderPath, { recursive: true });

    // 寄發一次性密碼
    const userDetail = await this.authRepository.getUserDetail(
      req?.iam?.authMemberId
    );

    const insertEventResp = <InsertEventResp>{};
    insertEventResp.Email = userDetail?.email;
    insertEventResp.Event = 'exportCsv';
    insertEventResp.Member_ID = '';
    insertEventResp.Send_Time = '00:00';
    insertEventResp.Send_Timing = 'rightNow';
    insertEventResp.Push_State = 'pending';
    insertEventResp.Sms_State = 'pending';
    insertEventResp.Action_State = '1';
    insertEventResp.Email_Title = `【CRM系統】${fileDetail[0]}-密碼`;
    insertEventResp.Email_Content = `您好：\n${fileDetail[0]}-密碼如下\n檔案密碼：${password}\n謝謝。`;

    await this.motRepository.insertEvent(insertEventResp);

    const result = <DownloadReportExportResp>{};
    result.url = filesUploadRes?.[0]?.path;

    return result;
  }

  /**
   * 下載報表 Excel 至 Local
   *
   * @param fileName
   * @param url
   * @param xlsxFolderPath
   * @returns
   */
  async downloadReportExcelToLocal(
    fileName: string,
    url: string,
    xlsxFolderPath: string
  ) {
    const xlsxPath = `${xlsxFolderPath}/${fileName}`;
    const file = fs.createWriteStream(xlsxPath);

    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        response.pipe(file);

        response.on('end', () => {
          resolve('');
        });

        file.on('finish', () => {
          file.close();
        });
      });
    });
  }
}
