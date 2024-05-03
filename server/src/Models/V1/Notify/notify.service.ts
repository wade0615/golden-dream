import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import configError from 'src/Config/error.message.config';
import { MenuCommon, MetaDataCommon } from 'src/Definition/Dto';
import { CSV_FILE_EXTENSIONS } from 'src/Definition/Enum/Member/file.extension.enum';
import { TYPE_STR } from 'src/Definition/Enum/Notify/notify.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { joinErrorMsg, repairCountryCode } from 'src/Utils/tools';
import { v4 as ruuidv4 } from 'uuid';
import { MemberService } from '../Member/member.service';
import { DelNotifyClassDto } from './Dto/del.notify.class.dto';
import { DelNotifyMemberDetailDto } from './Dto/del.notify.member.detail.dto';
import {
  DownloadNotifyMemberExampleResp,
  NotifyMemberTypeDto
} from './Dto/download.notify.member.example.dto';
import { GetNotifyClassListResp } from './Dto/get.notify.class.dto';
import { GetNotifyClassMenuResp } from './Dto/get.notify.class.menu.dto';
import {
  GetNotifyMemberListDto,
  GetNotifyMemberListResp
} from './Dto/get.notify.member.list.dto';
import { UpdNotifyClassDetailDto } from './Dto/upd.notify.class.detail.dto';
import { UpdNotifyClassRankDto } from './Dto/upd.notify.class.rank.dto';
import { UpdNotifyMemberDetailDto } from './Dto/upd.notify.member.detail.dto';
import {
  AddNotifyExcelData,
  UploadAddNotifyMemberResp
} from './Dto/upload.add.notify.member.dto';
import { NotifyRepository } from './notify.repository';

@Injectable()
export class NotifyService {
  constructor(
    private readonly notifyRepository: NotifyRepository,
    private readonly memberService: MemberService,
    private csvDownloadExample: CsvDownloadExample,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得通知分類列表
   *
   * @returns
   */
  async getNotifyClassList(): Promise<GetNotifyClassListResp[]> {
    const notifyMemberCount =
      await this.notifyRepository.getNotifyMemberCount();

    const memberCount =
      notifyMemberCount?.reduce((acc, notify) => {
        acc[`${notify.notifyId}`] = notify.memberCount;
        return acc;
      }, {}) ?? {};

    const result = await this.notifyRepository.getNotifyClassList();

    result.forEach((val) => {
      val.userCount = memberCount[`${val.seq}`] ?? 0;
    });

    return result;
  }

  /**
   * 修改通知分類設定排序
   *
   * @param req
   * @returns
   */
  async updNotifyClassRank(
    req: UpdNotifyClassRankDto
  ): Promise<Record<string, never>> {
    // 無異動
    if (req?.notifySorts.length == 0) {
      throw new CustomerException(configError._200007, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 批次更新品牌順序
      let rank = 0;
      for (const id of req?.notifySorts) {
        await this.notifyRepository.updNotifyClassRank(
          connection,
          id,
          rank,
          req?.iam?.authMemberId
        );
        rank++;
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._200002, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 修改通知分類詳細資料
   *
   * @param req
   * @returns
   */
  async updNotifyClassDetail(
    req: UpdNotifyClassDetailDto
  ): Promise<Record<string, never>> {
    const notifyDetailByName =
      await this.notifyRepository.getNotifyClassDetailByName(req);

    // 分類名稱已存在
    if (notifyDetailByName) {
      throw new CustomerException(configError._360003, HttpStatus.OK);
    }

    if (req?.notifySeq) {
      // 取得通知分類詳細資料
      const notifyClassDetail =
        await this.notifyRepository.getNotifyClassDetail(req?.notifySeq);

      // 通知分類不存在
      if (!notifyClassDetail) {
        throw new CustomerException(configError._360001, HttpStatus.OK);
      }

      // 修改分類設定
      await this.notifyRepository.updNotifyClassDetail(
        req?.notifySeq,
        req?.groupName,
        req?.iam?.authMemberId
      );

      return {};
    }

    // 新增分類設定
    await this.notifyRepository.insNotifyClassDetail(
      req?.groupName,
      req?.iam?.authMemberId
    );

    return {};
  }

  /**
   * 刪除通知分類
   *
   * @param req
   * @returns
   */
  async delNotifyClassDetail(
    req: DelNotifyClassDto
  ): Promise<Record<string, never>> {
    // 取得通知分類詳細資料
    const notifyClassDetail = await this.notifyRepository.getNotifyClassDetail(
      req?.notifyId
    );
    if (!notifyClassDetail) {
      throw new CustomerException(configError._360001, HttpStatus.OK);
    }

    const notifyMemberCount =
      await this.notifyRepository.getNotifyMemberCount();

    const memberCount =
      notifyMemberCount?.reduce((acc, notify) => {
        acc[`${notify.notifyId}`] = notify.memberCount;
        return acc;
      }, {}) ?? {};

    // 判斷人員數量，必須沒有人員才可刪除
    if (memberCount[req?.notifyId] ?? 0 >= 1) {
      throw new CustomerException(configError._360002, HttpStatus.OK);
    }

    // 刪除通知分類設定
    await this.notifyRepository.delNotifyClassDetail(
      req?.notifyId,
      req?.iam?.authMemberId
    );

    return {};
  }

  /**
   * 取得通知分類下拉式選單
   *
   * @returns
   */
  async getNotifyClassMenu(): Promise<GetNotifyClassMenuResp> {
    const notifyClassList = await this.notifyRepository.getNotifyClassList();

    const result = <GetNotifyClassMenuResp>{};
    result.list = [] as MenuCommon[];
    notifyClassList?.map((notify) => {
      result.list.push({
        seq: notify.seq,
        name: notify.groupName
      });
    });

    return result;
  }

  /**
   * 取得通知分類列表
   *
   * @param req
   * @returns
   */
  async getNotifyMemberList(
    req: GetNotifyMemberListDto
  ): Promise<GetNotifyMemberListResp> {
    const notifyMemberList = await this.notifyRepository.getNotifyMemberList(
      req
    );

    const notifyMemberCount =
      await this.notifyRepository.getNotifyMemberListCount(req);

    const classByMemberId =
      await this.notifyRepository.getNotifyClassMapMember();

    // 整理分類 ID
    const notifyGroupIds =
      classByMemberId?.reduce((acc, notify) => {
        if (!acc[`${notify.userSeq}`]) {
          acc[`${notify.userSeq}`] = [];
        }

        acc[`${notify.userSeq}`].push({
          groupId: notify.groupId,
          groupName: notify.groupName
        });
        return acc;
      }, {}) ?? {};

    // 分類 ID 帶入列表
    notifyMemberList.forEach((notify) => {
      notify.notifyGroupIds = notifyGroupIds[notify.userSeq] ?? [];
    });

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: notifyMemberCount,
      totalPage: Math.ceil(notifyMemberCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetNotifyMemberListResp>{};
    result.metaData = metaData;
    result.notifyMemberList = notifyMemberList;

    return result;
  }

  /**
   * 修改通知人員詳細資料
   *
   * @param req
   * @returns
   */
  async updNotifyMemberDetail(
    req: UpdNotifyMemberDetailDto
  ): Promise<Record<string, never>> {
    let userSeq = req?.userSeq;
    if (userSeq) {
      const memberDetail = await this.notifyRepository.getNotifyMemberDetail(
        userSeq
      );

      if (!memberDetail) {
        throw new CustomerException(configError._360004, HttpStatus.OK);
      }
    }

    if (req?.notifyGroupIds?.length <= 0) {
      throw new CustomerException(configError._360006, HttpStatus.OK);
    }

    const notifyClassDetails =
      await this.notifyRepository.getNotifyClassDetails(req?.notifyGroupIds);

    // 檢查分類是否存在
    if (req?.notifyGroupIds?.length != notifyClassDetails?.length) {
      throw new CustomerException(configError._360006, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      if (userSeq) {
        await this.notifyRepository.updNotifyMemberDetail(
          connection,
          req,
          req?.iam?.authMemberId
        );
      } else {
        userSeq = await this.notifyRepository.insNotifyMemberDetail(
          connection,
          req,
          req?.iam?.authMemberId
        );
      }

      await this.notifyRepository.initNotifyGroupMember(
        connection,
        userSeq,
        req?.iam?.authMemberId
      );

      await this.notifyRepository.updNotifyGroupMember(
        connection,
        userSeq,
        req?.notifyGroupIds,
        req?.iam?.authMemberId
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._200002, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 軟刪除通知人員資料
   *
   * @param req
   * @returns
   */
  async delNotifyMemberDetail(
    req: DelNotifyMemberDetailDto
  ): Promise<Record<string, never>> {
    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      await this.notifyRepository.initNotifyGroupMember(
        connection,
        req?.userSeq,
        req?.iam?.authMemberId
      );

      await this.notifyRepository.delNotifyMemberDetail(
        connection,
        req?.userSeq,
        req?.iam?.authMemberId
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._200002, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 下載通知人員範本
   *
   * @param res
   * @param req
   * @returns
   */
  async downloadNotifyMemberExample(
    res: Response,
    req: NotifyMemberTypeDto
  ): Promise<DownloadNotifyMemberExampleResp> {
    let buffer;
    switch (req?.type) {
      case TYPE_STR.ADD:
        buffer = await this.csvDownloadExample.addNotifyMemberExample();
        break;
      case TYPE_STR.DEL:
        buffer = await this.csvDownloadExample.mobileCsvExample(
          '移除通知人員名單'
        );
        break;
    }

    const filename = '批量上傳通知人員_匯入範本.csv';
    const mimeType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`
    );

    res.send(buffer);

    const result = <DownloadNotifyMemberExampleResp>{};
    result.buffer = buffer;

    return result;
  }

  /**
   * 檢查上傳的新增通知人員
   *
   * @param file
   * @returns
   */
  async chkUploadAddNotifyMember(
    file: Express.Multer.File
  ): Promise<UploadAddNotifyMemberResp> {
    if (!file?.originalname) {
      throw new CustomerException(configError._220007, HttpStatus.OK);
    }

    const extension = file.originalname.split('.').pop();
    if (!CSV_FILE_EXTENSIONS.includes(extension)) {
      throw new CustomerException(configError._220020, HttpStatus.OK);
    }

    const notifyNames = await this.notifyRepository.getAllNotifyClassNames();
    const names =
      notifyNames?.reduce((acc, notify) => {
        acc[`${notify.groupName}`] = notify.notifySeq;
        return acc;
      }, {}) ?? {};

    const { buffer } = file;

    const dir = `${__dirname}/notify`;
    const fileName = `${ruuidv4().replace(/-/g, '_')}.csv`;
    const csvPath = `${dir}/${fileName}`;
    // 指定位置
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(csvPath, buffer, 'utf8');

    const fileContent = fs.readFileSync(csvPath, 'utf8');
    if (fileContent?.length <= 0) {
      throw new CustomerException(configError._220007, HttpStatus.OK);
    }

    const content = fileContent.split(/[\n]/);

    const errorEmptyCol = [];
    const errorMobileCol = [];
    const errorRepeatData = [];
    const errorEmptyClassName = [];
    const errorNameFormat = [];
    const errorEmailFormat = [];

    let rowNumber = 0;
    const notifyExcelData = [] as AddNotifyExcelData[];
    for (const str of content) {
      rowNumber++;

      if (rowNumber == 1) {
        continue;
      }

      const val = str.split(',');
      const target = <AddNotifyExcelData>{};
      target.name = val[0];
      target.mobileCountryCode = repairCountryCode(val[1]);
      target.mobile = val[2];
      target.email = val[3];
      target.className = val[4];

      // 欄位皆空跳過
      if (
        !target?.name?.length &&
        !target?.mobileCountryCode?.length &&
        !target?.mobile?.length &&
        !target?.email?.length &&
        !target?.className?.length
      ) {
        continue;
      }

      // 有欄位有空值
      if (
        target?.name == '' ||
        !target?.name ||
        target?.mobileCountryCode == '' ||
        !target?.mobileCountryCode ||
        target?.mobile == '' ||
        !target?.mobile ||
        target?.email == '' ||
        !target?.email ||
        target?.className == '' ||
        !target?.className
      ) {
        errorEmptyCol.push(rowNumber);
      }

      if (
        isNaN(Number(target?.mobileCountryCode)) ||
        isNaN(Number(target?.mobile)) ||
        target?.mobileCountryCode?.length > 6 ||
        target?.mobile?.length > 11 ||
        target?.mobileCountryCode?.match(/[\uff00-\uffff]/g) ||
        target?.mobile?.match(/[\uff00-\uffff]/g)
      ) {
        errorMobileCol.push(`${target?.mobileCountryCode}-${target?.mobile}`);
      }

      if (target?.name?.length > 10) {
        errorNameFormat.push(target?.name);
      }

      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(target?.email)) {
        errorEmailFormat.push(target?.email);
      }

      // 通知分類不存在
      const classNames = target?.className?.split('-') ?? [];
      const classSeqs = [];
      for (const className of classNames) {
        if (!names[className]) {
          errorEmptyClassName.push(target?.className);
          continue;
        }
        classSeqs.push(names[className]);
      }

      target.classSeqs = classSeqs;

      if (
        notifyExcelData.find(
          (t) =>
            t.name === target?.name &&
            t.mobileCountryCode === target?.mobileCountryCode &&
            t.mobile === target?.mobile &&
            t.email === target?.email &&
            t.className === target?.className
        )
      ) {
        errorRepeatData.push(rowNumber);
      }

      notifyExcelData.push(target);
    }

    if (!notifyExcelData?.length) {
      throw new CustomerException(configError._220027, HttpStatus.OK);
    }

    // 檢查錯誤資料
    if (
      errorEmptyCol?.length ||
      errorMobileCol?.length ||
      errorRepeatData?.length ||
      errorEmptyClassName?.length ||
      errorNameFormat?.length ||
      errorEmailFormat?.length
    ) {
      const errorMsg = [];
      if (errorEmptyCol?.length) {
        errorMsg.push(`${configError._220011.msg}${errorEmptyCol.join('、')}`);
      }

      if (errorMobileCol?.length) {
        errorMsg.push(`${configError._360008.msg}${errorMobileCol.join('、')}`);
      }

      if (errorRepeatData?.length) {
        errorMsg.push(
          `${configError._360005.msg}${errorRepeatData.join('、')}`
        );
      }

      if (errorEmptyClassName?.length) {
        errorMsg.push(
          `${configError._360006.msg}${errorEmptyClassName.join('、')}`
        );
      }

      if (errorNameFormat?.length) {
        errorMsg.push(
          `${configError._360009.msg}${errorNameFormat.join('、')}`
        );
      }

      if (errorEmailFormat?.length) {
        errorMsg.push(
          `${configError._360010.msg}${errorEmailFormat.join('、')}`
        );
      }

      throw new CustomerException(
        {
          code: configError._220007.code,
          msg: joinErrorMsg(errorMsg)
        },
        HttpStatus.OK
      );
    }

    if (notifyExcelData?.length <= 0) {
      throw new CustomerException(configError._360007, HttpStatus.OK);
    }

    const result = <UploadAddNotifyMemberResp>{};
    result.totalCount = notifyExcelData.length;
    result.notifyExcelData = notifyExcelData;

    // 刪除 csv 暫存檔
    fs.rmSync(csvPath, { recursive: true });

    return result;
  }

  /**
   * 儲存通知人員資料
   *
   * @param file
   * @param userId
   * @returns
   */
  async updBatchAddNotifyMember(
    file: Express.Multer.File,
    userId: string
  ): Promise<Record<string, never>> {
    const notifyMembers = await this.chkUploadAddNotifyMember(file);

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 批次更新品牌順序
      for (const data of notifyMembers?.notifyExcelData) {
        const addData = {
          name: data.name,
          mobileCountryCode: data.mobileCountryCode,
          mobile: data.mobile,
          email: data.email
        } as UpdNotifyMemberDetailDto;
        // 更新會員特殊類型
        const userSeq = await this.notifyRepository.insNotifyMemberDetail(
          connection,
          addData,
          userId
        );

        await this.notifyRepository.initNotifyGroupMember(
          connection,
          userSeq,
          userId
        );

        await this.notifyRepository.updNotifyGroupMember(
          connection,
          userSeq,
          data.classSeqs,
          userId
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._200002, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 移除通知人員資料
   *
   * @param file
   * @param userId
   * @returns
   */
  async updBatchDelNotifyMember(
    file: Express.Multer.File,
    userId: string
  ): Promise<Record<string, never>> {
    const mobileDetail = await this.memberService.chkUploadMobileCsv(file);

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      await this.notifyRepository.delNotifyMemberDetailBySql(
        connection,
        mobileDetail?.csvTempTableName,
        mobileDetail?.csvSql,
        userId
      );

      await this.notifyRepository.initNotifyGroupMemberBySql(
        connection,
        mobileDetail?.csvTempTableName,
        userId
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._200002, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }
}
