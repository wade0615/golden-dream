import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import configError from 'src/Config/error.message.config';
import { MetaDataCommon } from 'src/Definition/Dto';
import { CSV_FILE_EXTENSIONS } from 'src/Definition/Enum/Member/file.extension.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { joinErrorMsg } from 'src/Utils/tools';
import { v4 as ruuidv4 } from 'uuid';
import { DownloadHolidayExampleResp } from './Dto/download.holiday.example.dto';
import {
  GetHolidaySettingListDto,
  GetHolidaySettingListResp
} from './Dto/get.holiday.list.dto';
import { UpdBatchHolidaySettingDto } from './Dto/upd.batch.holiday.setting.dto';
import {
  HolidayExcelData,
  UploadHolidaySettingResp
} from './Dto/upload.holiday.setting.dto';
import { AddHolidayDetailReq } from './Interface/add.holiday.detail.interface';
import { HolidayRepository } from './holiday.repository';
import moment = require('moment-timezone');

@Injectable()
export class HolidayService {
  constructor(
    private holidayRepository: HolidayRepository,
    private csvDownloadExample: CsvDownloadExample,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得假日設定列表
   *
   * @param req
   * @returns
   */
  async getHolidaySettingList(
    req: GetHolidaySettingListDto
  ): Promise<GetHolidaySettingListResp> {
    const holidayList = await this.holidayRepository.getHolidaySettingList(req);

    const holidayCount =
      await this.holidayRepository.getHolidaySettingListCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: holidayCount,
      totalPage: Math.ceil(holidayCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetHolidaySettingListResp>{};
    result.metaData = metaData;
    result.holidayList = holidayList;

    return result;
  }
  /**
   * 下載假日設定範本
   *
   * @param res
   * @returns
   */
  async downloadHolidayExample(
    res: Response
  ): Promise<DownloadHolidayExampleResp> {
    const buffer = await this.csvDownloadExample.holidayCsvExample();

    const filename = '假日設定_匯入範本.csv';
    const mimeType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`
    );

    res.send(buffer);

    const result = <DownloadHolidayExampleResp>{};
    result.buffer = buffer;

    return result;
  }

  /**
   * 檢查匯入假日設定資料
   *
   * @param req
   * @param file
   * @returns
   */
  async chkUploadHolidaySetting(
    req: UpdBatchHolidaySettingDto,
    file: Express.Multer.File
  ): Promise<UploadHolidaySettingResp> {
    if (!file?.originalname) {
      throw new CustomerException(configError._220007, HttpStatus.OK);
    }

    const extension = file.originalname.split('.').pop();
    // 檢查檔案格式
    if (!CSV_FILE_EXTENSIONS.includes(extension)) {
      throw new CustomerException(configError._220020, HttpStatus.OK);
    }

    const { buffer } = file;

    const dir = `${__dirname}/member`;
    const fileName = 'temp.csv';
    const csvPath = `${dir}/${fileName}`;
    // 指定位置
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(csvPath, buffer, 'utf8');

    const tableName = `Upload_Csv_${ruuidv4().replace(/-/g, '_')}`;

    const fileContent = fs.readFileSync(csvPath, 'utf8');
    if (fileContent?.length <= 0) {
      throw new CustomerException(configError._220007, HttpStatus.OK);
    }

    const content = fileContent.split(/[\n]/);

    let rowNumber = 0;
    const errorDate = [];
    const excelData = [] as HolidayExcelData[];
    for (const val of content) {
      rowNumber++;

      if (rowNumber == 1) {
        continue;
      }

      const detail = val.split(',');
      // 日期欄位為空跳過
      if (detail[0] == '') {
        continue;
      }

      // 判斷日期格式是否正確
      if (moment(detail[0]).format('YYYY') != req?.year) {
        errorDate.push(rowNumber);
        continue;
      }

      // 日期設定重複
      if (excelData.find((t) => t.date == detail[0])) {
        continue;
      }

      excelData.push({
        date: detail[0],
        week: detail[1].slice(0, 1),
        remark: detail[2].slice(0, 6)
      });
    }

    if (!excelData?.length) {
      throw new CustomerException(configError._220027, HttpStatus.OK);
    }

    if (errorDate.length) {
      const errorMsg = [];
      if (errorDate.length) {
        errorMsg.push(`${configError._270001.msg}${errorDate.join('、')}`);
      }

      throw new CustomerException(
        {
          code: configError._220007.code,
          msg: joinErrorMsg(errorMsg)
        },
        HttpStatus.OK
      );
    }

    const result = <UploadHolidaySettingResp>{};
    result.totalCount = excelData?.length;
    result.holidayExcelData = excelData;

    return result;
  }

  /**
   * 儲存假日設定資料
   *
   * @param req
   * @param file
   * @param userId
   * @returns
   */
  async updBatchHolidaySetting(
    req: UpdBatchHolidaySettingDto,
    file: Express.Multer.File,
    userId: string
  ): Promise<Record<string, never>> {
    const holidaySetting = await this.chkUploadHolidaySetting(req, file);

    const addHolidayDetail = [] as AddHolidayDetailReq[];
    holidaySetting?.holidayExcelData.forEach((val) => {
      addHolidayDetail.push({
        year: moment(val.date).format('YYYY'),
        date: moment(val.date).format('MM/DD'),
        week: val.week,
        remark: val.remark
      });
    });

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      // 初始化日期資料
      await this.holidayRepository.delHolidayDetail(
        connection,
        req?.year,
        userId
      );

      await this.holidayRepository.insHolidayDetail(
        connection,
        addHolidayDetail,
        userId
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._270002, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }
}
