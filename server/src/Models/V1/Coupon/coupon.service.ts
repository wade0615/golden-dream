import { HttpStatus, Injectable } from '@nestjs/common';

import { Response } from 'express';
import * as fs from 'fs';
import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
import { MetaDataCommon } from 'src/Definition/Dto';
import {
  COUPON_EXCHANGE_TYPE,
  COUPON_EXCHANGE_TYPE_CN,
  COUPON_RELEASE_STATUS_TYPE,
  COUPON_REWARD_RULES_TYPE,
  COUPON_REWARD_RULES_TYPE_CN,
  COUPON_RULE_TYPE,
  COUPON_STATE_TYPE,
  WRITE_OFF_METHODS
} from 'src/Definition/Enum/Coupon/coupon.type.enum';
import {
  MEMBER_COUPON_STATUS,
  MEMBER_DETAIL_COUPON_STATUS,
  MEMBER_DETAIL_COUPON_STATUS_CN
} from 'src/Definition/Enum/Coupon/member.coupon.status.enum';
import {
  ENUM_POINT_TYPE_LOG,
  ENUM_POINT_TYPE_LOG_STR
} from 'src/Definition/Enum/Coupon/point.type.log.enum';
import { UPLOAD_GPC_FILES_TYPE } from 'src/Definition/Enum/Member/upload.member.special.type.enum';
import { REWARD_CARD_TYPE } from 'src/Definition/Enum/RewardCard/reward.card.type.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import { ConvertZip } from 'src/Utils/DataFrame/zip';
import {
  generateSerialNumber,
  getLogTableMonth,
  removeFirstZero,
  secondsUntilEndOfDay
} from 'src/Utils/tools';
import { v4 as ruuidv4 } from 'uuid';
import { CommonRepository } from '../Common/common.repository';
import { MemberRepository } from '../Member/member.repository';
import { MemberService } from '../Member/member.service';
import { UpdRewardSendDetailReq } from '../RewardCard/Interface/upd.reward.send.detail.interface';
import { RewardCardRepository } from '../RewardCard/reward.card.repository';
import { StoreRepository } from '../Store/store.repository';
import {
  DelCouponSendDetailDto,
  DelCouponSettingDetailDto,
  DownloadCouponSendExampleResp,
  ExchangeCouponDto,
  ExchangeCouponResp,
  GetAboutToExpiredCouponDto,
  GetAboutToExpiredCouponResp,
  GetCouponDetailDto,
  GetCouponDetailResp,
  GetCouponSearchDto,
  GetCouponSearchResp,
  GetCouponSendDetailDto,
  GetCouponSendDetailResp,
  GetCouponSendListDto,
  GetCouponSendListResp,
  GetCouponSettingDetailDto,
  GetCouponSettingDetailResp,
  GetCouponSettingListDto,
  GetCouponSettingListResp,
  GetMemberCouponCodeDto,
  GetMemberCouponCodeResp,
  GetMemberCouponDetailDto,
  GetMemberCouponDetailResp,
  GetMemberCouponListDto,
  GetMemberCouponListResp,
  GiveMemberCouponDto,
  UpdCouponSendDetailDto,
  UpdCouponSettingDetailDto
} from './Dto';
import {
  GetCouponDetailListDto,
  GetCouponDetailListResp
} from './Dto/get.coupon.detail.list.dto';
import {
  CouponStatusCount,
  GetMemberCouponDetailListDto,
  GetMemberCouponDetailListResp
} from './Dto/get.member.coupon.detail.list.dto';
import {
  GetMemberCouponDetailByRedeemIdDto,
  GetMemberCouponDetailByRedeemIdResp
} from './Dto/get.member.coupon.detail.redeem.id.dto';
import {
  GetPosMemberCouponDetailDto,
  GetPosMemberCouponDetailResp
} from './Dto/get.pos.member.coupon.detail.dto';
import { RefundCouponDetailDto } from './Dto/refund.coupon.detail.dto';
import { WriteOffCouponDetailDto } from './Dto/write.off.coupon.detail.dto';
import { WriteOffPosCouponDetailDto } from './Dto/write.off.pos.coupon.detail.dto';
import {
  GetMemberPointResp,
  MemberPointLog,
  UsedPoint
} from './Interface/get.member.point.interface';
import { InsCouponDetailReq } from './Interface/ins.coupon.detail.interface';
import { CouponRepository } from './coupon.repository';

import moment = require('moment-timezone');

@Injectable()
export class CouponService {
  constructor(
    private couponRepository: CouponRepository,
    private memberRepository: MemberRepository,
    private commonRepository: CommonRepository,
    private storeRepository: StoreRepository,
    private rewardCardRepository: RewardCardRepository,
    private memberService: MemberService,
    private redisService: RedisService,
    private convertExcel: ConvertExcel,
    private convertZip: ConvertZip,
    private csvDownloadExample: CsvDownloadExample,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得兌換券設定列表
   *
   * @param req
   * @returns
   */
  async getCouponSettingList(
    req: GetCouponSettingListDto
  ): Promise<GetCouponSettingListResp> {
    // 取得列表
    const couponList = await this.couponRepository.getCouponSettingList(req);
    // 取得總數
    const couponCount = await this.couponRepository.getCouponSettingListCount(
      req
    );

    // 整理兌換券 ID
    const couponIds = couponList?.map((couponList) => {
      return couponList?.id;
    });

    const couponBrandIds = {};
    if (couponIds?.length > 0) {
      const couponBrands = await this.couponRepository.getCouponBrands(
        couponIds
      );
      // 整理兌換券 ID 與 品牌的對照表
      for (const coupon of couponBrands) {
        if (!couponBrandIds[coupon?.couponId]) {
          couponBrandIds[coupon?.couponId] = [];
        }
        couponBrandIds[coupon?.couponId].push(coupon?.brandName);
      }
    }

    // TODO 排程計算得數量
    for (const coupon of couponList) {
      // TODO 預計改為 redis
      const couponCount = await this.couponRepository.getCouponCount(
        coupon?.id
      );
      coupon.lastCount = coupon?.quantity - couponCount;
      coupon.brandNames = couponBrandIds[coupon?.id];

      coupon.releaseStatus =
        Number(COUPON_REWARD_RULES_TYPE.POINT) == coupon.rewardRule ||
        Number(COUPON_REWARD_RULES_TYPE.REWARD_CARD) == coupon.rewardRule ||
        Number(COUPON_REWARD_RULES_TYPE.BIRTHDAY) == coupon.rewardRule
          ? coupon.releaseStatus
          : req?.state == COUPON_STATE_TYPE.ING
          ? true
          : false;
    }

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: couponCount,
      totalPage: Math.ceil(couponCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetCouponSettingListResp>{};
    result.metaData = metaData;
    result.couponSettingList = couponList;

    return result;
  }

  /**
   * 取得兌換券設定詳細資料
   *
   * @param req
   * @returns
   */
  async getCouponSettingDetail(
    req: GetCouponSettingDetailDto
  ): Promise<GetCouponSettingDetailResp> {
    // 取得詳細資料
    const couponDetail = await this.couponRepository.getCouponSettingDetail(
      req?.couponId
    );

    if (!couponDetail) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    // 取得會員等級
    const couponMemberShips = await this.couponRepository.getCouponMemberShip(
      req?.couponId
    );

    // 取得兌換券已領取數
    const couponMemberCount = await this.couponRepository.getCouponCount(
      req?.couponId
    );

    // 取得品牌
    const couponBrands = await this.couponRepository.getCouponBrand(
      req?.couponId
    );

    // 取得門市
    const couponStores = await this.couponRepository.getCouponStore(
      req?.couponId
    );

    const result = <GetCouponSettingDetailResp>{};
    result.brands = couponBrands;
    result.stores = couponStores;
    result.couponDetail = couponDetail;
    result.couponDetail.memberReceiveCount = couponMemberCount;
    result.couponDetail.lastCount = couponDetail?.quantity - couponMemberCount;
    result.memberShips = couponMemberShips?.map((memberShip) => {
      return memberShip?.memberShipId;
    });

    return result;
  }

  /**
   * 修改兌換券詳細資料
   *
   * @param req
   * @returns
   */
  async updCouponSettingDetail(
    req: UpdCouponSettingDetailDto
  ): Promise<Record<string, never>> {
    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    const releaseDate =
      req?.releaseStatus == Number(COUPON_RELEASE_STATUS_TYPE.PUBLISHED)
        ? now
        : null;

    // 編輯
    if (req?.couponId) {
      // 取得詳細資料
      const couponDetail = await this.couponRepository.getCouponSettingDetail(
        req?.couponId
      );

      if (!couponDetail) {
        throw new CustomerException(configError._320001, HttpStatus.OK);
      }

      const couponCount = await this.couponRepository.getCouponCount(
        req?.couponId
      );
      // 判斷活動開始後，不可小於會員領取數量
      if (
        (couponDetail?.rewardRule == COUPON_REWARD_RULES_TYPE.POINT ||
          couponDetail?.rewardRule == COUPON_REWARD_RULES_TYPE.BACKSTAGE) &&
        moment(couponDetail?.startDate).isBefore(moment().utc()) &&
        req?.quantity < couponCount
      ) {
        throw new CustomerException(configError._320006, HttpStatus.OK);
      }

      // 判斷活動結束後，不可編輯
      if (moment(couponDetail?.endDate).isBefore(moment().utc())) {
        throw new CustomerException(configError._320009, HttpStatus.OK);
      }

      // 進行中的兌換券只可編輯下架時間、兌換截止時間、發佈狀態、發行數量、使用說明
      if (
        moment(couponDetail?.startDate).isBefore(moment().utc()) &&
        moment(couponDetail?.endDate).isAfter(moment().utc())
      ) {
        const updData = {
          On_Sold_End_Date: req?.endDate,
          Redemption_End_Date: req?.redemptionEndDate
            ? req?.redemptionEndDate
            : null,
          Release_Status: req?.releaseStatus,
          Release_Date: releaseDate,
          Quantity: req?.quantity,
          Usage_Description: req?.description,
          Alter_ID: req?.iam?.authMemberId
        };

        await this.couponRepository.updCouponSpecifySettingDetail(
          req?.couponId,
          updData
        );

        return {};
      }
    } else {
      const date = moment().tz(process.env.TIME_ZONE).format('YYMMDD');
      req.couponId = await this.createCouponId(date);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 修改兌換券詳細資料
      await this.couponRepository.updCouponSettingDetail(
        connection,
        req,
        releaseDate
      );

      await this.couponRepository.initCouponMemberShip(
        connection,
        req?.couponId,
        req?.iam?.authMemberId
      );

      if (req?.memberShip?.length > 0) {
        // 修改會籍關聯
        await this.couponRepository.insCouponMemberShip(
          connection,
          req?.couponId,
          req?.memberShip,
          req?.iam?.authMemberId
        );
      }

      // 初始化兌換券品牌
      await this.couponRepository.initCouponBrand(
        connection,
        req?.couponId,
        req?.iam?.authMemberId
      );

      if (req?.brands?.length > 0) {
        // 修改品牌關聯
        await this.couponRepository.insCouponBrand(
          connection,
          req?.couponId,
          req?.brands,
          req?.iam?.authMemberId
        );
      }

      // 初始化兌換券門市
      await this.couponRepository.initCouponStore(
        connection,
        req?.couponId,
        req?.iam?.authMemberId
      );

      if (req?.stores?.length > 0) {
        // 修改門市關聯
        await this.couponRepository.insCouponStore(
          connection,
          req?.couponId,
          req?.stores,
          req?.iam?.authMemberId
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._320010, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 刪除兌換券詳細資料
   *
   * @param req
   * @returns
   */
  async delCouponSettingDetail(
    req: DelCouponSettingDetailDto
  ): Promise<Record<string, never>> {
    // 取得詳細資料
    const couponDetail = await this.couponRepository.getCouponSettingDetail(
      req?.couponId
    );

    if (!couponDetail) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    // 判斷上架時間
    if (moment(couponDetail?.startDate).utc().isBefore(moment().utc())) {
      throw new CustomerException(configError._320002, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 軟刪除 詳細資料
      await this.couponRepository.delCouponSettingDetail(
        connection,
        req?.couponId,
        req?.iam?.authMemberId
      );

      // 軟刪除 會籍
      await this.couponRepository.delCouponMemberShip(
        connection,
        req?.couponId,
        req?.iam?.authMemberId
      );

      // 軟刪除 品牌關聯
      await this.couponRepository.delCouponBrand(
        connection,
        req?.couponId,
        req?.iam?.authMemberId
      );

      // 軟刪除 門市關聯
      await this.couponRepository.delCouponStore(
        connection,
        req?.couponId,
        req?.iam?.authMemberId
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._320011, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 取得兌換券發放列表
   *
   * @param req
   * @returns
   */
  async getCouponSendList(
    req: GetCouponSendListDto
  ): Promise<GetCouponSendListResp> {
    const couponSendList = await this.couponRepository.getCouponSendList(req);

    const couponCount = await this.couponRepository.getCouponSendListCount(req);

    for (const coupon of couponSendList) {
      const couponSend = await this.couponRepository.getCouponSendMap(
        coupon?.id
      );

      coupon.couponType = couponSend[0]?.couponType;
    }

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: couponCount,
      totalPage: Math.ceil(couponCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetCouponSendListResp>{};
    result.metaData = metaData;
    result.couponSendList = couponSendList;

    return result;
  }

  /**
   * 取得兌換券發放詳細資料
   *
   * @param req
   * @returns
   */
  async getCouponSendDetail(
    req: GetCouponSendDetailDto
  ): Promise<GetCouponSendDetailResp> {
    const couponDetail = await this.couponRepository.getCouponSendDetail(
      req?.sendId
    );

    if (!couponDetail) {
      throw new CustomerException(configError._320007, HttpStatus.OK);
    }

    const couponIssuance = await this.couponRepository.getCouponSendMap(
      req?.sendId
    );

    const couponIssuanceMember =
      await this.couponRepository.getCouponIssuanceMemberByCisId(req?.sendId);

    const memberIds = [];
    couponIssuanceMember?.forEach((member) => {
      if (!memberIds.includes(member.memberId)) {
        memberIds.push(member.memberId);
      }
    });

    const result = <GetCouponSendDetailResp>{};
    result.name = couponDetail?.name;
    result.cisDate = couponDetail?.cisDate;
    result.remark = couponDetail?.remark;
    result.mobileCountryCode = couponIssuanceMember
      ? couponIssuanceMember?.[0]?.mobileCountryCode
      : '';
    result.mobile = couponIssuanceMember
      ? couponIssuanceMember?.[0]?.mobile
      : '';
    result.memberName = couponIssuanceMember
      ? couponIssuanceMember?.[0]?.memberName
      : '';
    result.couponSendDetail = couponIssuance;
    result.memberExcelUrl = couponDetail?.excelUrl;
    result.memberExcelCount = memberIds?.length;

    return result;
  }

  /**
   * 修改兌換券發放詳細資料
   *
   * @param file
   * @param req
   * @param userId
   * @returns
   */
  async updCouponSendDetail(
    file: Express.Multer.File,
    req: UpdCouponSendDetailDto,
    userId: string
  ): Promise<Record<string, never>> {
    req.mobile = removeFirstZero(req?.mobile);

    let memberIds = [];
    let relationId = null;
    // 編輯未重新上傳 Csv，無需編輯會員
    if (req?.memberExcelUrl) {
      relationId = await this.commonRepository.getFilesDetail(
        UPLOAD_GPC_FILES_TYPE.CSV,
        req?.memberExcelUrl
      );
      // 有上傳檔案
    } else if (file?.originalname) {
      const mobileDate = await this.memberService.chkUploadMobileCsv(
        file,
        true
      );

      const csvMemberId = await this.memberRepository.getTempCsvMemberId(
        mobileDate?.csvTempTableName,
        mobileDate?.csvSql
      );

      memberIds = csvMemberId?.map((data) => {
        return data?.memberId;
      });

      relationId = ruuidv4();
      await this.commonRepository.insFilesDetail(
        relationId,
        UPLOAD_GPC_FILES_TYPE.CSV,
        mobileDate?.urls?.[0]
      );
      // 指定會員
    } else if (req?.mobileCountryCode && req?.mobile) {
      const memberDetail = await this.memberRepository.getMemberDetailByMobile(
        req?.mobileCountryCode,
        req?.mobile
      );
      if (!memberDetail) {
        throw new CustomerException(configError._220005, HttpStatus.OK);
      }

      memberIds = [memberDetail?.id];
    } else {
      throw new CustomerException(configError._200001, HttpStatus.OK);
    }

    // 判斷指定發送日
    if (
      req?.cisType == 2 &&
      moment(req?.cisDate).utc().isBefore(moment().utc())
    ) {
      throw new CustomerException(configError._320004, HttpStatus.OK);
    }

    const couponDetails = await this.couponRepository.getCouponSettingDetails(
      req?.couponIds
    );
    // 檢查兌換券 ID 是否存在
    if (couponDetails?.length != req?.couponIds?.length) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    const date = moment().tz(process.env.TIME_ZONE).format('YYMMDD');
    if (req?.sendId) {
      const couponDetail = await this.couponRepository.getCouponSendDetail(
        req?.sendId
      );

      if (!couponDetail) {
        throw new CustomerException(configError._320003, HttpStatus.OK);
      }
    } else {
      req.sendId = await this.createCisId(date);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 修改兌換券發放詳細資料
      await this.couponRepository.insCouponIssuanceDetail(
        connection,
        req,
        relationId,
        userId
      );

      // 初始化發送兌換券關聯
      await this.couponRepository.initCouponIssuanceMap(
        connection,
        req?.couponIds,
        req?.sendId,
        userId
      );

      // 新增兌換券 ID 關聯
      await this.couponRepository.insCouponIssuanceMap(
        connection,
        req?.sendId,
        req?.couponIds,
        userId
      );

      await this.couponRepository.initCouponIssuanceMember(
        connection,
        req?.couponIds,
        req?.sendId,
        userId
      );

      if (memberIds?.length > 0) {
        await this.couponRepository.insCouponIssuanceMember(
          connection,
          req?.couponIds,
          req?.sendId,
          memberIds,
          userId
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._320012, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    // 如果即刻處理，直接發給會員
    const couponStatus =
      req?.cisType == 1
        ? MEMBER_COUPON_STATUS.RECEIVED
        : MEMBER_COUPON_STATUS.NOT_RECEIVED;

    for (const memberId of memberIds) {
      for (const coupon of couponDetails) {
        // 創建兌換券唯一碼
        const redeemId = await this.createRedeemId(date);
        // 創建交易唯一碼
        const transactionId = await this.createCouponTransactionId(date);
        // 過期時間
        const expiredDate =
          coupon?.couponRule == COUPON_RULE_TYPE.DATE
            ? coupon?.couponEndDate
            : moment()
                .add(coupon?.earliestPickupDate, 'day')
                .format('YYYY-MM-DD HH:mm');

        const insCouponDetail = <InsCouponDetailReq>{
          redeemId: redeemId,
          couponId: coupon?.couponId,
          cisId: req?.sendId,
          rewardCardId: null,
          transactionId: transactionId,
          transactionType: couponStatus,
          transactionDate: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
          memberId: memberId,
          transferMemberId: '',
          point: 0,
          reward: 0,
          expiredDate: expiredDate,
          createId: userId,
          alterId: userId
        };

        await this.couponRepository.insCouponDetail(
          connection,
          insCouponDetail
        );
      }
    }

    return {};
  }

  /**
   * 刪除兌換券發放詳細資料
   *
   * @param req
   * @returns
   */
  async delCouponSendDetail(
    req: DelCouponSendDetailDto
  ): Promise<Record<string, never>> {
    const couponDetail = await this.couponRepository.getCouponSendDetail(
      req?.sendId
    );

    if (!couponDetail) {
      throw new CustomerException(configError._320003, HttpStatus.OK);
    }

    // 判斷執行時間未開始，未開始才可刪除
    if (moment(couponDetail?.cisDate).utc().isBefore(moment().utc())) {
      throw new CustomerException(configError._320008, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 軟刪除兌換券發放詳細資料
      await this.couponRepository.delCouponSendDetail(
        connection,
        req?.sendId,
        req?.iam?.authMemberId
      );

      // 軟刪除 兌換券關聯表
      await this.couponRepository.delCouponSendMap(
        connection,
        req?.sendId,
        req?.iam?.authMemberId
      );

      // 軟刪除 會員關聯表
      await this.couponRepository.delCouponSendMemberDetail(
        connection,
        req?.sendId,
        req?.iam?.authMemberId
      );

      // 軟刪除 會員未領取的兌換券
      await this.couponRepository.delMemberCouponDetail(
        connection,
        req?.sendId,
        req?.iam?.authMemberId
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._320013, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 下載範本
   *
   * @param res
   * @returns
   */
  async downloadCouponSendExample(
    res: Response
  ): Promise<DownloadCouponSendExampleResp> {
    const buffer = await this.csvDownloadExample.mobileCsvExample('選擇會員');

    const filename = '選擇會員_匯入範本.csv';
    const mimeType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`
    );

    res.send(buffer);

    const result = <DownloadCouponSendExampleResp>{};
    result.buffer = buffer;

    return result;
  }

  /**
   * 依優惠券/商品券編號取得兌換券詳細資料
   *
   * @param req
   * @returns
   */
  async getMemberCouponDetailByRedeemId(
    req: GetMemberCouponDetailByRedeemIdDto
  ): Promise<GetMemberCouponDetailByRedeemIdResp> {
    const couponDetail =
      await this.couponRepository.getMemberCouponDetailByRedeemId(
        req?.redeemId
      );

    if (!couponDetail) {
      throw new CustomerException(
        req?.methods == WRITE_OFF_METHODS.WRITE_OFF
          ? configError._320035
          : configError._320036,
        HttpStatus.OK
      );
    }

    if (moment(couponDetail?.couponEndDate).isBefore(moment().utc())) {
      throw new CustomerException(
        req?.methods == WRITE_OFF_METHODS.WRITE_OFF
          ? configError._320028
          : configError._320032,
        HttpStatus.OK
      );
    }

    // 判斷兌換券狀態
    switch (couponDetail?.transactionType) {
      case MEMBER_COUPON_STATUS.RECEIVED:
        if (req?.methods == WRITE_OFF_METHODS.CANCEL_WRITE_OFF) {
          throw new CustomerException(configError._320029, HttpStatus.OK);
        }
        break;
      case MEMBER_COUPON_STATUS.VERIFIED:
        if (req?.methods == WRITE_OFF_METHODS.WRITE_OFF) {
          throw new CustomerException(configError._320025, HttpStatus.OK);
        }
        break;
      case MEMBER_COUPON_STATUS.TRANSFERRED:
        throw new CustomerException(
          req?.methods == WRITE_OFF_METHODS.WRITE_OFF
            ? configError._320026
            : configError._320030,
          HttpStatus.OK
        );
      case MEMBER_COUPON_STATUS.RETURNED:
        throw new CustomerException(
          req?.methods == WRITE_OFF_METHODS.WRITE_OFF
            ? configError._320027
            : configError._320031,
          HttpStatus.OK
        );
    }

    const memberDetail = await this.memberRepository.getMemberDetailByMemberId(
      couponDetail?.memberId
    );

    // 檢查核銷品牌是否符合票券適用品牌
    const couponBrand = await this.couponRepository.getCouponBrand(
      couponDetail?.couponId
    );
    const isBrandId = couponBrand?.some((item, index) => {
      return item.brandId == req?.brandId || item.isCorporation;
    });

    if (!isBrandId) {
      throw new CustomerException(
        req?.methods == WRITE_OFF_METHODS.WRITE_OFF
          ? configError._320033
          : configError._320034,
        HttpStatus.OK
      );
    }

    // 檢查核銷門市是否符合票券適用門市
    const couponStore = await this.couponRepository.getCouponStore(
      couponDetail?.couponId
    );
    if (couponStore?.length > 0) {
      const isStoreId = couponStore?.some((item, index) => {
        return item.storeId == req?.storeId;
      });

      if (!isStoreId) {
        throw new CustomerException(
          req?.methods == WRITE_OFF_METHODS.WRITE_OFF
            ? configError._320033
            : configError._320034,
          HttpStatus.OK
        );
      }
    }

    const result = <GetMemberCouponDetailByRedeemIdResp>{
      redeemId: req?.redeemId,
      couponName: couponDetail?.couponName,
      couponType: couponDetail?.couponType,
      brandNames:
        couponBrand?.map((coupon) => {
          return coupon?.brandName;
        }) ?? [],
      memberName: memberDetail?.name,
      memberCardId: memberDetail?.cardNumber
    };

    return result;
  }

  /**
   * 核銷兌換券
   *
   * @param req
   * @returns
   */
  async writeOffCouponDetail(
    req: WriteOffCouponDetailDto
  ): Promise<Record<string, never>> {
    const couponDetail =
      await this.couponRepository.getMemberCouponDetailByRedeemIds(
        req?.redeemIds
      );
    if (req?.redeemIds?.length != couponDetail?.length) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    const storeDetail = await this.storeRepository.getStoreDetail(req?.storeId);
    if (!storeDetail) {
      throw new CustomerException(configError._240001, HttpStatus.OK);
    }

    let transactionType: number;
    let transactionDate: string;
    let storeId: string;
    const errTransactionType = [];
    switch (req?.methods) {
      case WRITE_OFF_METHODS.WRITE_OFF:
        for (const coupon of couponDetail) {
          if (coupon.transactionType != MEMBER_COUPON_STATUS.RECEIVED) {
            errTransactionType.push(coupon.redeemId);
          }
        }

        transactionType = MEMBER_COUPON_STATUS.VERIFIED;
        transactionDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        storeId = req?.storeId;
        break;
      case WRITE_OFF_METHODS.CANCEL_WRITE_OFF:
        for (const coupon of couponDetail) {
          if (coupon.transactionType != MEMBER_COUPON_STATUS.VERIFIED) {
            errTransactionType.push(coupon.redeemId);
          }
        }

        transactionType = MEMBER_COUPON_STATUS.RECEIVED;
        transactionDate = null;
        storeId = null;
        break;
      default:
        throw new CustomerException(configError._320016, HttpStatus.OK);
    }

    if (errTransactionType?.length > 0) {
      throw new CustomerException(
        {
          code: configError._320017.code,
          msg: `${configError._320017.msg}${errTransactionType.join('、')}`
        },
        HttpStatus.OK
      );
    }

    await this.couponRepository.writeOffCouponDetail(
      req?.redeemIds,
      storeId,
      transactionType,
      transactionDate,
      req?.iam?.authMemberId
    );

    return {};
  }

  /**
   * 取得兌換券明細列表
   *
   * @param req
   * @returns
   */
  async getCouponDetailList(
    req: GetCouponDetailListDto
  ): Promise<GetCouponDetailListResp> {
    // 如果字數超過 2 個字去除第一個 0
    if (req?.search?.length >= 2) {
      req.search = removeFirstZero(req?.search);
    }

    const couponDetailList = await this.couponRepository.getCouponDetailList(
      req
    );

    const couponDetailListCount =
      await this.couponRepository.getCouponDetailListCount(req);

    const couponIds = [];
    if (couponDetailList?.length > 0) {
      for (const couponDetail of couponDetailList) {
        if (!couponIds.includes(couponDetail.couponId)) {
          couponIds.push(couponDetail.couponId);
        }

        couponDetail.transactionType = Number(
          await this.convertCouponDetailTransactionType(
            couponDetail.transactionType,
            couponDetail.couponEndDate
          )
        );
      }

      const couponBrands = await this.couponRepository.getCouponBrands(
        couponIds
      );

      // 整理兌換券 ID 與 品牌的對照表
      const couponBrandIds = {};
      for (const coupon of couponBrands) {
        if (!couponBrandIds[coupon?.couponId]) {
          couponBrandIds[coupon?.couponId] = [];
        }
        couponBrandIds[coupon?.couponId].push(coupon?.brandName);
      }

      couponDetailList?.forEach((detail) => {
        detail.brandNames = couponBrandIds[detail.couponId];
      });
    }

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: couponDetailListCount,
      totalPage: Math.ceil(couponDetailListCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetCouponDetailListResp>{};
    result.metaData = metaData;
    result.couponDetailList = couponDetailList;

    return result;
  }

  /**
   * 退貨兌換券
   *
   * @param req
   * @returns
   */
  async refundCouponDetail(
    req: RefundCouponDetailDto
  ): Promise<Record<string, never>> {
    const couponDetail =
      await this.couponRepository.getMemberCouponDetailByTransactionId(
        req?.transactionId
      );

    if (!couponDetail) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    // 判斷非普通兌換or非集點卡兌換，不可退貨
    if (
      couponDetail?.rewardRule != COUPON_REWARD_RULES_TYPE.POINT &&
      couponDetail?.rewardRule != COUPON_REWARD_RULES_TYPE.REWARD_CARD
    ) {
      throw new CustomerException(configError._320019, HttpStatus.OK);
    }

    // 判斷兌換券為轉贈狀態與兌換券是受贈的不可退貨
    if (
      couponDetail?.transactionType == MEMBER_COUPON_STATUS.TRANSFERRED ||
      couponDetail?.donorMemberId
    ) {
      throw new CustomerException(configError._320020, HttpStatus.OK);
    }

    // 狀態為已退貨，不可再退貨
    if (couponDetail?.transactionType == MEMBER_COUPON_STATUS.RETURNED) {
      throw new CustomerException(configError._320018, HttpStatus.OK);
    }

    const memberPoints = await this.rewardCardRepository.getRewardMemberBalance(
      couponDetail?.rewardCardId,
      couponDetail?.memberId
    );

    const date = moment().tz(process.env.TIME_ZONE).format('YYMMDD');
    // 創建交易唯一碼
    const transactionId = await this.createCouponTransactionId(date);

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      // 更改狀態 已退貨 添加退貨日
      await this.couponRepository.refundCouponDetail(
        connection,
        req?.transactionId,
        req?.iam?.authMemberId
      );

      if (couponDetail?.point > 0) {
        // TODO 返還積點
        // TODO 新增積點明細
      }

      if (couponDetail?.reward > 0) {
        const addData = <UpdRewardSendDetailReq>{};
        addData.memberId = couponDetail?.memberId;
        addData.rewardCardId = couponDetail?.rewardCardId;
        addData.risId = null;
        addData.couponId = couponDetail?.couponId;
        addData.transactionId = transactionId;
        addData.transactionDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');

        // 如果集點卡已下架
        if (moment(couponDetail?.endDate).isBefore(moment().utc())) {
          addData.transactionType = REWARD_CARD_TYPE.REWARD_EXPIRED;
          addData.rewardPoint = couponDetail?.reward;
          addData.lastPoint = 0;
        } else {
          await this.rewardCardRepository.updRewardMemberBalance(
            connection,
            couponDetail?.reward,
            couponDetail?.rewardCardId,
            couponDetail?.memberId,
            req?.iam?.authMemberId
          );

          addData.transactionType = REWARD_CARD_TYPE.ORDER_RETURN;
          addData.rewardPoint = couponDetail?.reward;
          addData.lastPoint = memberPoints + couponDetail?.reward;
        }

        await this.rewardCardRepository.insRewardDetail(
          connection,
          addData,
          req?.iam?.authMemberId
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._320018, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 匯出兌換券明細列表
   *
   * @param res
   * @param req
   * @returns
   */
  async exportCouponDetailList(res: Response, req: GetCouponDetailListDto) {
    // excel 主目錄
    const dir = `${__dirname}/excel`;
    // excel 子目錄
    const dirUUID = `${__dirname}/excel/${ruuidv4()}`;

    const today = moment().utc().format('YYYYMMDD');

    // 如果字數超過 2 個字去除第一個 0
    if (req?.search?.length >= 2) {
      req.search = removeFirstZero(req?.search);
    }

    // 初始化分頁
    req.page = 1;
    req.perPage = 15000;

    const couponTypeStr = COUPON_EXCHANGE_TYPE_CN[req.couponType] ?? '';

    while (true) {
      const couponDetailList = await this.couponRepository.getCouponDetailList(
        req
      );

      if (!couponDetailList || couponDetailList.length == 0) {
        break;
      }

      const couponIds = [];
      couponDetailList.forEach((couponDetail) => {
        if (!couponIds.includes(couponDetail.couponId)) {
          couponIds.push(couponDetail.couponId);
        }
      });

      const couponBrands = await this.couponRepository.getCouponBrands(
        couponIds
      );
      // 整理兌換券 ID 與 品牌的對照表
      const couponBrandIds = {};
      for (const coupon of couponBrands) {
        if (!couponBrandIds[coupon?.couponId]) {
          couponBrandIds[coupon?.couponId] = [];
        }
        couponBrandIds[coupon?.couponId].push(coupon?.brandName);
      }

      const rows = [];
      for (const couponDetail of couponDetailList) {
        const couponDetailType = await this.convertCouponDetailTransactionType(
          couponDetail.transactionType,
          couponDetail.couponEndDate
        );

        rows.push([
          couponDetail.channelName,
          COUPON_REWARD_RULES_TYPE_CN[couponDetail.rewardRule] ?? '',
          couponBrandIds[couponDetail.couponId]
            ? couponBrandIds[couponDetail.couponId].join('、')
            : '',
          couponDetail?.couponName,
          MEMBER_DETAIL_COUPON_STATUS_CN[couponDetailType] ?? '',
          couponDetail.rewardRule == COUPON_REWARD_RULES_TYPE.POINT
            ? couponDetail.point
            : '--',
          couponDetail.rewardRule == COUPON_REWARD_RULES_TYPE.REWARD_CARD
            ? couponDetail.reward
            : '--',
          couponDetail.memberCardId,
          couponDetail.memberName,
          couponDetail.mobileCountryCode,
          couponDetail.mobile,
          couponDetail.transactionDate
            ? moment
                .tz(couponDetail.transactionDate, process.env.TIME_ZONE)
                .format('YYYY/MM/DD HH:mm')
            : '--',
          couponDetail.couponEndDate
            ? moment
                .tz(couponDetail.couponEndDate, process.env.TIME_ZONE)
                .format('YYYY/MM/DD HH:mm')
            : '--',
          couponDetail.writeOffDate
            ? moment
                .tz(couponDetail.writeOffDate, process.env.TIME_ZONE)
                .format('YYYY/MM/DD HH:mm')
            : '--',
          couponDetail.transferDate
            ? moment
                .tz(couponDetail.transferDate, process.env.TIME_ZONE)
                .format('YYYY/MM/DD HH:mm')
            : '--',
          couponDetail.returnDate
            ? moment
                .tz(couponDetail.returnDate, process.env.TIME_ZONE)
                .format('YYYY/MM/DD HH:mm')
            : '--',
          couponDetail.writeOffStoreName ?? '--',
          couponDetail.transactionId,
          couponDetail.transferMemberCardId ?? '--'
        ]);
      }

      const excelFileName = `${today}-${req.page}-${couponTypeStr}明細.xlsx`;

      await this.convertExcel.couponDetailListToExcel(
        rows,
        excelFileName,
        couponTypeStr,
        dir,
        dirUUID
      );

      req.page++;
    }

    // 沒有資料不需要壓縮 zip
    if (req.page == 1) {
      return {};
    }

    // zip 目錄的路徑
    const zipFolderPath = `${__dirname}/zip`;
    // zip 檔案的路径
    const zipFilePath = `${zipFolderPath}/${ruuidv4()}.zip`;

    // 檔案壓縮
    await this.convertZip.filesCompression(zipFolderPath, zipFilePath, dirUUID);

    // 创建可读流来读取 ZIP 文件
    const file = fs.createReadStream(zipFilePath);

    const zipFileName = `${today}-${couponTypeStr}明細.zip`;

    // 设置响应头，指定文件类型为 ZIP
    res.setHeader('Content-Type', 'application/zip');
    // 设置响应头，指定文件名
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${encodeURIComponent(zipFileName)}`
    );

    // 将 ZIP 文件发送给客户端
    file.pipe(res);

    return {};
  }

  /**
   * 取得會員兌換券明細列表
   *
   * @param req
   * @returns
   */
  async getMemberCouponDetailList(
    req: GetMemberCouponDetailListDto
  ): Promise<GetMemberCouponDetailListResp> {
    const memberCouponList =
      await this.couponRepository.getMemberCouponDetailList(req);

    const memberCouponListCount =
      await this.couponRepository.getMemberCouponDetailListCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: memberCouponListCount,
      totalPage: Math.ceil(memberCouponListCount / req?.perPage)
    } as MetaDataCommon;

    const couponIds = [];
    if (memberCouponList?.length > 0) {
      for (const couponDetail of memberCouponList) {
        if (!couponIds.includes(couponDetail.couponId)) {
          couponIds.push(couponDetail.couponId);
        }

        couponDetail.transactionType = Number(
          await this.convertCouponDetailTransactionType(
            couponDetail.transactionType,
            couponDetail.couponEndDate
          )
        );
      }

      const couponBrands = await this.couponRepository.getCouponBrands(
        couponIds
      );

      // 整理兌換券 ID 與 品牌的對照表
      const couponBrandIds = {};
      for (const coupon of couponBrands) {
        if (!couponBrandIds[coupon?.couponId]) {
          couponBrandIds[coupon?.couponId] = [];
        }
        couponBrandIds[coupon?.couponId].push(coupon?.brandName);
      }

      memberCouponList?.forEach((detail) => {
        detail.brandNames = couponBrandIds[detail.couponId];
      });
    }

    const couponStatusCount = <CouponStatusCount>{
      validCount: 0,
      redeemedCount: 0,
      expiredCount: 0,
      transferredCount: 0,
      returnedCount: 0
    };
    const memberCouponStatus =
      await this.couponRepository.getMemberCouponStatusCount(
        req?.memberId,
        req?.couponType
      );

    memberCouponStatus?.forEach((detail) => {
      switch (detail?.transactionType) {
        case MEMBER_COUPON_STATUS.RECEIVED:
          if (detail?.isExpired) {
            couponStatusCount.expiredCount += detail?.couponDetailCount;
          } else {
            couponStatusCount.validCount += detail?.couponDetailCount;
          }

          break;
        case MEMBER_COUPON_STATUS.VERIFIED:
          couponStatusCount.redeemedCount += detail?.couponDetailCount;
          break;
        case MEMBER_COUPON_STATUS.TRANSFERRED:
          couponStatusCount.transferredCount += detail?.couponDetailCount;
          break;
        case MEMBER_COUPON_STATUS.RETURNED:
          couponStatusCount.returnedCount += detail?.couponDetailCount;
          break;
      }
    });

    const result = <GetMemberCouponDetailListResp>{};
    result.metaData = metaData;
    result.couponStatusCount = couponStatusCount;
    result.memberCouponList = memberCouponList;

    return result;
  }

  /**
   * 取得會員票券列表
   *
   * @param req
   * @returns
   */
  async getMemberCouponList(
    req: GetMemberCouponListDto
  ): Promise<GetMemberCouponListResp> {
    const memberCouponList = await this.couponRepository.getMemberCouponList(
      req?.memberId,
      req?.page,
      req?.perPage
    );

    const memberCouponListCount =
      await this.couponRepository.getMemberCouponListCount(req?.memberId);

    const couponBrandIds = {};
    if (memberCouponList?.length) {
      // 整理兌換券 ID
      const couponIds = memberCouponList?.map((couponList) => {
        return couponList?.couponId;
      });

      const couponBrands = await this.couponRepository.getCouponBrands(
        couponIds
      );
      couponBrands?.forEach((brand) => {
        if (!couponBrandIds[brand?.couponId]) {
          couponBrandIds[brand?.couponId] = [];
        }

        couponBrandIds[brand?.couponId].push(brand?.brandId);
      });

      // 總整理列表帶入兌換券 ID 對應的品牌與贈送者國碼與手機號碼
      memberCouponList?.forEach((couponList) => {
        couponList.brandIds = couponBrandIds[couponList?.couponId];
      });
    }

    const totalPage = Math.ceil(memberCouponListCount / req?.perPage);

    const result = <GetMemberCouponListResp>{};
    result.couponList = memberCouponList;
    result.next = req?.page < totalPage ? req?.page : null;

    return result;
  }

  /**
   * 取得會員票券詳情
   *
   * @param req
   * @returns
   */
  async getMemberCouponDetail(
    req: GetMemberCouponDetailDto
  ): Promise<GetMemberCouponDetailResp> {
    const memberCouponDetail =
      await this.couponRepository.getMemberCouponDetailBySeq(
        req?.memberId,
        req?.couponSeq
      );
    if (!memberCouponDetail) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    const couponBrands = await this.couponRepository.getCouponBrands([
      memberCouponDetail?.couponId
    ]);

    const memberDetail = await this.memberRepository.getMemberDetailByMemberId(
      memberCouponDetail?.transferMemberId
    );

    const donorMemberDetail =
      await this.memberRepository.getMemberDetailByMemberId(
        memberCouponDetail?.donorMemberId
      );

    // 整理兌換券 ID 與 品牌的對照表
    const couponBrandIds = {};
    for (const coupon of couponBrands) {
      if (!couponBrandIds[coupon?.couponId]) {
        couponBrandIds[coupon?.couponId] = [];
      }
      couponBrandIds[coupon?.couponId].push(coupon?.brandId);
    }
    memberCouponDetail.brandIds =
      couponBrandIds[memberCouponDetail?.couponId] ?? [];

    memberCouponDetail.transferorCountryCode =
      memberDetail?.mobileCountryCode ?? '';
    memberCouponDetail.transferorMobile = memberDetail?.mobile ?? '';

    memberCouponDetail.donorCountryCode =
      donorMemberDetail?.mobileCountryCode ?? '';
    memberCouponDetail.donorMobile = donorMemberDetail?.mobile ?? '';

    const result = <GetMemberCouponDetailResp>{};
    result.couponDetail = memberCouponDetail;

    return result;
  }

  /**
   * 取得票券兌換碼
   *
   * @param req
   * @returns
   */
  async getMemberCouponCode(
    req: GetMemberCouponCodeDto
  ): Promise<GetMemberCouponCodeResp> {
    const couponDetail = await this.couponRepository.getMemberCouponDetailBySeq(
      req?.memberId,
      req?.couponSeq
    );

    const couponBrands = await this.couponRepository.getCouponBrands([
      couponDetail?.couponId
    ]);
    // 整理兌換券 ID 與 品牌的對照表
    const couponBrandIds = {};
    for (const coupon of couponBrands) {
      if (!couponBrandIds[coupon?.couponId]) {
        couponBrandIds[coupon?.couponId] = [];
      }
      couponBrandIds[coupon?.couponId].push(coupon?.brandId);
    }

    const result = <GetMemberCouponCodeResp>{
      redeemId: couponDetail?.redeemId,
      couponId: couponDetail?.couponId,
      couponSeq: couponDetail?.couponSeq,
      brandIds: couponBrandIds[couponDetail?.couponId] ?? [],
      couponName: couponDetail?.couponName,
      mainImageUrl: couponDetail?.mainImageUrl,
      thumbnailImageUrl: couponDetail?.thumbnailImageUrl,
      startDate: couponDetail?.startDate,
      endDate: couponDetail?.endDate,
      couponStartDate: couponDetail?.redemptionStartDate,
      couponEndDate: couponDetail?.redemptionEndDate,
      content: couponDetail?.content,
      expiredDate: couponDetail?.expiredDate,
      couponStatus: couponDetail?.couponStatus
    };

    return result;
  }

  /**
   * 取得即將到期票券數量
   *
   * @param req
   * @returns
   */
  async getAboutToExpiredCoupon(
    req: GetAboutToExpiredCouponDto
  ): Promise<GetAboutToExpiredCouponResp> {
    // TODO MOT設定
    const day = 10;

    const couponCount =
      await this.couponRepository.getMemberCouponDetailToExpired(
        req?.memberId,
        day
      );

    const result = <GetAboutToExpiredCouponResp>{};
    result.isCouponExpired = couponCount > 0 ? true : false;
    result.count = couponCount;

    return result;
  }

  /**
   * 轉贈票券
   *
   * @param req
   * @returns
   */
  async giveMemberCoupon(
    req: GiveMemberCouponDto
  ): Promise<Record<string, never>> {
    const couponDetail = await this.couponRepository.getMemberCouponDetailBySeq(
      req?.memberId,
      req?.couponSeq
    );

    if (!couponDetail) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    if (couponDetail?.couponStatus != MEMBER_COUPON_STATUS.RECEIVED) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    if (!couponDetail?.isTransferable) {
      throw new CustomerException(configError._320021, HttpStatus.OK);
    }

    const date = moment().tz(process.env.TIME_ZONE).format('YYMMDD');
    // 創建兌換券唯一碼
    const redeemId = await this.createRedeemId(date);
    // 創建交易唯一碼
    const transactionId = await this.createCouponTransactionId(date);

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      // 更新贈送人的狀態
      await this.couponRepository.updMemberCouponTransferStatus(
        connection,
        MEMBER_COUPON_STATUS.TRANSFERRED,
        req?.couponSeq,
        req?.giveMemberId
      );

      const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      const insCouponDetail = <InsCouponDetailReq>{
        redeemId: redeemId,
        couponId: couponDetail?.couponId,
        cisId: null,
        rewardCardId: couponDetail?.rewardCardId,
        transactionId: transactionId,
        transactionType: MEMBER_COUPON_STATUS.RECEIVED,
        transactionDate: now,
        memberId: req?.giveMemberId,
        transferMemberId: null,
        transferDate: now,
        donorMemberId: req?.memberId,
        writeoffStoreId: '',
        point: 0,
        reward: 0,
        expiredDate: couponDetail?.expiredDate
      };

      await this.couponRepository.insCouponDetail(connection, insCouponDetail);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._320014, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 取得優惠券列表
   *
   * @param req
   * @returns
   */
  async getCouponSearch(req: GetCouponSearchDto): Promise<GetCouponSearchResp> {
    const memberCouponList = await this.couponRepository.getCouponSearchList(
      req
    );

    const couponSearchListCount =
      await this.couponRepository.getCouponSearchListCount(req);

    // 整理兌換券 ID
    const couponIds = memberCouponList?.map((couponList) => {
      return couponList?.couponId;
    });

    const couponBrandIds = {};
    if (couponIds?.length > 0) {
      const couponBrands = await this.couponRepository.getCouponBrands(
        couponIds
      );
      // 整理兌換券 ID 與 品牌的對照表
      for (const coupon of couponBrands) {
        if (!couponBrandIds[coupon?.couponId]) {
          couponBrandIds[coupon?.couponId] = [];
        }
        couponBrandIds[coupon?.couponId].push(coupon?.brandId);
      }
    }

    memberCouponList?.forEach((coupon) => {
      coupon.brandIds = couponBrandIds[coupon?.couponId] ?? [];
    });

    const totalPage = Math.ceil(couponSearchListCount / req?.perPage);

    const result = <GetCouponSearchResp>{};
    result.next = req?.page < totalPage ? req?.page : null;
    result.couponSearch = memberCouponList;

    return result;
  }

  /**
   * 優惠券詳情
   *
   * @param req
   * @returns
   */
  async getCouponDetail(req: GetCouponDetailDto): Promise<GetCouponDetailResp> {
    const couponDetail = await this.couponRepository.getCouponSettingDetail(
      req?.couponId,
      [COUPON_REWARD_RULES_TYPE.POINT, COUPON_REWARD_RULES_TYPE.BIRTHDAY]
    );
    if (!couponDetail) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    const couponBrands = await this.couponRepository.getCouponBrands([
      req?.couponId
    ]);
    // 整理兌換券 ID 與 品牌的對照表
    const couponBrandIds = {};
    for (const coupon of couponBrands) {
      if (!couponBrandIds[coupon?.couponId]) {
        couponBrandIds[coupon?.couponId] = [];
      }
      couponBrandIds[coupon?.couponId].push(coupon?.brandId);
    }

    const result = <GetCouponDetailResp>{
      isTransferable: couponDetail?.isTransferable,
      couponId: req?.couponId,
      brandIds: couponBrandIds[req?.couponId] ?? [],
      couponName: couponDetail?.couponName,
      point: couponDetail?.point,
      startDate: couponDetail?.startDate,
      endDate: couponDetail?.endDate,
      mainImageUrl: couponDetail?.mainImageUrl,
      thumbnailImageUrl: couponDetail?.thumbnailImageUrl,
      couponStartDate: couponDetail?.couponStartDate,
      couponEndDate: couponDetail?.couponEndDate,
      releaseStatue: couponDetail?.releaseStatus,
      releaseDate: couponDetail?.releaseDate,
      content: couponDetail?.description,
      alterTime: couponDetail?.alterTime
    };

    return result;
  }

  /**
   * 兌換優惠券
   *
   * @param req
   * @returns
   */
  async exchangeCoupon(req: ExchangeCouponDto): Promise<ExchangeCouponResp> {
    if (req?.couponType == COUPON_EXCHANGE_TYPE.COMMODITY && !req?.storeId) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }

    // 取得兌換券詳細資料
    const couponDetail = await this.couponRepository.getCouponSettingDetail(
      req?.couponId,
      [COUPON_REWARD_RULES_TYPE.POINT, COUPON_REWARD_RULES_TYPE.BIRTHDAY]
    );

    // 判斷兌換券是否存在
    if (!couponDetail || couponDetail?.couponType !== req?.couponType) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    // 判斷兌換券 是否在上架時間
    if (
      !(
        moment(couponDetail?.startDate).isBefore(moment().utc()) &&
        moment(couponDetail?.endDate).isAfter(moment().utc())
      )
    ) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    // 判斷兌換券 是否在兌換時間內
    if (
      couponDetail?.couponRule ==
        Number(COUPON_RELEASE_STATUS_TYPE.UNPUBLISHED) &&
      !(
        moment(couponDetail?.couponStartDate).isBefore(moment().utc()) &&
        moment(couponDetail?.couponEndDate).isAfter(moment().utc())
      )
    ) {
      throw new CustomerException(configError._320022, HttpStatus.OK);
    }

    // 員紅利點數是否夠
    // 取得會員點數&會員資訊
    const memberPoint = await this.couponRepository.getMemberPoint(
      req?.memberId,
      moment().tz(process.env.TIME_ZONE).format(process.env.DATE_ONLY)
    );
    const pointTotal = memberPoint?.reduce(
      (acc, curr) => (acc += curr?.point),
      0
    );
    if (pointTotal < couponDetail?.point)
      throw new CustomerException(configError._320024, HttpStatus.OK);

    // 會員的兌換次數
    const couponCount = await this.couponRepository.getCouponMemberCount(
      req?.couponId,
      req?.memberId
    );

    // 判斷會員是否已達領取上限
    if (couponDetail?.redeemLimit <= couponCount) {
      throw new CustomerException(configError._320005, HttpStatus.OK);
    }

    // 取得品牌
    const couponBrands = await this.couponRepository.getCouponBrand(
      req?.couponId
    );

    const date = moment().tz(process.env.TIME_ZONE).format('YYMMDD');
    const redeemId = await this.createRedeemId(date);
    // 創建交易唯一碼
    const transactionId = await this.createCouponTransactionId(date);
    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');

    let couponSeq = 0;
    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      // 扣除點數
      await this.deductPoint(
        req?.memberId,
        couponDetail?.point,
        req?.couponType,
        memberPoint,
        transactionId
      );

      // 過期時間
      const expiredDate =
        couponDetail?.couponRule == COUPON_RULE_TYPE.DATE
          ? couponDetail?.couponEndDate
          : moment()
              .add(couponDetail?.earliestPickupDate, 'day')
              .format('YYYY-MM-DD HH:mm');

      // 新增兌換明細
      const insCouponDetail = <InsCouponDetailReq>{
        redeemId: redeemId,
        couponId: req?.couponId,
        cisId: null,
        rewardCardId: null,
        transactionId: transactionId,
        transactionType: MEMBER_COUPON_STATUS.RECEIVED,
        transactionDate: now,
        memberId: req?.memberId,
        transferMemberId: '',
        writeoffStoreId: req?.storeId,
        point: couponDetail?.point,
        reward: 0,
        expiredDate: expiredDate,
        createId: 'system',
        alterId: 'system'
      };

      couponSeq = await this.couponRepository.insCouponDetail(
        connection,
        insCouponDetail
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._320015, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    const result = <ExchangeCouponResp>{
      couponId: req?.couponId,
      couponSeq: couponSeq,
      brandIds: couponBrands?.map((brand) => {
        return brand?.brandId;
      }),
      transactionId: transactionId,
      transactionDate: now,
      point: couponDetail?.point,
      couponName: couponDetail?.couponName
    };

    return result;
  }

  /**
   * 點數扣點
   * @param memberId 會員編號
   * @param couponPoint 兌換券所需點數
   * @param couponType 兌換券類型
   * @param memberPoint 會員點數
   * @param transactionId 交易編號
   */
  async deductPoint(
    memberId: string,
    couponPoint: number,
    couponType: number,
    memberPoint: GetMemberPointResp[],
    transactionId: string
  ): Promise<Record<string, never>> {
    const needMinusPoint = couponPoint;

    // 已使用點數
    const usedPoint = memberPoint?.reduce((acc, curr) => {
      if (couponPoint <= 0) return;
      if (curr?.point < couponPoint) {
        couponPoint -= curr.point;
        const singleUsetPoint = <UsedPoint>{};
        singleUsetPoint.memberId = memberId;
        singleUsetPoint.point = curr.point;
        singleUsetPoint.expiredDate = curr?.expiredDate;
        acc.push(singleUsetPoint);
        curr.point = 0;
      } else {
        curr.point -= couponPoint;
        const singleUsetPoint = <UsedPoint>{};
        singleUsetPoint.memberId = memberId;
        singleUsetPoint.point = couponPoint;
        singleUsetPoint.expiredDate = curr?.expiredDate;
        acc.push(singleUsetPoint);
        couponPoint = 0;
      }
      return acc;
    }, []);

    const month = Number(moment().tz(process.env.TIME_ZONE).format('MM'));
    const year = moment().tz(process.env.TIME_ZONE).format('YYYY');
    const tableMonth = getLogTableMonth(year, month);
    const memberPointLog = <MemberPointLog>{};
    memberPointLog.Member_ID = memberId;
    memberPointLog.Card_ID = memberPoint?.[0]?.cardId;
    memberPointLog.Member_Name = memberPoint?.[0]?.name;
    memberPointLog.Mobile_Country_Code = memberPoint?.[0]?.mobileCountryCode;
    memberPointLog.Mobile = memberPoint?.[0]?.mobile;
    memberPointLog.Point_Type =
      COUPON_EXCHANGE_TYPE.DISCOUNT === couponType
        ? ENUM_POINT_TYPE_LOG.DISCOUNT
        : ENUM_POINT_TYPE_LOG.COMMODITY;
    memberPointLog.Point_Type_Str =
      COUPON_EXCHANGE_TYPE.DISCOUNT === couponType
        ? ENUM_POINT_TYPE_LOG_STR[ENUM_POINT_TYPE_LOG.DISCOUNT]
        : ENUM_POINT_TYPE_LOG_STR[ENUM_POINT_TYPE_LOG.COMMODITY];
    memberPointLog.Point_Item =
      COUPON_EXCHANGE_TYPE.DISCOUNT === couponType
        ? ENUM_POINT_TYPE_LOG_STR[ENUM_POINT_TYPE_LOG.DISCOUNT]
        : ENUM_POINT_TYPE_LOG_STR[ENUM_POINT_TYPE_LOG.COMMODITY];
    memberPointLog.Point = Number(`-${needMinusPoint}`);
    memberPointLog.Order_ID = transactionId;

    await this.couponRepository.deductPoint(
      tableMonth,
      memberId,
      transactionId,
      memberPoint,
      usedPoint,
      memberPointLog
    );

    return {};
  }

  /**
   * POS 查詢兌換券詳細資料
   *
   * @param req
   * @returns
   */
  async getPosMemberCouponDetail(
    req: GetPosMemberCouponDetailDto
  ): Promise<GetPosMemberCouponDetailResp> {
    const couponDetail =
      await this.couponRepository.getMemberCouponDetailByRedeemId(
        req?.redeemId
      );
    if (!couponDetail) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    const storeIds = [];
    const couponStore = await this.couponRepository.getCouponStore(
      couponDetail?.couponId
    );

    for (const store of couponStore) {
      if (!storeIds.includes(store.storeId)) {
        storeIds.push(store.storeId);
      }
    }

    // 當未指定門市，代表全部門市。
    if (couponStore?.length == 0) {
      const couponBrand = await this.couponRepository.getCouponBrand(
        couponDetail?.couponId
      );

      for (const brand of couponBrand) {
        // 當品牌為集團，代表全部品牌門市
        const brandId = brand?.isCorporation ? '' : brand?.brandId;
        const storeDetail = await this.storeRepository.getStoreDetailByBrandId(
          brandId
        );

        for (const store of storeDetail) {
          storeIds.push(store.storeId);
        }
      }
    }

    const memberDetail = await this.memberRepository.getMemberDetailByMemberId(
      couponDetail?.memberId
    );

    const result = <GetPosMemberCouponDetailResp>{};
    result.couponName = couponDetail?.couponName;
    result.couponType = couponDetail?.couponType;
    result.rewardRule = couponDetail?.rewardRule;
    result.transactionType = couponDetail?.transactionType;
    result.couponEndDate = couponDetail?.couponEndDate;
    result.storeIds = storeIds;
    result.memberName = memberDetail?.name ?? '';
    result.memberCardId = memberDetail?.cardNumber ?? '';

    return result;
  }

  /**
   * POS 核銷兌換券
   *
   * @param req
   * @returns
   */
  async writeOffPosCouponDetail(
    req: WriteOffPosCouponDetailDto
  ): Promise<Record<string, never>> {
    const couponDetail =
      await this.couponRepository.getMemberCouponDetailByRedeemId(
        req?.redeemId
      );
    if (!couponDetail) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    const storeDetail = await this.storeRepository.getStoreDetail(req?.storeId);
    if (!storeDetail) {
      throw new CustomerException(configError._240001, HttpStatus.OK);
    }

    let transactionType: number;
    let transactionDate: string;
    let storeId: string;
    switch (req?.methods) {
      case 1:
        if (couponDetail?.transactionType != MEMBER_COUPON_STATUS.RECEIVED) {
          throw new CustomerException(
            {
              code: configError._320017.code,
              msg: `${configError._320017.msg}${couponDetail?.redeemId}`
            },
            HttpStatus.OK
          );
        }

        transactionType = MEMBER_COUPON_STATUS.VERIFIED;
        transactionDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
        storeId = req?.storeId;
        break;
      case 2:
        if (couponDetail?.transactionType != MEMBER_COUPON_STATUS.VERIFIED) {
          throw new CustomerException(
            {
              code: configError._320017.code,
              msg: `${configError._320017.msg}${couponDetail?.redeemId}`
            },
            HttpStatus.OK
          );
        }

        transactionType = MEMBER_COUPON_STATUS.RECEIVED;
        transactionDate = null;
        storeId = null;
        break;
      default:
        throw new CustomerException(configError._320016, HttpStatus.OK);
    }

    await this.couponRepository.writeOffCouponDetail(
      [req?.redeemId],
      storeId,
      transactionType,
      transactionDate,
      'system'
    );

    return {};
  }

  /**
   * 創建 Coupon ID
   *
   * @param date
   * @returns
   */
  async createCouponId(date: string): Promise<string> {
    let nextCouponId;
    const redisKey = `${config.REDIS_KEY.MAX_COUPON_ID}:${date}`;
    nextCouponId = await this.redisService.rpopData(redisKey);
    if (nextCouponId) return nextCouponId;

    const prefix = `C${date}`;
    const maxCouponId = await this.couponRepository.getMaxCouponSettingId();

    let seq = 1;
    if (maxCouponId) {
      const maxDate = maxCouponId.substring(1, 7);
      if (date == maxDate) {
        seq = Number(maxCouponId.substring(7, 11));
      }
    }

    const couponIds: string[] = generateSerialNumber(prefix, seq, 4);
    await this.redisService.lpushData(
      redisKey,
      couponIds,
      secondsUntilEndOfDay()
    );

    nextCouponId = await this.redisService.rpopData(redisKey);

    return nextCouponId;
  }

  /**
   * 創建 兌換券 唯一碼
   *
   * @param date
   * @returns
   */
  async createRedeemId(date: string): Promise<string> {
    let nextRedeemId;
    const redisKey = `${config.REDIS_KEY.MAX_REDEEM_ID}:${date}`;
    nextRedeemId = await this.redisService.rpopData(redisKey);
    if (nextRedeemId) return nextRedeemId;

    const prefix = `R${date}`;
    const maxRedeemId = await this.couponRepository.getMaxCouponRedeemId();

    let seq = 1;
    if (maxRedeemId) {
      const maxDate = maxRedeemId.substring(1, 7);
      if (date == maxDate) {
        seq = Number(maxRedeemId.substring(7, 13));
      }
    }

    const transactionIds: string[] = generateSerialNumber(prefix, seq, 6);
    await this.redisService.lpushData(
      redisKey,
      transactionIds,
      secondsUntilEndOfDay()
    );

    nextRedeemId = await this.redisService.rpopData(redisKey);

    return nextRedeemId;
  }

  /**
   * 創建 發送 ID
   *
   * @param date
   * @returns
   */
  async createCisId(date: string): Promise<string> {
    let nextCisId;
    const redisKey = `${config.REDIS_KEY.MAX_CIS_ID}:${date}`;
    nextCisId = await this.redisService.rpopData(redisKey);
    if (nextCisId) return nextCisId;

    const prefix = `C${date}`;
    const maxCisId = await this.couponRepository.getMaxCouponSendId();

    let seq = 1;
    if (maxCisId) {
      const maxDate = maxCisId.substring(1, 7);
      if (date == maxDate) {
        seq = Number(maxCisId.substring(7, 10));
      }
    }

    const transactionIds: string[] = generateSerialNumber(prefix, seq, 3);
    await this.redisService.lpushData(
      redisKey,
      transactionIds,
      secondsUntilEndOfDay()
    );

    nextCisId = await this.redisService.rpopData(redisKey);

    return nextCisId;
  }

  /**
   * 創建兌換券 交易 ID
   *
   * @param date
   * @returns
   */
  async createCouponTransactionId(date: string): Promise<string> {
    let nextTransactionId;
    const redisKey = `${config.REDIS_KEY.MAX_COUPON_TRANSACTION_ID}:${date}`;
    nextTransactionId = await this.redisService.rpopData(redisKey);
    if (nextTransactionId) return nextTransactionId;

    const prefix = `T${date}`;
    const maxCouponTransactionId =
      await this.couponRepository.getMaxCouponTransactionId();

    let seq = 1;
    if (maxCouponTransactionId) {
      const maxDate = maxCouponTransactionId.substring(1, 7);
      if (date == maxDate) {
        seq = Number(maxCouponTransactionId.substring(7, 13));
      }
    }

    const transactionIds: string[] = generateSerialNumber(prefix, seq, 6);
    await this.redisService.lpushData(
      redisKey,
      transactionIds,
      secondsUntilEndOfDay()
    );

    nextTransactionId = await this.redisService.rpopData(redisKey);

    return nextTransactionId;
  }

  /**
   * 轉換兌換券交易狀態
   *
   * @param transactionType
   * @param couponEndDate
   * @returns
   */
  async convertCouponDetailTransactionType(
    transactionType: number,
    couponEndDate: string
  ): Promise<string> {
    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    switch (transactionType) {
      case MEMBER_COUPON_STATUS.RECEIVED:
        if (moment(couponEndDate).utc().isBefore(now)) {
          return MEMBER_DETAIL_COUPON_STATUS.EXPIRED;
        }

        return MEMBER_DETAIL_COUPON_STATUS.VALID;
      case MEMBER_COUPON_STATUS.VERIFIED:
        return MEMBER_DETAIL_COUPON_STATUS.REDEEMED;
      case MEMBER_COUPON_STATUS.TRANSFERRED:
        return MEMBER_DETAIL_COUPON_STATUS.TRANSFERRED;
      case MEMBER_COUPON_STATUS.RETURNED:
        return MEMBER_DETAIL_COUPON_STATUS.RETURNED;
    }

    return MEMBER_DETAIL_COUPON_STATUS.UNKNOWN;
  }

  /**
   * 發送入會禮
   * @param memberId 發送對象
   * @param settingId 啟用中的會籍設定
   * @param channelId 註冊渠道
   */
  async sendRegisterCoupon(
    memberId: string,
    settingId: string
  ): Promise<Record<string, never>> {
    // 取得入會禮
    const registerCoupon = await this.couponRepository.getRegisterCoupon(
      settingId
    );
    const date = moment().tz(process.env.TIME_ZONE).format('YYMMDD');
    const sendId = await this.createCisId(date);

    const couponList = await Promise.all(
      registerCoupon?.map(async (coupon) => {
        const redeemId = await this.createRedeemId(date);
        const transactionId = await this.createCouponTransactionId(date);
        // 過期時間
        const expiredDate =
          coupon?.couponRule == COUPON_RULE_TYPE.DATE
            ? coupon?.couponEndDate
            : moment()
                .add(coupon?.earliestPickupDate, 'day')
                .format('YYYY-MM-DD');

        return {
          memberId,
          couponId: coupon?.couponId,
          sendId,
          redeemId,
          transactionId,
          expiredDate,
          status: 1 // 可使用
        };
      })
    );

    // 發送入會禮
    await this.couponRepository.sendRegisterCoupon(couponList);

    return {};
  }

  /**
   * 入會禮發送失敗，新增至事件表重新發送
   * @param memberId 會員編號
   * @param memberShipId 會籍編號
   * @returns
   */
  async sendErrorGiftEvent(
    memberId: string,
    memberShipId: string
  ): Promise<Record<string, never>> {
    const queryStr = /* sql */ `
      INSERT INTO Gift_Action_Event SET ? , Send_Date = DATE_ADD(now(), INTERVAL + 5 MINUTE)
    `;

    const queryParams = {
      Member_ID: memberId,
      Member_Ship_ID: memberShipId,
      Event: 'register',
      Send_State: 'waiting',
      Send_Timeing: 0,
      Retry_Time: 1,
      Create_ID: 'system',
      Alter_ID: 'system'
    };

    await this.internalConn.query(queryStr, [queryParams]);

    return {};
  }
}
