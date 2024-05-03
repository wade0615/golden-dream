import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import oauthPath from 'src/Center/oauth.path';
import { ConfigApiService } from 'src/Config/Api/config.service';
import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
import { MenuCommon, MetaDataCommon } from 'src/Definition/Dto';
import { CHANNEL } from 'src/Definition/Enum/Channel/channel.enum';
import {
  MEMBER_SHIP_GIFT_CN,
  MEMBER_SHIP_GIFT_STR
} from 'src/Definition/Enum/Coupon/coupon.type.enum';
import { ENUM_POINT_TYPE_LOG_STR } from 'src/Definition/Enum/Coupon/point.type.log.enum';
import { LOG_ACTION } from 'src/Definition/Enum/Log/log.channel.action.enum';
import { ENUM_ACTION_TYPE_STR } from 'src/Definition/Enum/Member/action.type.enum';
import {
  ENUM_EC_VOUCHER_STATE,
  ENUM_EC_VOUCHER_STATE_STR
} from 'src/Definition/Enum/Member/ec.voucher.state.enum';
import { CSV_FILE_EXTENSIONS } from 'src/Definition/Enum/Member/file.extension.enum';
import { ENUM_FILTER_DATE_STR } from 'src/Definition/Enum/Member/filter.date.enum';
import {
  UPLOAD_GPC_FILES_TYPE,
  UPLOAD_TYPE,
  UPLOAD_TYPE_STR
} from 'src/Definition/Enum/Member/upload.member.special.type.enum';
import { ENUM_MEMBER_SHIP_SETTING_STATUS_CODE } from 'src/Definition/Enum/MemberShip/member.ship.setting.status.enum';
import { BELONG_TO } from 'src/Definition/Enum/code.center.belong.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import {
  AddMemberDetailDto,
  ChkUploadMemberMobileResp,
  GetMemberCommonDataDto,
  GetMemberCommonDataResp,
  GetMemberDetailDto,
  GetMemberDetailResp,
  GetMemberListDto,
  GetMemberListResp,
  GetMemberSpecialTypeMenuDto,
  GetMemberSpecialTypeMenuResp,
  MemberList,
  UpdBatchMemberSpecialTypeDto,
  UpdMemberDetailDto,
  UpdMemberSpecialDetailDto
} from 'src/Models/V1/Member/Dto';
import { ApiService } from 'src/Providers/Api/api.service';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { LogService } from 'src/Utils/log.service';
import {
  getLogTableNameByMonth,
  getRandomChar,
  joinErrorMsg,
  removeFirstZero
} from 'src/Utils/tools';
import { v4 as ruuidv4 } from 'uuid';
import { ChannelRepository } from '../Channel/channel.repository';
import { CommonRepository } from '../Common/common.repository';
import { CommonService } from '../Common/common.service';
import { CouponRepository } from '../Coupon/coupon.repository';
import { MemberShip } from '../MemberShip/Interface/get.member.ship.setting.info.interface';
import { MemberShipRepository } from '../MemberShip/memberShip.repository';
import { MemberShipService } from '../MemberShip/memberShip.service';
import { OrderRepository } from '../Order/order.repository';
import { ExcelData } from '../Point/Dto/upload.member.point.dto';
import { TagRepository } from '../Tag/tag.repository';
import { DelMemberSpecialDetailDto } from './Dto/del.member.special.detail.dto';
import { DownloadMemberSpecialTypeExampleResp } from './Dto/download.member.special.type.example.dto';
import {
  GetBonusHistoryDto,
  GetBonusHistoryResp
} from './Dto/get.bonus.history.dto';
import {
  GetMemberBookingLogDto,
  GetMemberBookingLogResp
} from './Dto/get.member.booking.log.dto';
import {
  GetMemberDetailByMobileDto,
  GetMemberDetailByMobileResp
} from './Dto/get.member.detail.mobile.dto';
import {
  GetMemberDetailReferrerCodeDto,
  GetMemberDetailReferrerCodeResp
} from './Dto/get.member.detail.referrer.code.dto';
import {
  GetMemberEcVoucherInfoResp,
  ProductInfo,
  TradeInfo
} from './Dto/get.member.ec.voucher.info.dto.';
import {
  GetMemberEcVoucherLogDto,
  GetMemberEcVoucherLogResp
} from './Dto/get.member.ec.voucher.log.dto';
import {
  GetMemberPointLogDto,
  GetMemberPointLogResp
} from './Dto/get.member.point.log.dto';
import {
  GetMemberShipLogDto,
  GetMemberShipLogResp
} from './Dto/get.member.ship.log.dto';
import { GetMemberSpecialListResp } from './Dto/get.member.special.list.dto';
import {
  Analysis,
  ConsumptionBrand,
  ConsumptionCommodity,
  GetOverviewAnalysisDto,
  GetOverviewAnalysisResp,
  OverviewAnalysisConsumptionDetail,
  OverviewAnalysisMemberShipDetail,
  OverviewAnalysisPointDetail
} from './Dto/get.overview.analysis.dto';
import { UpdMemberSpecialRankDto } from './Dto/upd.member.special.rank.dto';
import { GetMemberBonusResp } from './Interface/get.member.bonus.interface';
import { GetPointFilterOptionsResp } from './Interface/get.point.filter.options.interface';
import { MemberRepository } from './member.repository';
const apiService = new ApiService(new HttpService(), new LogService());
const crypto = require('crypto');

import moment = require('moment-timezone');
import e = require('express');

@Injectable()
export class MemberService {
  constructor(
    private memberShipService: MemberShipService,
    private memberRepository: MemberRepository,
    private memberShipRepository: MemberShipRepository,
    private commonRepository: CommonRepository,
    private channelRepository: ChannelRepository,
    private couponRepository: CouponRepository,
    private orderRepository: OrderRepository,
    private tagRepository: TagRepository,
    private readonly configApiService: ConfigApiService,
    private commonService: CommonService,
    private csvDownloadExample: CsvDownloadExample,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得會員詳細資料
   *
   * @param req
   * @returns
   */
  async getMemberDetail(req: GetMemberDetailDto): Promise<GetMemberDetailResp> {
    // 取得會員基本資料
    const memberDetail = await this.memberRepository.getMemberDetailByMemberId(
      req?.memberId
    );

    if (!memberDetail) {
      throw new CustomerException(configError._220005, HttpStatus.OK);
    }

    // 取得會員推薦人資料
    const recommenderMemberDetail =
      await this.memberRepository.getMemberDetailByMemberId(
        memberDetail?.recommenderMemberId
      );

    // CRM 後台渠道簽證
    const now = new Date().getTime();
    const buffer = [
      this.configApiService.backstageChannelCertificate,
      now.toString()
    ];
    const channel = crypto
      .privateEncrypt(config.PUBLIC_KEY, Buffer.from(buffer.join('|')))
      .toString('base64');

    // 取得 6 碼系統密碼
    const verifyCode = getRandomChar(6);

    // 打 oAuth 註冊 API
    const registerBody = {
      channel: channel,
      mobile: memberDetail?.mobile,
      mobileCountryCode: memberDetail?.mobileCountryCode
    };

    // 取得手機驗證碼
    const oauthUrl = `${this.configApiService.oauthUrl}${oauthPath.member.smsInfo}`;
    const smsResult = await apiService.oAuthPostAllowFail(
      oauthUrl,
      {},
      registerBody
    );

    const result = {
      name: memberDetail?.name,
      cardNumber: memberDetail?.cardNumber,
      birthday: memberDetail?.birthday,
      gender: memberDetail?.gender,
      gmail: memberDetail?.gmail,
      recommenderName: recommenderMemberDetail?.name ?? '',
      recommenderCardNumber: recommenderMemberDetail?.cardNumber ?? '',
      createTime: moment(memberDetail?.createTime).format(
        'YYYY/MM/DD HH:mm:ss'
      ),
      referralCode: memberDetail?.referralCode,
      cityCode: memberDetail?.cityCode,
      zipCode: memberDetail?.zipCode,
      address: memberDetail?.address,
      homePhone: memberDetail?.homePhone,
      carriersKey: memberDetail?.carriersKey,
      remark: memberDetail?.remark,
      membershipStatus: memberDetail?.membershipStatus,
      mobile: memberDetail?.mobile,
      mobileCountryCode: memberDetail?.mobileCountryCode,
      specialTypeCode: memberDetail?.spacialType,
      smsInfo: {
        verifyCode: smsResult?.message ?? '',
        expireTime: smsResult?.expireTime ?? ''
      }
    } as GetMemberDetailResp;

    return result;
  }

  /**
   * 取得會員列表
   *
   * @param req
   * @returns
   */
  async getMemberList(req: GetMemberListDto): Promise<GetMemberListResp> {
    // 只要頁數其中一個參數未定義，就使用預設值
    if (!req?.page || !req?.perPage) {
      req.page = 1;
      req.perPage = 20;
    }

    // 如果字數超過2個字去除第一個0
    if (req?.search?.length >= 2) {
      req.search = removeFirstZero(req?.search);
    }

    // 取得會員列表
    const memberList = await this.memberRepository.getMemberList(req);

    // 取得會員總數
    const memberCount = await this.memberRepository.getMemberListCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: memberCount,
      totalPage: Math.ceil(memberCount / req?.perPage)
    } as MetaDataCommon;

    // 取得會籍分支編號
    const memberShipBranchIds = [];
    memberList?.forEach((list) => {
      if (
        list.memberShipBranchId &&
        !memberShipBranchIds.includes(list.memberShipBranchId)
      ) {
        memberShipBranchIds.push(list.memberShipBranchId);
      }
    });

    // 取得會籍名稱
    const memberShipBranch =
      await this.memberShipRepository.getMemberShipBranchByIds(
        memberShipBranchIds
      );

    const memberListData = [] as MemberList[];
    memberList?.forEach((list) => {
      memberListData.push({
        memberId: list.memberId,
        memberCardId: list.memberCardId,
        memberName: list.memberName,
        mobileCountryCode: list.mobileCountryCode,
        phone: list.phone,
        birthday: list.birthday,
        registerTime: list.registerTime,
        membershipStatus:
          memberShipBranch.find(
            (x) => x.memberShipBranchId == list.memberShipBranchId
          )?.memberShipName ?? '',
        isDelete: list.isDelete,
        alterName: list.alterName,
        alterTime: list.alterTime
      });
    });

    const result = <GetMemberListResp>{};
    result.metaData = metaData;
    result.memberList = memberListData;

    return result;
  }

  /**
   * 取得會員特殊類型下拉式選單
   *
   * @returns
   */
  async getMemberSpecialTypeMenu(
    req: GetMemberSpecialTypeMenuDto
  ): Promise<GetMemberSpecialTypeMenuResp> {
    // 取得會員特殊類型選單
    const specialList = await this.memberRepository.getMemberSpecialList(
      req?.state
    );

    const result = <GetMemberSpecialTypeMenuResp>{};
    result.list = [] as MenuCommon[];
    specialList.forEach((val) => {
      result.list.push({
        seq: val.specialId,
        name: val.typeName
      });
    });

    return result;
  }

  /**
   * 取得會員共用資料(OAuth)
   *
   * @param req
   * @returns
   */
  async getMemberCommonData(
    req: GetMemberCommonDataDto
  ): Promise<GetMemberCommonDataResp> {
    const memberDetail = await this.memberRepository.getMemberDetailByMemberId(
      req?.memberId
    );

    if (!memberDetail) {
      throw new CustomerException(configError._220005, HttpStatus.OK);
    }

    const specialDetail = await this.memberRepository.getMemberSpecialDetail(
      memberDetail?.spacialType
    );

    let specialTypeName = '';
    // 檢核特殊會員類型
    if (specialDetail) {
      specialTypeName = specialDetail?.name;
    }

    const memberShipBranchDetail =
      await this.memberShipRepository.getMemberShipBranchById(
        memberDetail?.membershipStatus
      );

    const result = <GetMemberCommonDataResp>{};
    result.name = memberDetail?.name;
    result.mobile = memberDetail?.mobile;
    result.specialTypeName = specialTypeName;
    result.membershipStatus = memberShipBranchDetail?.memberShipName ?? '';
    result.mobileCountryCode = memberDetail?.mobileCountryCode;

    return result;
  }

  /**
   * 新增會員詳細資料
   *
   * @param req
   * @returns
   */
  async addMemberDetail(
    req: AddMemberDetailDto
  ): Promise<Record<string, never>> {
    const mobile = removeFirstZero(req?.mobile);
    // 取會員詳細資料
    const memberDetail = await this.memberRepository.getMemberDetailByMobile(
      req?.mobileCountryCode,
      mobile
    );

    // 檢查手機號碼是否已存在
    if (memberDetail) {
      throw new CustomerException(configError._220001, HttpStatus.OK);
    }

    // 檢核推薦碼
    if (req?.inviteCode || req?.inviteCode?.length) {
      // 取得推薦碼會員詳細資料
      const referrerMemberDetail =
        await this.memberRepository.getMemberDetailByInviteCode(
          req?.inviteCode
        );

      // 推薦碼不存在
      if (!referrerMemberDetail) {
        throw new CustomerException(configError._220004, HttpStatus.OK);
      }
    }

    if (req?.specialTypeCode) {
      const specialDetail = await this.memberRepository.getMemberSpecialDetail(
        Number(req?.specialTypeCode)
      );

      // 檢核特殊會員類型
      if (!specialDetail) {
        throw new CustomerException(configError._220010, HttpStatus.OK);
      }
    }

    const year = moment(req?.birthday).format('YYYY');
    const month = moment(req?.birthday).format('MM');
    const day = moment(req?.birthday).format('DD');

    // 城市名稱
    const cityName = await this.commonRepository.getCodCenterCodeName(
      BELONG_TO.CITY_CODE,
      req?.cityCode
    );
    // 區域名稱
    const zipName = await this.commonRepository.getCodCenterCodeName(
      BELONG_TO.ZIP_CODE,
      req?.zipCode
    );

    const now = new Date().getTime();
    const buffer = [
      this.configApiService.backstageChannelCertificate,
      now.toString()
    ];

    // CRM 後台渠道簽證
    const channel = crypto
      .privateEncrypt(config.PUBLIC_KEY, Buffer.from(buffer.join('|')))
      .toString('base64');

    // 取得 6 碼系統密碼
    const verifyCode = getRandomChar(6);

    // 打 oAuth 註冊 API
    const registerBody = {
      member_info: {
        mobile_country_code: req?.mobileCountryCode,
        mobile: req?.mobile,
        special_member_type: req?.specialTypeCode ? req?.specialTypeCode : '0',
        name: req?.name,
        password: verifyCode,
        birth_year: year,
        birth_month: month,
        birth_day: day,
        gender: req?.gender,
        email: req?.email,
        address: {
          province: cityName,
          city: zipName,
          street: req?.address
        },
        inviteCode: req?.inviteCode,
        confirm_pwd: verifyCode,
        tel_number: req?.homePhone,
        remark: req?.remark,
        invoice_info: req?.carriersKey,
        is_accept_privacy: true
      },
      credential: {
        sign: channel
      }
    };

    const registerUrl = `${this.configApiService.oauthUrl}${oauthPath.member.register}`;
    await apiService.oAuthPost(registerUrl, {}, registerBody);

    return {};
  }

  /**
   * 修改會員詳細資料
   *
   * @param req
   * @returns
   */
  async updMemberDetail(
    req: UpdMemberDetailDto
  ): Promise<Record<string, never>> {
    // 依會員編號取得會員詳細資料
    const memberDetail = await this.memberRepository.getMemberDetailByMemberId(
      req?.memberId
    );

    if (req?.memberSpecialType !== 0) {
      // 驗證特殊會員類型
      const specialDetail = await this.memberRepository.getMemberSpecialDetail(
        req?.memberSpecialType
      );

      // 檢核特殊會員類型
      if (!specialDetail) {
        throw new CustomerException(configError._220010, HttpStatus.OK);
      }
    }

    // 驗證會員是否存在
    if (!memberDetail) {
      throw new CustomerException(configError._220005, HttpStatus.OK);
    }

    // 打 oAuth 更新 API
    const updMemberBody = {
      memberId: req?.memberId,
      memberSpecialType: req?.memberSpecialType,
      name: req?.name,
      birthdayYear: moment(req?.birthday).format('YYYY'),
      birthdayMonth: moment(req?.birthday).format('MM'),
      birthdayDay: moment(req?.birthday).format('DD'),
      gender: req?.gender,
      email: req?.email,
      cityCode: req?.cityCode,
      zipCode: req?.zipCode,
      address: req?.address,
      homePhone: req?.homePhone,
      invoiceInfo: req?.carriersKey,
      remark: req?.remark
    };

    const updMemberUrl = `${this.configApiService.oauthUrl}${oauthPath.crm.updMemberInfo}`;
    const oauthHeader = {
      'api-key': this.configApiService.oAuthPublicKey
    };

    await apiService.oAuthPost(updMemberUrl, oauthHeader, updMemberBody);

    return {};
  }

  /**
   * 取得特殊會員類型列表
   *
   * @param req
   * @returns
   */
  async getMemberSpecialList(): Promise<GetMemberSpecialListResp[]> {
    const result = await this.memberRepository.getMemberSpecialList('');

    return result;
  }

  /**
   * 修改特殊會員類型排序
   *
   * @param req
   * @returns
   */
  async updMemberSpecialRank(
    req: UpdMemberSpecialRankDto
  ): Promise<Record<string, never>> {
    // 無異動
    if (req?.specialSorts.length == 0) {
      throw new CustomerException(configError._200007, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 批次更新品牌順序
      let rank = 1;
      for (const id of req?.specialSorts) {
        await this.memberRepository.updMemberSpecialRank(connection, id, rank);
        rank++;
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._220014, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 修改特殊會員類型詳細資料
   *
   * @param req
   * @returns
   */
  async updMemberSpecialDetail(
    req: UpdMemberSpecialDetailDto
  ): Promise<Record<string, never>> {
    const specialDetailByName =
      await this.memberRepository.getMemberSpecialDetailByName(req?.typeName);

    if (specialDetailByName && !req?.specialId) {
      throw new CustomerException(configError._220019, HttpStatus.OK);
    }

    if (req?.specialId) {
      const specialDetail = await this.memberRepository.getMemberSpecialDetail(
        req?.specialId
      );

      // 特殊會員類型不存在
      if (!specialDetail) {
        throw new CustomerException(configError._220010, HttpStatus.OK);
      }

      if (specialDetailByName && specialDetailByName?.id != req?.specialId) {
        throw new CustomerException(configError._220019, HttpStatus.OK);
      }

      await this.memberRepository.updMemberSpecialDetail(
        req?.specialId,
        req?.typeName,
        req?.isEarnPoints,
        req?.isPromoteRank,
        req?.state,
        req?.iam?.authMemberId
      );
      return {};
    }

    await this.memberRepository.insMemberSpecialTypeDetail(
      req?.typeName,
      req?.isEarnPoints,
      req?.isPromoteRank,
      req?.state,
      req?.iam?.authMemberId
    );

    return {};
  }

  /**
   * 刪除特殊會員類型詳細資料
   *
   * @param req
   * @returns
   */
  async delMemberSpecialDetail(
    req: DelMemberSpecialDetailDto
  ): Promise<Record<string, never>> {
    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 刪除會員特殊類型
      await this.memberRepository.delMemberSpecialDetail(
        connection,
        req?.specialId,
        req?.iam?.authMemberId
      );

      // 初始化會員特殊類型
      await this.memberRepository.updMemberSpecialTypeById(
        connection,
        req?.specialId,
        0,
        req?.iam?.authMemberId
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._220015, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 檢查上傳的電話國碼與號碼
   *
   * @param req
   * @returns
   */
  async chkUploadMobileCsv(
    file: Express.Multer.File,
    isUploadGcp?: boolean
  ): Promise<ChkUploadMemberMobileResp> {
    if (!file?.originalname) {
      throw new CustomerException(configError._220007, HttpStatus.OK);
    }

    const extension = file.originalname.split('.').pop();
    if (!CSV_FILE_EXTENSIONS.includes(extension)) {
      throw new CustomerException(configError._220020, HttpStatus.OK);
    }

    const { buffer } = file;

    const dir = `${__dirname}/member`;
    const fileName = `${ruuidv4().replace(/-/g, '_')}.csv`;
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

    const errorEmptyCol = [];
    const errorEmptyMember = [];
    const errorRepeatMember = [];

    let rowNumber = 0;
    const excelData = [] as ExcelData[];
    for (const str of content) {
      rowNumber++;

      if (rowNumber == 1) {
        continue;
      }

      const val = str.split(',');
      const target = <ExcelData>{};
      target.mobileCountryCode = val[0];
      target.mobile = val[1];
      // 欄位皆空值
      if (!target.mobileCountryCode?.length && !target.mobile?.length) {
        continue;
      }

      // 檢查重複設置會員
      if (
        target.mobileCountryCode?.length &&
        target.mobile?.length &&
        excelData.find(
          (t) =>
            t.mobileCountryCode === target.mobileCountryCode &&
            t.mobile === target.mobile
        )
      ) {
        const mobileData = `${target.mobileCountryCode}-${target.mobile}`;
        if (!errorRepeatMember.includes(mobileData)) {
          errorRepeatMember.push(mobileData);
        }
      }

      // 手機國碼為空 或 手機號碼為空
      if (!target.mobileCountryCode?.length || !target.mobile?.length) {
        errorEmptyCol.push(rowNumber);
      }

      excelData.push(target);
    }

    if (!excelData?.length) {
      throw new CustomerException(configError._220027, HttpStatus.OK);
    }

    // 檢查手機號碼是否存在
    for (const val of excelData) {
      if (!val.mobileCountryCode?.length || !val.mobile?.length) continue;

      // 取得會員資料
      const memberDetail = await this.memberRepository.getMemberDetailByMobile(
        `+${val.mobileCountryCode}`,
        removeFirstZero(val.mobile)
      );
      if (!memberDetail) {
        const mobileData = `${val.mobileCountryCode}-${val.mobile}`;
        if (!errorEmptyMember.includes(mobileData)) {
          errorEmptyMember.push(mobileData);
        }
      }

      val.id = memberDetail?.id;
    }

    // 檢查錯誤資料
    if (
      errorEmptyCol?.length ||
      errorEmptyMember?.length ||
      errorRepeatMember?.length
    ) {
      const errorMsg = [];
      if (errorEmptyCol?.length) {
        errorMsg.push(`${configError._220011.msg}${errorEmptyCol.join('、')}`);
      }

      if (errorEmptyMember?.length) {
        errorMsg.push(
          `${configError._220012.msg}${errorEmptyMember.join('、')}`
        );
      }

      if (errorRepeatMember?.length) {
        errorMsg.push(
          `${configError._220013.msg}${errorRepeatMember.join('、')}`
        );
      }

      if (errorMsg?.length > 500) {
        throw new CustomerException(configError._220007, HttpStatus.OK);
      } else {
        throw new CustomerException(
          {
            code: configError._220007.code,
            msg: joinErrorMsg(errorMsg)
          },
          HttpStatus.OK
        );
      }
    }

    const csvSql = await this.memberRepository.addMobileCsvTempData(
      tableName,
      content
    );

    let urls = [];
    if (isUploadGcp) {
      const excelUrls = await this.commonService.uploadExcel(
        dir,
        fileName,
        UPLOAD_GPC_FILES_TYPE.CSV
      );
      urls = excelUrls?.urls;
    }

    const result = <ChkUploadMemberMobileResp>{};
    result.totalCount = excelData?.length;
    result.csvTempTableName = tableName;
    result.csvSql = csvSql;
    result.urls = urls;

    // 刪除 csv 暫存檔
    fs.rmSync(csvPath, { recursive: true });

    return result;
  }

  /**
   * 批量儲存特殊會員類型
   *
   * @param req
   * @returns
   */
  async updBatchMemberSpecialType(
    req: UpdBatchMemberSpecialTypeDto,
    file: Express.Multer.File,
    userId: string
  ): Promise<Record<string, never>> {
    const uploadData = await this.chkUploadMobileCsv(file);

    let specialTypeSeq = Number(req?.specialTypeSeq);
    const specialDetail = await this.memberRepository.getMemberSpecialDetail(
      specialTypeSeq
    );

    // 檢查特殊會員類型是否存在
    if (!specialDetail) {
      throw new CustomerException(configError._220010, HttpStatus.OK);
    }

    switch (req?.type) {
      // 移除特殊會員類型
      case UPLOAD_TYPE[UPLOAD_TYPE_STR.DEL]:
        specialTypeSeq = 0;
        break;
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 更新會員特殊類型
      await this.memberRepository.updMemberSpecialType(
        connection,
        uploadData?.csvTempTableName,
        uploadData?.csvSql,
        specialTypeSeq,
        userId
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._220016, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 下載特殊會員類型範本
   *
   * @param res
   * @returns
   */
  async downloadMemberSpecialTypeExample(
    res: Response
  ): Promise<DownloadMemberSpecialTypeExampleResp> {
    const buffer = await this.csvDownloadExample.mobileCsvExample(
      '批量設定特殊會員'
    );

    const filename = '批量設定特殊會員_匯入範本.csv';
    const mimeType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`
    );

    res.send(buffer);

    const result = <DownloadMemberSpecialTypeExampleResp>{};
    result.buffer = buffer;

    return result;
  }

  /**
   * 依手機號碼取得會員詳細資料
   *
   * @param req
   * @returns
   */
  async getMemberDetailByMobile(
    req: GetMemberDetailByMobileDto
  ): Promise<GetMemberDetailByMobileResp> {
    const memberDetail = await this.memberRepository.getMemberDetailByMobile(
      req?.mobileCountryCode,
      removeFirstZero(req?.mobile)
    );

    if (!memberDetail) {
      throw new CustomerException(configError._220005, HttpStatus.OK);
    }

    const result = <GetMemberDetailByMobileResp>{};
    result.memberId = memberDetail?.id ?? '';
    result.memberName = memberDetail?.name ?? '--';
    result.memberCardId = memberDetail?.cardNumber ?? '--';

    return result;
  }

  /**
   * 後台重置密碼
   *
   * @param req
   * @returns
   */
  async resetPassword(req: any): Promise<Record<string, never>> {
    const { mobileCountryCode, mobile, newPwd } = req;
    if (!newPwd.test(/^(?=.*[a-zA-Z\d@$%^&=._])[a-zA-Z\d@$%^&=._]{1,8}$/)) {
      throw new CustomerException(configError._220028, HttpStatus.OK);
    }

    const now = new Date().getTime();
    const buffer = [
      this.configApiService.backstageChannelCertificate,
      now.toString()
    ];

    // CRM 後台渠道簽證
    const channel = crypto
      .privateEncrypt(config.PUBLIC_KEY, Buffer.from(buffer.join('|')))
      .toString('base64');

    const urlBody = {
      mobile_country_code: mobileCountryCode,
      mobile: mobile,
      newPwd: newPwd,
      channel: channel
    };
    console.log(this.configApiService.oAuthPublicKey);
    const oauthHeader = {
      'api-key': this.configApiService.oAuthPublicKey
    };
    // 透過 oauth 更新會員密碼
    const oauthUrl = `${this.configApiService.oauthUrl}${oauthPath.crm.resetPassword}`;
    await apiService.oAuthPost(oauthUrl, oauthHeader, urlBody);

    return {};
  }

  /**
   * 後台重新發送驗證碼
   *
   * @param req
   * @returns
   */
  async resendSms(req: any): Promise<Record<string, never>> {
    const { memberId, mobile, mobileCountryCode } = req;
    const now = new Date().getTime();
    const buffer = [
      this.configApiService.backstageChannelCertificate,
      now.toString()
    ];

    // CRM 後台渠道簽證
    const channel = crypto
      .privateEncrypt(config.PUBLIC_KEY, Buffer.from(buffer.join('|')))
      .toString('base64');

    const urlBody = {
      mobile_country_code: mobileCountryCode,
      mobile: mobile,
      memberId: memberId
    };
    const oauthHeader = {
      'api-key': this.configApiService.oAuthPublicKey
    };

    const oauthUrl = `${this.configApiService.oauthUrl}${oauthPath.crm.resendSms}`;
    const oAuahResult = await apiService.oAuthPost(
      oauthUrl,
      oauthHeader,
      urlBody
    );

    return oAuahResult;
  }

  /**
   * 依推薦碼取得會員詳細資料
   *
   * @param req
   * @returns
   */
  async getMemberDetailByReferrerCode(
    req: GetMemberDetailReferrerCodeDto
  ): Promise<GetMemberDetailReferrerCodeResp> {
    const memberDetail =
      await this.memberRepository.getMemberDetailByReferrerCode(
        req?.referralCode
      );

    const result = <GetMemberDetailReferrerCodeResp>{};
    result.memberId = memberDetail?.id ?? '';
    result.memberName = memberDetail?.name ?? '--';
    result.memberCardId = memberDetail?.cardNumber ?? '--';

    return result;
  }

  /**
   * 取得會員積點歷程下單選項
   */
  async getMemberPointFilterOptions(): Promise<GetPointFilterOptionsResp> {
    const pointType = Object.keys(ENUM_POINT_TYPE_LOG_STR).map((value) => ({
      value,
      label: ENUM_POINT_TYPE_LOG_STR[value]
    }));

    const filterDate = Object.keys(ENUM_FILTER_DATE_STR).map((value) => ({
      value,
      label: ENUM_FILTER_DATE_STR[value]
    }));

    const result = <GetPointFilterOptionsResp>{};
    result.pointType = pointType;
    result.filterDate = filterDate;

    return result;
  }

  /**
   * 取得積點明細列表
   * @param req
   */
  async getMemberPointLog(
    req: GetMemberPointLogDto
  ): Promise<GetMemberPointLogResp> {
    // 只要頁數其中一個參數未定義，就使用預設值
    if (!req?.page || !req?.perPage) {
      req.page = 1;
      req.perPage = 20;
    }

    // 依據傳入資料篩選取得資料起訖日
    const filterDate = await this.DateToUTC(req?.startDate, req?.endDate);

    // 取得點數到期日基本設定
    const pointBasicSetting =
      await this.memberRepository.getPointBasicSetting();
    const pointStartDate = `${moment()
      .tz(process.env.TIME_ZONE)
      .format('yyyy')}/${pointBasicSetting?.expiryMonth}/${
      pointBasicSetting?.expiryDate
    }`;
    const pointEndDate = `${moment()
      .tz(process.env.TIME_ZONE)
      .add(pointBasicSetting?.expiryDay / 365, 'y')
      .format('yyyy')}/${pointBasicSetting?.expiryMonth}/${
      pointBasicSetting?.expiryDate
    }`;
    const lastDay = moment()
      .tz(process.env.TIME_ZONE)
      .add(-1, 'd')
      .format(process.env.DATE_ONLY);

    // 取得會員資訊＆積點
    const memberInfo = await this.memberRepository.getMemberInfoAndPoint(
      req?.memberId,
      pointStartDate,
      pointEndDate,
      lastDay
    );
    if (!memberInfo?.name)
      throw new CustomerException(configError._380001, HttpStatus.OK);

    const preName = 'Member_Point_Log_';
    let logTable = getLogTableNameByMonth(
      preName,
      filterDate?.startDate,
      filterDate?.endDate
    );
    logTable = await this.commonService.getExistedTable(logTable);

    // 取得列表筆數＆積點明細列表
    const logInfo = await this.memberRepository.getPointLogInfo(
      req,
      filterDate?.startDate,
      filterDate?.endDate,
      logTable
    );
    const { logCount, logList } = logInfo;
    const pointLogCount = logCount?.[0]?.count;

    const textMap = {
      usedPoint: '年度已使用積點',
      canUsePoint: '剩餘可使用積點',
      expiringPoint: '即將到期積點'
    };

    const billInfo = Object.keys(memberInfo)
      .map((key) => {
        const numberValue = memberInfo[key];
        return isNaN(numberValue)
          ? null
          : {
              text: textMap[key],
              number: numberValue
            };
      })
      .filter((item) => item !== null);

    const metaData = <MetaDataCommon>{};
    metaData.page = req?.page;
    metaData.perPage = req?.perPage;
    metaData.totalCount = pointLogCount;
    metaData.totalPage = Math.ceil(pointLogCount / req?.perPage);

    const result = <GetMemberPointLogResp>{};
    result.metaData = metaData;
    result.billInfo = billInfo;
    result.logList = logList?.map((x) => {
      return {
        pointItem: x?.pointItem,
        point: x?.point,
        orderId: x?.orderId,
        expiredDate: x?.expiredDate,
        brandName: x?.brandName,
        storeName: x?.storeName,
        sendOrDeductDate: x?.sendDate ? x?.sendDate : x?.deductDate
      };
    });

    return result;
  }

  /**
   * 依推薦碼取得會員詳細資料
   *
   * @param req
   * @returns
   */
  async syncDataFromOauth(params: any): Promise<string> {
    const memberId = params.memberId;

    const registerQueryParams = {
      Member_ID: memberId,
      Member_CardID: params.memberCardNo,
      Member_Name: params?.req?.member_info?.name,
      Member_Special_Type: params?.req?.member_info?.special_member_type ?? 0,
      Mobile_Country_Code: params?.req?.member_info?.mobile_country_code,
      Mobile: removeFirstZero(params?.req?.member_info?.mobile),
      Birthday: `${params?.req?.member_info?.birth_year}-${params?.req?.member_info?.birth_month}-${params?.req?.member_info?.birth_day}`,
      Gender: params?.req?.member_info?.gender?.length
        ? params?.req?.member_info?.gender
        : null,
      Email: params?.req?.member_info?.email,
      Referrer_Code: params?.referrerCode,
      Referrer_Member: params?.req?.member_info?.invite_code ?? null,
      City_Code: params?.addressCode?.province ?? null,
      Zip_Code: params?.addressCode?.city ?? null,
      Address: params?.req?.member_info?.address?.street,
      Membership_Channel: params?.channelId,
      Membership_Status: params?.memberShipId,
      Create_ID: 'system',
      Alter_ID: 'system',
      Invoice_Carrier: params?.req?.member_info?.invoice_info,
      Tel_Number: params?.req?.member_info?.tel_number,
      Member_Remark: params?.req?.member_info?.remark
    };

    const logQueryParams = {
      Member_ID: memberId,
      Branch_ID: params?.memberShipId,
      Start_Date: params?.memberShipStartDate,
      End_Date: params?.memberShipEndDate,
      Action_Type: 1, // 註冊
      System_Date: params?.memberShipStartDate,
      Create_ID: 'system'
    };

    let queryStr = /* sql */ `
      INSERT INTO IEat_Member SET ? ;
    `;

    if (params?.memberShipId)
      queryStr += `INSERT INTO IEat_Member_Ship_Log SET ?`;

    await this.internalConn.query(
      queryStr,
      params?.memberShipId
        ? [registerQueryParams, logQueryParams]
        : [registerQueryParams]
    );

    return memberId;
  }

  /**
   * 取得會員紅利資料
   * @param memberId
   */
  async getMemberBonus(memberId: string) {
    const memberBonusInfo = await this.memberRepository.getMemberBonus(
      memberId,
      moment().tz(process.env.TIME_ZONE).format(process.env.DATE_ONLY)
    );
    const { memberPoint, memberShip, pointSetting } = memberBonusInfo;

    if (!memberShip?.memberId)
      throw new CustomerException(configError._220005, HttpStatus.OK);

    // 總共紅利點數
    const totalPoint = memberPoint?.reduce(
      (acc, curr) => (acc += curr?.point),
      0
    );

    // 今年、明年點數到期日
    const thisExpiryYear = moment()
      .tz(process.env.TIME_ZONE)
      .add(pointSetting?.expiryDay / 365, 'y')
      .format('YYYY');
    const nextExpiryYear = moment()
      .tz(process.env.TIME_ZONE)
      .add(pointSetting?.expiryDay / 365, 'y')
      .add(1, 'y')
      .format('YYYY');
    const thisExpiredDate = `${thisExpiryYear}/${pointSetting?.expiryMonth}/${pointSetting?.expiryDate}`;
    const nextExpiredDate = `${nextExpiryYear}/${pointSetting?.expiryMonth}/${pointSetting?.expiryDate}`;

    // 今年、明天到期點數
    const thisYearPoint = memberPoint?.reduce((acc, curr) => {
      if (Date.parse(curr?.expiredDate) <= Date.parse(thisExpiredDate))
        acc += curr?.point;
      return acc;
    }, 0);
    const nextYearPoint = memberPoint?.reduce((acc, curr) => {
      if (
        Date.parse(curr?.expiredDate) <= Date.parse(nextExpiredDate) &&
        Date.parse(curr?.expiredDate) > Date.parse(thisExpiredDate)
      )
        acc += curr?.point;
      return acc;
    }, 0);

    // 當前啟用的會籍資訊
    const activeMemberShip = (
      await this.memberShipService.getMemberShipSettingList()
    )?.settingList?.find(
      (x) => x.settingStatus === ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE
    );

    const memberShipSettingInfo =
      await this.memberShipService.getMemberShipSettingInfo(
        activeMemberShip?.settingId
      );

    // 該員會當前的會籍資訊
    const memberShipInfo = memberShipSettingInfo?.memberShip?.find(
      (x) => x.memberShipId === memberShip?.memberShip
    );

    // 下一階會籍資訊
    let nextMemberShipInfo;
    if (
      // 如果是最高等級，nextMemberShipInfo 給自己的
      memberShip?.memberShip ===
      memberShipSettingInfo?.[memberShipSettingInfo?.memberShip?.length - 1]
        ?.memberShipId
    ) {
      nextMemberShipInfo = memberShipSettingInfo?.memberShip?.find(
        (x) => x.memberShipId === memberShip?.memberShip
      );
    } else {
      nextMemberShipInfo = memberShipSettingInfo?.memberShip?.find(
        (x) => x.memberShipId === memberShipInfo?.nextMemberShip
      );
    }

    const result = <GetMemberBonusResp>{};
    result.currentLevelName = memberShipInfo?.memberShipName;
    result.nextLevelName = nextMemberShipInfo?.memberShipName;
    result.levelEndDate = memberShip?.endDate;
    result.totalPoints = totalPoint?.toString();
    result.levelNowPoints = memberShip?.totalAmount?.toString();
    result.levelNeedPoints = nextMemberShipInfo?.purchasedTimes?.toString();
    result.levelUpPoints = (
      nextMemberShipInfo?.purchasedTimes - memberShip?.totalAmount
    )?.toString();
    result.thisYearBonusEndDate = thisExpiredDate;
    result.nextYearBonusEndDate = nextExpiredDate;
    result.thisYearPoints = thisYearPoint?.toString();
    result.nextYearPoints = nextYearPoint?.toString();

    return result;
  }

  /**
   * 取得會員會籍歷程
   * @param req
   */
  async getMemberShipLog(
    req: GetMemberShipLogDto
  ): Promise<GetMemberShipLogResp> {
    // 只要頁數其中一個參數未定義，就使用預設值
    if (!req?.page || !req?.perPage) {
      req.page = 1;
      req.perPage = 20;
    }

    // 取得會籍歷程 table 上方資訊
    const memberBillInfo = await this.memberRepository.getMemberShipInfo(
      req?.memberId
    );
    // 取得會籍歷程資料
    const logInfo = await this.memberRepository.getMemberShipLogInfo(req);
    const { logCount, logList } = logInfo;
    const memberShipLogCount = logCount?.[0]?.count;

    // 當前啟用的會籍資訊
    const activeMemberShip = (
      await this.memberShipService.getMemberShipSettingList()
    )?.settingList?.find(
      (x) => x.settingStatus === ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE
    );

    const memberShipSettingInfo =
      await this.memberShipService.getMemberShipSettingInfo(
        activeMemberShip?.settingId
      );

    // 晉升金卡、晉升黑卡、續等黑卡
    let textMapWording, nextMemberShipInfo: MemberShip;
    // 當前啟用的會籍資訊
    const memberShipInfo = memberShipSettingInfo?.memberShip?.find(
      (x) => x.memberShipId === memberBillInfo?.memberShipId
    );

    if (
      // 如果是最高等級，nextMemberShipInfo 給自己的
      memberBillInfo?.memberShipId ===
      memberShipSettingInfo?.memberShip?.[
        memberShipSettingInfo?.memberShip?.length - 1
      ]?.memberShipId
    ) {
      nextMemberShipInfo = memberShipSettingInfo?.memberShip?.find(
        (x) => x.memberShipId === memberBillInfo?.memberShipId
      );
      textMapWording = `續等${nextMemberShipInfo?.memberShipName}`;
    } else {
      nextMemberShipInfo = memberShipSettingInfo?.memberShip?.find(
        (x) => x.memberShipId === memberShipInfo?.nextMemberShip
      );
      textMapWording = `晉升${nextMemberShipInfo?.memberShipName}`;
    }

    const diffAmount =
      nextMemberShipInfo?.purchasedTimes - memberBillInfo?.totalAmount;
    const diffCount =
      nextMemberShipInfo?.purchasedCount - memberBillInfo?.totalCount;

    const textMap = {
      createDate: '會員註冊日',
      memberShipEndDate: '會籍到期日',
      diffCount: `${textMapWording}差異消費次數`,
      diffAmount: `${textMapWording}差額`
    };

    const numberMap = {
      createDate: moment
        .tz(
          memberBillInfo?.createDate,
          process.env.DATE_TIME,
          process.env.TIME_ZONE
        )
        .format(process.env.DATE_ONLY),
      memberShipEndDate: memberBillInfo?.endDate,
      diffCount: diffCount < 0 ? 0 : diffCount,
      diffAmount: diffAmount < 0 ? 0 : diffAmount
    };

    const billInfo = Object.keys(textMap).map((key) => ({
      text: textMap[key],
      number: numberMap[key]
    }));

    const metaData = <MetaDataCommon>{};
    metaData.page = req?.page;
    metaData.perPage = req?.perPage;
    metaData.totalCount = memberShipLogCount;
    metaData.totalPage = Math.ceil(memberShipLogCount / req?.perPage);

    const result = <GetMemberShipLogResp>{};
    result.metaData = metaData;
    result.billInfo = billInfo;
    result.logList = logList?.map((x) => {
      const memberShipName = memberShipSettingInfo?.memberShip?.find(
        (info) => info?.memberShipId === x?.memberShipId
      )?.memberShipName;
      return {
        ...x,
        memberShipName,
        startDate: `${x?.startDate} 00:00`,
        endDate: `${x?.endDate} 23:59`,
        actionType: ENUM_ACTION_TYPE_STR[x?.actionType]
      };
    });

    return result;
  }

  /**
   * 依據傳入資料篩選取得資料起訖日
   * @param filterDate
   * @param inputStartDate
   * @param inputEndDate
   * @returns
   */
  async DateToUTC(
    inputStartDate: string,
    inputEndDate: string
  ): Promise<{ startDate: string; endDate: string }> {
    // utc+0
    const startDate = moment
      .tz(inputStartDate, process.env.DATE_TIME, process.env.TIME_ZONE)
      .utc()
      .format(process.env.DATE_TIME);
    const endDate = moment
      .tz(inputEndDate, process.env.DATE_TIME, process.env.TIME_ZONE)
      .utc()
      .format(process.env.DATE_TIME);

    return {
      startDate,
      endDate
    };
  }

  /**
   * 取得會員訂位資訊
   * @param req
   */
  async getMemberBookingLog(
    req: GetMemberBookingLogDto
  ): Promise<GetMemberBookingLogResp> {
    // 只要頁數其中一個參數未定義，就使用預設值
    if (!req?.page || !req?.perPage) {
      req.page = 1;
      req.perPage = 20;
    }

    // 依據傳入資料篩選取得資料起訖日
    const filterDate = await this.DateToUTC(req?.startDate, req?.endDate);

    // 取得訂位資訊 table 上方資訊
    const memberBillInfo = await this.memberRepository.getMemberBookingInfo(
      req?.memberId
    );
    // 取得訂位資訊歷史資料
    const logInfo = await this.memberRepository.getMemberBookingLogInfo(
      req,
      filterDate?.startDate,
      filterDate?.endDate
    );
    const { logCount, logList } = logInfo;
    const memberShipLogCount = logCount?.[0]?.count;

    const textMap = {
      bookingCount: '訂位次數',
      checkInCount: '已報到',
      unCheckInCount: '未報到',
      noShowCount: 'NO SHOW'
    };

    const numberMap = {
      bookingCount: memberBillInfo?.bookingCount ?? 0,
      checkInCount: memberBillInfo?.checkInCount ?? 0,
      unCheckInCount: memberBillInfo?.unCheckInCount ?? 0,
      noShowCount: memberBillInfo?.noShowCount ?? 0
    };

    const billInfo = Object.keys(textMap).map((key) => ({
      text: textMap[key],
      number: numberMap[key]
    }));

    const metaData = <MetaDataCommon>{};
    metaData.page = req?.page;
    metaData.perPage = req?.perPage;
    metaData.totalCount = memberShipLogCount;
    metaData.totalPage = Math.ceil(memberShipLogCount / req?.perPage);

    const result = <GetMemberBookingLogResp>{};
    result.metaData = metaData;
    result.billInfo = billInfo;
    result.logList = logList?.map((x) => {
      const bookingDate = `${x?.mealDate} ${x?.mealTime}`;
      const isCheckIn = Boolean(x?.isCheckIn) ?? false;
      delete x?.mealDate;
      delete x?.mealTime;
      return {
        ...x,
        bookingDate,
        isCheckIn
      };
    });

    return result;
  }

  /**
   * 取得會員電子票卷紀錄
   * @param req
   */
  async getMemberEcVoucherLog(
    req: GetMemberEcVoucherLogDto
  ): Promise<GetMemberEcVoucherLogResp> {
    // 檢核狀態
    if (
      req?.state &&
      !Object.values(ENUM_EC_VOUCHER_STATE).includes(
        req?.state as ENUM_EC_VOUCHER_STATE
      )
    ) {
      throw new CustomerException(configError._200001, HttpStatus.OK);
    }
    // 只要頁數其中一個參數未定義，就使用預設值
    if (!req?.page || !req?.perPage) {
      req.page = 1;
      req.perPage = 20;
    }

    // 依據傳入資料篩選取得資料起訖日
    let filterDate;
    if (req?.startDate && req?.endDate)
      filterDate = await this.DateToUTC(req?.startDate, req?.endDate);

    // 取得電子票券資訊 table 上方資訊
    const memberBillInfo = await this.memberRepository.getMemberEcVoucherInfo(
      req?.memberId
    );
    // 取得訂位資訊歷史資料
    const logInfo = await this.memberRepository.getMemberEcVoucherLogInfo(
      req,
      filterDate?.startDate,
      filterDate?.endDate
    );
    const { logCount, logList } = logInfo;
    const ecVoucherLogCount = logCount?.[0]?.count;

    const textMap = {
      canUseCount: ENUM_EC_VOUCHER_STATE_STR[ENUM_EC_VOUCHER_STATE.CAN_USE],
      writeOffCount: ENUM_EC_VOUCHER_STATE_STR[ENUM_EC_VOUCHER_STATE.WRITE_OFF],
      expiredCount: ENUM_EC_VOUCHER_STATE_STR[ENUM_EC_VOUCHER_STATE.EXPIRED],
      transferCount: ENUM_EC_VOUCHER_STATE_STR[ENUM_EC_VOUCHER_STATE.TRANSFER],
      returnCount: ENUM_EC_VOUCHER_STATE_STR[ENUM_EC_VOUCHER_STATE.RETURN]
    };
    const numberMap = {
      canUseCount: memberBillInfo?.canUseCount ?? 0,
      writeOffCount: memberBillInfo?.writeOffCount ?? 0,
      expiredCount: memberBillInfo?.expiredCount ?? 0,
      transferCount: memberBillInfo?.transferCount ?? 0,
      returnCount: memberBillInfo?.returnCount ?? 0
    };

    const billInfo = Object.keys(textMap).map((key) => ({
      text: textMap[key],
      number: numberMap[key]
    }));

    const metaData = <MetaDataCommon>{};
    metaData.page = req?.page;
    metaData.perPage = req?.perPage;
    metaData.totalCount = ecVoucherLogCount;
    metaData.totalPage = Math.ceil(ecVoucherLogCount / req?.perPage);

    const result = <GetMemberEcVoucherLogResp>{};
    result.metaData = metaData;
    result.billInfo = billInfo;
    result.logList = logList?.map((x) => {
      return {
        ...x,
        amount: `$${Number(x?.amount)?.toLocaleString('en-US')}`
      };
    });
    return result;
  }

  /**
   * 取得會員電子票卷詳細資料
   * @param id 流水號
   */
  async getMemberEcVoucherInfo(
    id: number
  ): Promise<GetMemberEcVoucherInfoResp> {
    const vucherInfo = await this.memberRepository.getEcVoucherInfo(id);
    const resProductInfo = [];

    const result = vucherInfo?.reduce((acc, curr, idx) => {
      if (!idx) {
        const tradeInfo = <TradeInfo>{};
        tradeInfo.tradeDate = curr?.tradeDate;
        tradeInfo.tradeType = curr?.tradeType;
        tradeInfo.tradeNo = curr?.tradeNo;
        tradeInfo.payMethod = curr?.payMethod ?? '--';
        tradeInfo.source = curr?.source ?? '--';
        tradeInfo.invoiceNo = curr?.invoiceNo ?? '--';
        tradeInfo.brandName = curr?.brandName ?? '--';
        tradeInfo.storeName = curr?.storeName ?? '--';
        tradeInfo.mobile = curr?.mobile;
        tradeInfo.name = curr?.name;
        tradeInfo.cardNo = curr?.cardNo;
        tradeInfo.discount = curr?.discount ? curr?.discount : '--';
        tradeInfo.discountPoint = curr?.discountPoint
          ? curr?.discountPoint?.toLocaleString('en-US')
          : '--';
        tradeInfo.originalAmount = curr?.originalAmount
          ? `$${curr?.originalAmount?.toLocaleString('en-US')}`
          : '--';
        tradeInfo.discountAmount = curr?.discountAmount
          ? `$${curr?.discountAmount?.toLocaleString('en-US')}`
          : '--';
        tradeInfo.deliveryFee = curr?.deliveryFee
          ? `$${curr?.deliveryFee?.toLocaleString('en-US')}`
          : '--';
        tradeInfo.realAmount = curr?.realAmount
          ? `$${curr?.realAmount?.toLocaleString('en-US')}`
          : '--';
        acc.tradeInfo = tradeInfo;
      }
      const productInfo = <ProductInfo>{};
      productInfo.productId = curr?.productId;
      productInfo.productName = curr?.productName;
      productInfo.canUseCount = curr?.canUseCount
        ? curr?.canUseCount.toString()
        : '--';
      productInfo.writeOffCount = curr?.writeOffCount
        ? curr?.writeOffCount.toString()
        : '--';
      productInfo.expiredCount = curr?.expiredCount
        ? curr?.expiredCount.toString()
        : '--';
      productInfo.transferCount = curr?.transferCount
        ? curr?.transferCount.toString()
        : '--';
      productInfo.returnCount = curr?.returnCount
        ? curr?.returnCount.toString()
        : '--';
      resProductInfo.push(productInfo);
      acc.productInfo = resProductInfo;

      return acc;
    }, <GetMemberEcVoucherInfoResp>{});

    return result;
  }

  /**
   * 取得紅利點數紀錄
   *
   * @param req
   * @returns
   */
  async getBonusHistory(req: GetBonusHistoryDto): Promise<GetBonusHistoryResp> {
    const preName = 'Member_Point_Log_';
    const logTableByMonth = getLogTableNameByMonth(
      preName,
      req?.startDate,
      req?.endDate
    );
    const logTable = await this.commonService.getExistedTable(logTableByMonth);

    const result = <GetBonusHistoryResp>{};
    if (!logTable?.length) {
      return result;
    }

    const bonusHistory = await this.memberRepository.getBonusHistory(
      req,
      logTable
    );

    const bonusHistoryCount = await this.memberRepository.getBonusHistoryCount(
      req,
      logTable
    );

    const totalPage = Math.ceil(bonusHistoryCount / req?.perPage);

    result.next = req?.page < totalPage ? req?.page : null;
    result.bonusHistory = bonusHistory;

    return result;
  }

  /**
   * 取得總覽分析
   *
   * @param req
   * @returns
   */
  async getOverviewAnalysis(
    req: GetOverviewAnalysisDto
  ): Promise<GetOverviewAnalysisResp> {
    // 取得會員基本資料
    const memberDetail = await this.memberRepository.getMemberDetailByMemberId(
      req?.memberId
    );

    if (!memberDetail) {
      throw new CustomerException(configError._220005, HttpStatus.OK);
    }

    const memberBillInfo = await this.memberRepository.getMemberShipInfo(
      req?.memberId
    );

    const memberShip = await this.memberShipRepository.getMemberShipBranchById(
      memberDetail?.membershipStatus
    );

    let memberShipName = memberShip?.memberShipName;
    let memberShipMethodsName =
      MEMBER_SHIP_GIFT_CN[MEMBER_SHIP_GIFT_STR.RENEWAL] ?? '';
    let consumptionCount =
      memberShip?.purchasedCount - memberBillInfo?.totalCount;
    let consumptionAmount =
      memberShip?.purchasedTimes - memberBillInfo?.totalAmount;
    // 如果非最高等級，則取得下一階會籍資訊
    if (memberShip?.nextShipId) {
      const nextMemberShip =
        await this.memberShipRepository.getMemberShipBranchById(
          memberShip?.nextShipId
        );

      memberShipName = nextMemberShip?.memberShipName;
      memberShipMethodsName =
        MEMBER_SHIP_GIFT_CN[MEMBER_SHIP_GIFT_STR.UPGRADE] ?? '';
      consumptionCount =
        nextMemberShip?.purchasedCount - memberBillInfo?.totalCount;
      consumptionAmount =
        nextMemberShip?.purchasedTimes - memberBillInfo?.totalAmount;
    }

    const registerChannel = [];
    const openChannel = [];
    const channelLog = await this.channelRepository.getMemberChannelLog(
      req?.memberId
    );
    channelLog?.forEach((log) => {
      switch (log?.channelAction) {
        case LOG_ACTION.REGISTER:
          registerChannel.push(log?.channelName);
          break;
        case LOG_ACTION.OPEN_CHANNEL:
          openChannel.push(log?.channelName);
          break;
      }
    });

    // 會員消費品牌
    const orderBrand = await this.orderRepository.getMemberOrderBrand(
      req?.memberId
    );
    const consumptionBrand: ConsumptionBrand[] = [];
    orderBrand?.forEach((data) => {
      consumptionBrand.push({
        brandName: data?.brandName,
        brandCount: data?.orderCount,
        consumptionDate: data?.orderDate
      });
    });

    // 會員消費商品
    const orderCommodity = await this.orderRepository.getMemberOrderCommodity(
      req?.memberId,
      CHANNEL.POS_CHANNEL_ID
    );
    const consumptionCommodity: ConsumptionCommodity[] = [];
    orderCommodity?.forEach((data) => {
      consumptionCommodity.push({
        commodityName: data?.productName,
        commodityCount: Number(data?.productCount),
        consumptionDate: data?.orderDate
      });
    });

    // 電子票券
    const consumptionElectronicCoupon =
      await this.memberRepository.getMemberECVoucherData(req?.memberId);

    const memberShipDetail = <OverviewAnalysisMemberShipDetail>{
      memberShipName: memberShipName,
      memberShipMethodsName: memberShipMethodsName,
      consumptionCount: consumptionCount < 0 ? 0 : consumptionCount,
      consumptionAmount: consumptionAmount < 0 ? 0 : consumptionAmount
    };

    const thisNowDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    const thisYearEnd = moment
      .tz(moment().endOf('year'), process.env.TIME_ZONE)
      .format('YYYY-MM-DD HH:mm:ss');
    const memberExpiringPoint =
      await this.couponRepository.getMemberExpiringPoint(
        req?.memberId,
        thisNowDate,
        thisYearEnd
      );

    const memberLastPoint = await this.couponRepository.getMemberExpiringPoint(
      req?.memberId,
      thisNowDate
    );
    const pointDetail = <OverviewAnalysisPointDetail>{
      lastPoint: memberLastPoint?.point ? Number(memberLastPoint?.point) : 0,
      expiringPoint: memberExpiringPoint?.point
        ? Number(memberExpiringPoint?.point)
        : 0
    };

    const memberTag = await this.tagRepository.getMemberTag(req?.memberId);

    const memberOrderData = await this.memberRepository.getMemberShipOrderData(
      req?.memberId
    );

    const consumptionDetail = <OverviewAnalysisConsumptionDetail>{
      consumptionCount: Number(memberOrderData?.consumptionCount),
      consumptionAmount: Number(memberOrderData?.consumptionAmount)
    };

    const analysis = <Analysis>{};
    analysis.consumptionBrand = consumptionBrand;
    analysis.consumptionCommodity = consumptionCommodity;
    analysis.consumptionElectronicCoupon = consumptionElectronicCoupon;
    analysis.memberShipDetail = memberShipDetail;
    analysis.pointDetail = pointDetail;
    analysis.consumptionDetail = consumptionDetail;

    const result = <GetOverviewAnalysisResp>{};
    result.memberCardId = memberDetail?.cardNumber ?? '--';
    result.birthday = memberDetail?.birthday ?? '--';
    result.gender = memberDetail?.gender;
    result.referralCode = memberDetail?.referralCode ?? '--';
    result.memberShipStartDate = memberBillInfo?.startDate;
    result.memberShipEndDate = memberBillInfo?.endDate;
    result.registerDate = memberDetail?.createTime;
    result.registerChannel = registerChannel?.join(',');
    result.openChannel = openChannel?.join(',');
    result.address = memberDetail?.address;
    result.zipCode = memberDetail?.zipCode;
    result.cityCode = memberDetail?.cityCode;
    result.email = memberDetail?.gmail;
    result.tagNames = memberTag?.map((x) => x.tagName);
    result.analysis = analysis;

    return result;
  }
}
