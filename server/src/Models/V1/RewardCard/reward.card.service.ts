import { HttpStatus, Injectable } from '@nestjs/common';

import { Response } from 'express';
import * as fs from 'fs';
import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
import { MetaDataCommon } from 'src/Definition/Dto';
import {
  COUPON_EXCHANGE_TYPE,
  COUPON_RULE_TYPE
} from 'src/Definition/Enum/Coupon/coupon.type.enum';
import { MEMBER_COUPON_STATUS } from 'src/Definition/Enum/Coupon/member.coupon.status.enum';
import { CSV_FILE_EXTENSIONS } from 'src/Definition/Enum/Member/file.extension.enum';
import { UPLOAD_GPC_FILES_TYPE } from 'src/Definition/Enum/Member/upload.member.special.type.enum';
import {
  REWARD_CARD_STATE,
  REWARD_CARD_STATE_STR
} from 'src/Definition/Enum/RewardCard/reward.card.status.enum';
import {
  REWARD_CARD_SEND_MEMBER_TYPE,
  REWARD_CARD_TYPE,
  REWARD_CARD_TYPE_STR
} from 'src/Definition/Enum/RewardCard/reward.card.type.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import { ConvertZip } from 'src/Utils/DataFrame/zip';
import {
  generateSerialNumber,
  joinErrorMsg,
  removeFirstZero,
  secondsUntilEndOfDay
} from 'src/Utils/tools';
import { v4 as ruuidv4 } from 'uuid';
import { CommonRepository } from '../Common/common.repository';
import { CommonService } from '../Common/common.service';
import { InsCouponDetailReq } from '../Coupon/Interface/ins.coupon.detail.interface';
import { CouponRepository } from '../Coupon/coupon.repository';
import { CouponService } from '../Coupon/coupon.service';
import { MemberRepository } from '../Member/member.repository';
import { StoreRepository } from '../Store/store.repository';
import { DelRewardCardSettingDetailDto } from './Dto/del.reward.card.setting.detail.dto';
import { DelRewardSendDetailDto } from './Dto/del.reward.send.detail.dto';
import { DownloadRewardSendExampleResp } from './Dto/download.reward.example.dto';
import {
  ExchangeRewardCardDto,
  ExchangeRewardCardResp
} from './Dto/exchange.reward.card.dto';
import {
  GetMemberRewardCardDetailDto,
  GetMemberRewardCardDetailResp
} from './Dto/get.member.reward.card.detail.dto';
import {
  GetMemberRewardCardGiftDetailDto,
  GetMemberRewardCardGiftDetailResp
} from './Dto/get.member.reward.card.gift.detail.dto';
import {
  GetMemberRewardCardGiftListDto,
  GetMemberRewardCardGiftListResp,
  RewardCardGift,
  RewardCardGiftList
} from './Dto/get.member.reward.card.gift.list.dto';
import {
  GetMemberRewardCardListDto,
  GetMemberRewardCardListResp
} from './Dto/get.member.reward.card.list.dto';
import {
  GetMemberRewardDetailDto,
  GetMemberRewardDetailResp
} from './Dto/get.member.reward.detail.dto';
import {
  GetRewardCardHistoryDto,
  GetRewardCardHistoryResp,
  RewardCardHistory,
  RewardCardHistoryInfo
} from './Dto/get.reward.card.history.dto';
import { GetRewardCardMenuResp } from './Dto/get.reward.card.menu.dto';
import {
  GetRewardCardSettingDetailDto,
  GetRewardCardSettingDetailResp
} from './Dto/get.reward.card.setting.detail.dto';
import {
  GetRewardCardSettingListDto,
  GetRewardCardSettingListResp
} from './Dto/get.reward.card.setting.list.dto';
import {
  GetRewardDetailDto,
  GetRewardDetailResp
} from './Dto/get.reward.detail.dto';
import {
  GetRewardSendDetailDto,
  GetRewardSendDetailResp
} from './Dto/get.reward.send.detail.dto';
import {
  GetRewardSendListDto,
  GetRewardSendListResp
} from './Dto/get.reward.send.list.dto';
import { UpdRewardCardSettingDetailDto } from './Dto/upd.reward.card.setting.detail.dto';
import { UpdRewardSendDetailDto } from './Dto/upd.reward.send.detail.dto';
import {
  RewardExcelData,
  UploadRewardDetailResp
} from './Dto/upload.reward.detail.dto';
import {
  RewardSendMemberDetail,
  UpdRewardSendDetailReq
} from './Interface/upd.reward.send.detail.interface';
import { RewardCardRepository } from './reward.card.repository';

import moment = require('moment-timezone');

@Injectable()
export class RewardCardService {
  constructor(
    private rewardCardRepository: RewardCardRepository,
    private couponRepository: CouponRepository,
    private couponService: CouponService,
    private storeRepository: StoreRepository,
    private redisService: RedisService,
    private memberRepository: MemberRepository,
    private commonService: CommonService,
    private commonRepository: CommonRepository,
    private convertExcel: ConvertExcel,
    private convertZip: ConvertZip,
    private csvDownloadExample: CsvDownloadExample,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得集點卡列表
   *
   * @param req
   * @returns
   */
  async getRewardCardSettingList(
    req: GetRewardCardSettingListDto
  ): Promise<GetRewardCardSettingListResp> {
    const rewardCardList =
      await this.rewardCardRepository.getRewardCardSettingList(req);

    const rewardCardListCount =
      await this.rewardCardRepository.getRewardCardSettingListCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: rewardCardListCount,
      totalPage: Math.ceil(rewardCardListCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetRewardCardSettingListResp>{};
    result.metaData = metaData;
    result.rewardCardSettingList = rewardCardList;

    return result;
  }

  /**
   * 取得集點卡詳情
   *
   * @param req
   * @returns
   */
  async getRewardCardSettingDetail(
    req: GetRewardCardSettingDetailDto
  ): Promise<GetRewardCardSettingDetailResp> {
    const rewardCardDetail =
      await this.rewardCardRepository.getRewardCardSettingDetail(
        req?.rewardCardId
      );
    if (!rewardCardDetail) {
      throw new CustomerException(configError._350001, HttpStatus.OK);
    }

    const couponDetail =
      await this.rewardCardRepository.getRewardCardCouponDetail(
        req?.rewardCardId
      );
    // 整理兌換券 ID
    const couponIds = couponDetail?.map((detail) => {
      return detail?.couponId;
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

    couponDetail?.forEach((coupon) => {
      coupon.brandNames = couponBrandIds[coupon?.couponId];
    });

    const result = <GetRewardCardSettingDetailResp>{};
    result.rewardCardSettingDetail = rewardCardDetail;
    result.couponDetails = couponDetail;

    return result;
  }

  /**
   * 儲存集點卡資料
   *
   * @param req
   * @returns
   */
  async updRewardCardSettingDetail(
    req: UpdRewardCardSettingDetailDto
  ): Promise<Record<string, never>> {
    // 判斷滿點自動兌換 僅有一個品項才可以設定
    if (req?.isAutoExchange && req?.couponDetails?.length > 1) {
      throw new CustomerException(configError._350002, HttpStatus.OK);
    }

    // 如果是編輯，要檢查集點卡是否存在
    if (req?.rewardCardId) {
      const rewardCardDetail =
        await this.rewardCardRepository.getRewardCardSettingDetail(
          req?.rewardCardId
        );

      if (!rewardCardDetail) {
        throw new CustomerException(configError._350001, HttpStatus.OK);
      }

      // 集點卡已下架
      if (moment(rewardCardDetail?.endDate).isBefore(moment().utc())) {
        throw new CustomerException(configError._350006, HttpStatus.OK);
      }
    } else {
      const date = moment().tz(process.env.TIME_ZONE).format('YYMMDD');
      req.rewardCardId = await this.createRewardCardId(date);
    }

    // 只可創建進行中、尚未執行的集點卡
    if (moment(req?.endDate).isBefore(moment().utc())) {
      throw new CustomerException(configError._350007, HttpStatus.OK);
    }

    // 檢查上下架時間，不可有重疊時段
    const rewardCardDetail =
      await this.rewardCardRepository.getRewardCardSettingDetailByDate(
        req?.brandId,
        req?.startDate,
        req?.endDate,
        req?.rewardCardId
      );
    if (rewardCardDetail) {
      throw new CustomerException(configError._350005, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();

    try {
      await connection.beginTransaction();

      await this.rewardCardRepository.updRewardCardSettingDetail(
        connection,
        req,
        req?.iam?.authMemberId
      );

      await this.rewardCardRepository.initRewardCardCouponDetail(
        connection,
        req?.rewardCardId,
        req?.iam?.authMemberId
      );

      await this.rewardCardRepository.updRewardCardCouponDetail(
        connection,
        req?.rewardCardId,
        req?.couponDetails,
        req?.iam?.authMemberId
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._340002, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 刪除集點卡詳情
   *
   * @param req
   * @returns
   */
  async delRewardCardSettingDetail(
    req: DelRewardCardSettingDetailDto
  ): Promise<Record<string, never>> {
    const rewardCardDetail =
      await this.rewardCardRepository.getRewardCardSettingDetail(
        req?.rewardCardId
      );

    // 檢查集點卡是否存在
    if (!rewardCardDetail) {
      throw new CustomerException(configError._350001, HttpStatus.OK);
    }

    // 判斷上架時間
    if (moment(rewardCardDetail?.startDate).utc().isBefore(moment().utc())) {
      throw new CustomerException(configError._350003, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();

    try {
      await connection.beginTransaction();

      // 刪除集點卡
      await this.rewardCardRepository.delRewardCardSettingDetail(
        connection,
        req?.rewardCardId,
        req?.iam?.authMemberId
      );

      // 刪除集點卡關聯
      await this.rewardCardRepository.initRewardCardCouponDetail(
        connection,
        req?.rewardCardId,
        req?.iam?.authMemberId
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._340002, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 取得集點卡發送列表
   *
   * @param req
   * @returns
   */
  async getRewardSendList(
    req: GetRewardSendListDto
  ): Promise<GetRewardSendListResp> {
    const sendList = await this.rewardCardRepository.getRewardCardSendList(req);

    const sendListCount =
      await this.rewardCardRepository.getRewardCardSendListCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: sendListCount,
      totalPage: Math.ceil(sendListCount / req?.perPage)
    } as MetaDataCommon;

    const risIds = sendList?.map((x) => {
      return x.risId;
    });

    if (risIds?.length > 0) {
      const rewardCardPointData =
        await this.rewardCardRepository.getRewardCardSendPoint(risIds);
      const rewardCardPoint = {};
      rewardCardPointData?.forEach((data) => {
        rewardCardPoint[data?.risId] = data?.totalPoint;
      });

      sendList?.forEach((data) => {
        data.rewardPoint =
          rewardCardPoint[data?.risId] && !data?.relationId
            ? Number(rewardCardPoint[data?.risId])
            : 0;
        data.memberType = data?.relationId
          ? REWARD_CARD_SEND_MEMBER_TYPE.IMPORT
          : REWARD_CARD_SEND_MEMBER_TYPE.ASSIGN;
      });
    }

    const result = <GetRewardSendListResp>{};
    result.metaData = metaData;
    result.rewardSendList = sendList;

    return result;
  }

  /**
   * 取得集點卡發送詳情
   *
   * @param req
   * @returns
   */
  async getRewardSendDetail(
    req: GetRewardSendDetailDto
  ): Promise<GetRewardSendDetailResp> {
    const rewardCardSendDetail =
      await this.rewardCardRepository.getRewardCardSendDetail(req?.risId);

    if (!rewardCardSendDetail) {
      throw new CustomerException(configError._350004, HttpStatus.OK);
    }

    const rewardCardSendMember =
      await this.rewardCardRepository.getRewardCardSendMember(req?.risId);

    const memberIds = [];
    rewardCardSendMember?.forEach((member) => {
      if (!memberIds.includes(member.memberId)) {
        memberIds.push(member.memberId);
      }
    });

    const result = <GetRewardSendDetailResp>{};
    result.risName = rewardCardSendDetail?.risName;
    result.risDate = rewardCardSendDetail?.risDate;
    result.risType = rewardCardSendDetail?.risType;
    result.risStatus = rewardCardSendDetail?.risStatus;
    result.consumeDate = rewardCardSendDetail?.consumeDate;
    result.remark = rewardCardSendDetail?.remark;
    result.storeId = rewardCardSendDetail?.storeId;
    result.rewardCardId = rewardCardSendDetail?.rewardCardId;
    result.excelUrl = rewardCardSendDetail?.excelUrl;
    result.memberExcelCount = memberIds?.length;

    if (!rewardCardSendDetail?.relationId) {
      const rewardDetail =
        await this.rewardCardRepository.getRewardDetailByRisId(req?.risId);

      result.rewardPoint = Math.abs(rewardDetail?.[0]?.point ?? 0);

      const memberDetail =
        await this.memberRepository.getMemberDetailByMemberId(
          rewardCardSendMember?.[0]?.memberId
        );
      result.mobileCountryCode = memberDetail?.mobileCountryCode;
      result.mobile = memberDetail?.mobile;
      result.memberId = rewardCardSendMember?.[0]?.memberId;
    }

    return result;
  }

  /**
   * 檢查上傳集點卡發放 Csv 詳細資料
   *
   * @param file
   * @param isUploadGcp
   * @returns
   */
  async chkUploadRewardSendDetail(
    file: Express.Multer.File,
    isUploadGcp?: boolean
  ): Promise<UploadRewardDetailResp> {
    if (!file?.originalname) {
      throw new CustomerException(configError._220007, HttpStatus.OK);
    }

    const extension = file.originalname.split('.').pop();
    if (!CSV_FILE_EXTENSIONS.includes(extension)) {
      throw new CustomerException(configError._220020, HttpStatus.OK);
    }

    const { buffer } = file;

    const dir = `${__dirname}/reward`;
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
    const errorEmptyMember = [];
    const errorRepeatMember = [];

    let rowNumber = 0;
    const excelData = [] as RewardExcelData[];
    for (const str of content) {
      rowNumber++;

      if (rowNumber == 1) {
        continue;
      }

      const val = str.split(',');
      const target = <RewardExcelData>{};
      target.mobileCountryCode = val[0];
      target.mobile = val[1];
      target.rewardPoint = val[2];

      // 欄位皆空值
      if (
        !target.mobileCountryCode?.length &&
        !target.mobile?.length &&
        !target.rewardPoint?.length
      ) {
        continue;
      }

      // 手機國碼為空 或 手機號碼為空
      if (
        !target.mobileCountryCode?.length ||
        !target.mobile?.length ||
        !target.rewardPoint?.length
      ) {
        errorEmptyCol.push(rowNumber);
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

    let urls = [];
    if (isUploadGcp) {
      const excelUrls = await this.commonService.uploadExcel(
        dir,
        fileName,
        UPLOAD_GPC_FILES_TYPE.CSV
      );
      urls = excelUrls?.urls;
    }

    const result = <UploadRewardDetailResp>{};
    result.totalCount = excelData.length;
    result.excelData = excelData;
    result.urls = urls;

    // 刪除 csv 暫存檔
    fs.rmSync(csvPath, { recursive: true });

    return result;
  }

  /**
   * 儲存集點卡發送詳情
   *
   * @param file
   * @param req
   * @param userId
   * @returns
   */
  async updRewardSendDetail(
    file: Express.Multer.File,
    req: UpdRewardSendDetailDto,
    userId: string
  ): Promise<Record<string, never>> {
    const memberDetails = [] as RewardSendMemberDetail[];
    let relationId = null;
    // 編輯未重新上傳 Csv，無需編輯會員
    if (req?.memberExcelUrl) {
      relationId = await this.commonRepository.getFilesDetail(
        UPLOAD_GPC_FILES_TYPE.CSV,
        req?.memberExcelUrl
      );
      // 有上傳檔案
    } else if (file?.originalname) {
      const mobileDate = await this.chkUploadRewardSendDetail(file, true);

      mobileDate?.excelData.map((data) => {
        memberDetails.push({
          memberId: data.id,
          rewardPoint: Number(data.rewardPoint)
        });
      });

      relationId = ruuidv4();
      await this.commonRepository.insFilesDetail(
        relationId,
        UPLOAD_GPC_FILES_TYPE.EXCEL,
        mobileDate?.urls?.[0]
      );
      // 指定會員
    } else if (req?.memberId) {
      const memberDetail =
        await this.memberRepository.getMemberDetailByMemberId(req?.memberId);
      if (!memberDetail) {
        throw new CustomerException(configError._220005, HttpStatus.OK);
      }

      memberDetails.push({
        memberId: memberDetail?.id,
        rewardPoint: Number(req?.rewardPoint)
      });
    } else {
      throw new CustomerException(configError._200001, HttpStatus.OK);
    }

    const date = moment().tz(process.env.TIME_ZONE).format('YYMMDD');
    const transactionId = await this.createRewardCardTransactionId(date);
    if (req?.risId) {
      const rewardCardSendDetail =
        await this.rewardCardRepository.getRewardCardSendDetail(req?.risId);

      if (!rewardCardSendDetail) {
        throw new CustomerException(configError._350004, HttpStatus.OK);
      }

      if (moment(rewardCardSendDetail?.risDate).isBefore(moment().utc())) {
        throw new CustomerException(configError._350006, HttpStatus.OK);
      }
    } else {
      req.risId = await this.createRisId(date);
    }

    const rewardCardDetail =
      await this.rewardCardRepository.getRewardCardSettingDetail(
        req?.rewardCardId
      );
    if (!rewardCardDetail) {
      throw new CustomerException(configError._350001, HttpStatus.OK);
    }

    // 判斷集點卡是否上架中
    if (
      !(
        moment(rewardCardDetail?.startDate).isBefore(moment().utc()) &&
        moment(rewardCardDetail?.endDate).isAfter(moment().utc())
      )
    ) {
      throw new CustomerException(configError._350001, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      await this.rewardCardRepository.insRewardIssuance(
        connection,
        req,
        relationId,
        userId
      );

      await this.rewardCardRepository.initRewardIssuanceMap(
        connection,
        req?.risId,
        userId
      );

      await this.rewardCardRepository.insRewardIssuanceMap(
        connection,
        req?.rewardCardId,
        req?.risId,
        userId
      );

      await this.rewardCardRepository.initRewardIssuanceMember(
        connection,
        req?.risId,
        userId
      );

      await this.rewardCardRepository.initRewardDetail(
        connection,
        req?.risId,
        userId
      );

      for (const detail of memberDetails) {
        await this.rewardCardRepository.insRewardIssuanceMember(
          connection,
          req?.rewardCardId,
          req?.risId,
          detail?.memberId,
          userId
        );

        const rewardPoint =
          Number(req?.risType) == 1
            ? detail?.rewardPoint
            : detail?.rewardPoint * -1;
        const addData = <UpdRewardSendDetailReq>{
          memberId: detail?.memberId,
          rewardCardId: req?.rewardCardId,
          risId: req?.risId,
          couponId: null,
          transactionId: null,
          transactionType: REWARD_CARD_TYPE.INIT,
          transactionDate: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
          rewardPoint: rewardPoint,
          lastPoint: 0
        };

        await this.rewardCardRepository.insRewardDetail(
          connection,
          addData,
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

    return {};
  }

  /**
   * 刪除集點卡發送詳情
   *
   * @param req
   * @returns
   */
  async delRewardSendDetail(
    req: DelRewardSendDetailDto
  ): Promise<Record<string, never>> {
    const rewardCardSendDetail =
      await this.rewardCardRepository.getRewardCardSendDetail(req?.risId);

    if (!rewardCardSendDetail) {
      throw new CustomerException(configError._350004, HttpStatus.OK);
    }

    if (moment(rewardCardSendDetail?.risDate).isBefore(moment().utc())) {
      throw new CustomerException(configError._350010, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      await this.rewardCardRepository.delRewardCardSendDetail(
        connection,
        req?.risId,
        ''
      );

      await this.rewardCardRepository.delRewardIssuanceMap(
        connection,
        req?.risId,
        ''
      );

      await this.rewardCardRepository.delRewardIssuanceMember(
        connection,
        req?.risId,
        ''
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._350009, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 下載集點發送範本
   *
   * @param res
   * @returns
   */
  async downloadRewardSendExample(
    res: Response
  ): Promise<DownloadRewardSendExampleResp> {
    const buffer = await this.csvDownloadExample.rewardSendExcelExample();

    const filename = '調整集點項目_匯入範本.csv';
    const mimeType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`
    );

    res.send(buffer);

    const result = <DownloadRewardSendExampleResp>{};
    result.buffer = buffer;

    return result;
  }

  /**
   * 取得集點卡下拉式選單
   *
   * @returns
   */
  async getRewardCardMenu(): Promise<GetRewardCardMenuResp> {
    const rewardCardMenu = await this.rewardCardRepository.getRewardCardMenu();

    const result = <GetRewardCardMenuResp>{};
    result.rewardCardMenu = rewardCardMenu;

    return result;
  }

  /**
   * 取得集點明細
   *
   * @param req
   * @returns
   */
  async getRewardDetail(req: GetRewardDetailDto): Promise<GetRewardDetailResp> {
    // 如果字數超過 2 個字去除第一個 0
    if (req?.search?.length >= 2) {
      req.search = removeFirstZero(req?.search);
    }

    const rewardDetail = await this.rewardCardRepository.getRewardDetail(req);

    const rewardDetailCount =
      await this.rewardCardRepository.getRewardDetailCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: rewardDetailCount,
      totalPage: Math.ceil(rewardDetailCount / req?.perPage)
    } as MetaDataCommon;

    rewardDetail?.forEach((order) => {
      order.state = REWARD_CARD_STATE.ING;
      if (order?.lastPoint >= order?.maxPoint) {
        // 集滿中
        order.state = REWARD_CARD_STATE.FULL;
      }

      if (!order?.expirationDate) {
        if (moment(order?.endDate).isBefore(moment().utc())) {
          order.state = REWARD_CARD_STATE.EXPIRATION;
        }
      } else if (moment(order?.expirationDate).isBefore(moment().utc())) {
        order.state = REWARD_CARD_STATE.EXPIRATION;
      }
    });

    const result = <GetRewardDetailResp>{};
    result.metaData = metaData;
    result.rewardDetail = rewardDetail;

    return result;
  }

  /**
   * 取得會員集點明細
   *
   * @param req
   * @returns
   */
  async getMemberRewardDetail(
    req: GetMemberRewardDetailDto
  ): Promise<GetMemberRewardDetailResp> {
    const memberRewardDetail =
      await this.rewardCardRepository.getMemberRewardDetail(req);

    const memberRewardDetailCount =
      await this.rewardCardRepository.getMemberRewardDetailCount(req);

    const memberRewardCardState =
      await this.rewardCardRepository.getMemberRewardCardState(req?.memberId);

    let rewardPointIngCount = 0;
    let rewardPointFullCount = 0;
    let rewardPointExpirationCount = 0;
    memberRewardCardState?.forEach((detail) => {
      if (!detail?.expirationDate) {
        if (moment(detail?.endDate).isBefore(moment().utc())) {
          rewardPointExpirationCount++;
          return;
        }
      } else if (moment(detail.expirationDate).isBefore(moment().utc())) {
        rewardPointExpirationCount++;
        return;
      }

      if (detail?.point >= detail?.maxPoint) {
        rewardPointFullCount++;
        return;
      }

      rewardPointIngCount++;
    });

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: memberRewardDetailCount,
      totalPage: Math.ceil(memberRewardDetailCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetMemberRewardDetailResp>{};
    result.rewardPointIngCount = rewardPointIngCount;
    result.rewardPointFullCount = rewardPointFullCount;
    result.rewardPointExpirationCount = rewardPointExpirationCount;
    result.metaData = metaData;
    result.memberRewardDetail = memberRewardDetail;

    return result;
  }

  /**
   * 匯出會員集點明細
   *
   * @param res
   * @param req
   */
  async exportRewardDetail(res: Response, req: GetRewardDetailDto) {
    // excel 主目錄
    const dir = `${__dirname}/excel`;
    // excel 子目錄
    const dirUUID = `${__dirname}/excel/${ruuidv4()}`;

    const today = moment().utc().format('YYYYMMDD');

    // 初始化分頁
    req.page = 1;
    req.perPage = 15000;

    while (true) {
      const orderLogList = await this.rewardCardRepository.getRewardDetail(req);

      if (!orderLogList || orderLogList.length == 0) {
        break;
      }

      const rows = [];
      orderLogList.forEach((order) => {
        let stateStr = REWARD_CARD_STATE_STR.ING;
        if (order?.lastPoint >= order?.maxPoint) {
          // 集滿中
          stateStr = REWARD_CARD_STATE_STR.FULL;
        }

        if (!order?.expirationDate) {
          if (moment(order?.endDate).isBefore(moment().utc())) {
            stateStr = REWARD_CARD_STATE_STR.EXPIRATION;
          }
        } else if (moment(order?.expirationDate).isBefore(moment().utc())) {
          stateStr = REWARD_CARD_STATE_STR.EXPIRATION;
        }

        rows.push([
          order.brandName,
          order.rewardCardName,
          stateStr,
          REWARD_CARD_TYPE_STR[order.transactionType] ?? '',
          order.point,
          `${order.lastPoint}/${order.maxPoint}`,
          order.memberCardId,
          order.memberName,
          order.mobileCountryCode,
          order.mobile,
          moment
            .tz(order.sendCardDate, process.env.TIME_ZONE)
            .format('YYYY-MM-DD HH:mm'),
          moment
            .tz(order.alterDate, process.env.TIME_ZONE)
            .format('YYYY-MM-DD HH:mm'),
          order.expirationDate
            ? moment
                .tz(order.expirationDate, process.env.TIME_ZONE)
                .format('YYYY-MM-DD HH:mm')
            : moment
                .tz(order.endDate, process.env.TIME_ZONE)
                .format('YYYY-MM-DD HH:mm'),
          order.transactionId
        ]);
      });

      const excelFileName = `${today}-${req.page}-集點卡明細.xlsx`;

      await this.convertExcel.rewardDetailToExcel(
        rows,
        excelFileName,
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

    const zipFileName = `${today}-集點卡明細.zip`;

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
   * 集點活動列表
   *
   * @param req
   * @returns
   */
  async getMemberRewardCardList(
    req: GetMemberRewardCardListDto
  ): Promise<GetMemberRewardCardListResp> {
    const rewardCardList =
      await this.rewardCardRepository.getMemberRewardCardList(
        req?.brandIds,
        req?.page,
        req?.perPage
      );

    const rewardCardListCount =
      await this.rewardCardRepository.getMemberRewardCardListCount(
        req?.brandIds
      );

    const totalPage = Math.ceil(rewardCardListCount / req?.perPage);

    const result = <GetMemberRewardCardListResp>{};
    result.next = req?.page < totalPage ? req?.page : null;
    result.list = rewardCardList;

    return result;
  }

  /**
   * 集點活動詳情
   *
   * @param req
   * @returns
   */
  async getMemberRewardCardDetail(
    req: GetMemberRewardCardDetailDto
  ): Promise<GetMemberRewardCardDetailResp> {
    const rewardCardDetail =
      await this.rewardCardRepository.getMemberRewardCardDetail(
        req?.rewardCardId
      );

    const memberPoints = await this.rewardCardRepository.getRewardMemberBalance(
      req?.rewardCardId,
      req?.memberId
    );

    const couponDetail =
      await this.rewardCardRepository.getRewardCardCouponDetail(
        req?.rewardCardId
      );
    const couponPoints = [];
    couponDetail?.forEach((coupon) => {
      // TODO 判斷兌換時間
      if (memberPoints >= coupon?.point) {
        couponPoints.push(coupon?.point);
      }
    });

    const result = <GetMemberRewardCardDetailResp>{
      rewardCardDetail: rewardCardDetail,
      giftPoints: couponPoints,
      memberPoints: memberPoints
    };

    return result;
  }

  /**
   * 集點可兌換獎品列表
   *
   * @param req
   * @returns
   */
  async getMemberRewardCardGiftList(
    req: GetMemberRewardCardGiftListDto
  ): Promise<GetMemberRewardCardGiftListResp> {
    const rewardCardDetail =
      await this.rewardCardRepository.getMemberRewardCardDetail(
        req?.rewardCardId
      );

    const giftDetail = await this.rewardCardRepository.getRewardCardGiftList(
      req?.rewardCardId
    );

    const memberPoints = await this.rewardCardRepository.getRewardMemberBalance(
      req?.rewardCardId,
      req?.memberId
    );

    const gift = [] as RewardCardGift[];
    for (const detail of giftDetail) {
      let isExchange = true;
      let exchangeContent = '我要兌換';
      if (memberPoints < Number(detail?.points)) {
        isExchange = false;
        exchangeContent = '集點點數不足';
      }

      if (
        !(
          moment(detail?.redemptionStartDate).isBefore(moment().utc()) &&
          moment(detail?.redemptionEndDate).isAfter(moment().utc())
        )
      ) {
        isExchange = false;
        exchangeContent = '尚未進入可兌換時間。';
      }

      let pickUpDate = moment()
        .utc()
        .add(detail?.earliestPickupDate, 'day')
        .format('YYYY-MM-DD HH:mm:ss');
      if (moment(detail?.redemptionEndDate).isBefore(pickUpDate)) {
        pickUpDate = detail?.redemptionEndDate;
      }

      gift.push({
        id: detail?.id,
        brandId: detail?.brandId,
        couponName: detail?.couponName,
        mainImageUrl: detail?.mainImageUrl,
        thumbnailImageUrl: detail?.thumbnailImageUrl,
        content: detail?.content,
        points: detail?.points,
        isExchange: isExchange,
        exchangeContent: exchangeContent,
        startDate: detail?.startDate,
        endDate: detail?.endDate,
        redemptionStartDate: detail?.redemptionStartDate,
        redemptionEndDate: detail?.redemptionEndDate,
        earliestPickupDate: detail?.earliestPickupDate,
        pickUpStartDate: moment(detail?.startDate).isBefore(
          detail?.redemptionStartDate
        )
          ? detail?.redemptionStartDate
          : pickUpDate,
        pickUpEndDate: detail?.redemptionEndDate
      });
    }

    const giftList = [] as RewardCardGiftList[];
    giftList.push({
      sectionTitle: rewardCardDetail?.rewardCardName,
      rewardCardGift: gift
    });

    const result = <GetMemberRewardCardGiftListResp>{};
    result.memberPoints = memberPoints;
    result.rewardCardGiftList = giftList;

    return result;
  }

  /**
   * 集點可兌換獎品詳情
   *
   * @param req
   * @returns
   */
  async getMemberRewardCardGiftDetail(
    req: GetMemberRewardCardGiftDetailDto
  ): Promise<GetMemberRewardCardGiftDetailResp> {
    const giftDetail = await this.rewardCardRepository.getRewardCardGiftDetail(
      req?.id
    );

    const memberPoints = await this.rewardCardRepository.getRewardMemberBalance(
      giftDetail?.rewardCardId,
      req?.memberId
    );

    giftDetail.isExchange = true;
    giftDetail.exchangeContent = '我要兌換';
    if (memberPoints < Number(giftDetail?.points)) {
      giftDetail.isExchange = false;
      giftDetail.exchangeContent = '集點點數不足';
    }

    if (
      !(
        moment(giftDetail?.redemptionStartDate).isBefore(moment().utc()) &&
        moment(giftDetail?.redemptionEndDate).isAfter(moment().utc())
      )
    ) {
      giftDetail.isExchange = false;
      giftDetail.exchangeContent = '尚未進入可兌換時間。';
    }

    let pickUpDate = moment()
      .utc()
      .add(giftDetail?.earliestPickupDate, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
    if (moment(giftDetail?.redemptionEndDate).isBefore(pickUpDate)) {
      pickUpDate = giftDetail?.redemptionEndDate;
    }

    if (giftDetail?.couponType == COUPON_EXCHANGE_TYPE.COMMODITY) {
      giftDetail.pickUpStartDate = moment(giftDetail?.startDate).isBefore(
        giftDetail?.redemptionStartDate
      )
        ? giftDetail?.redemptionStartDate
        : pickUpDate;

      giftDetail.pickUpEndDate = giftDetail?.redemptionEndDate;
    }

    const result = <GetMemberRewardCardGiftDetailResp>{};
    result.rewardCardGiftDetail = giftDetail;

    return result;
  }

  /**
   * 兌換獎品
   *
   * @param req
   * @returns
   */
  async exchangeRewardCard(
    req: ExchangeRewardCardDto
  ): Promise<ExchangeRewardCardResp> {
    const giftDetail = await this.rewardCardRepository.getRewardCardGiftDetail(
      req?.id
    );

    // 兌換商品不存在
    if (!giftDetail) {
      throw new CustomerException(configError._320001, HttpStatus.OK);
    }

    if (giftDetail?.couponType == COUPON_EXCHANGE_TYPE.COMMODITY) {
      const storeDetail = await this.storeRepository.getStoreDetail(
        req?.storeId
      );

      // 門市不存在
      if (!storeDetail) {
        throw new CustomerException(configError._240001, HttpStatus.OK);
      }
    }

    // 判斷是否可以兌換
    if (
      !(
        moment(giftDetail?.redemptionStartDate).isBefore(moment().utc()) &&
        moment(giftDetail?.redemptionEndDate).isAfter(moment().utc())
      )
    ) {
      throw new CustomerException(configError._350008, HttpStatus.OK);
    }

    const couponSettingDetail =
      await this.couponRepository.getCouponSettingDetail(giftDetail?.couponId);

    const memberPoints = await this.rewardCardRepository.getRewardMemberBalance(
      giftDetail?.rewardCardId,
      req?.memberId
    );

    // 兌換點數不足
    if (Number(giftDetail?.points) > memberPoints) {
      throw new CustomerException(configError._350011, HttpStatus.OK);
    }

    const date = moment().tz(process.env.TIME_ZONE).format('YYMMDD');
    // 創建兌換券唯一碼
    const redeemId = await this.couponService.createRedeemId(date);
    // 創建交易唯一碼
    const transactionId = await this.couponService.createCouponTransactionId(
      date
    );
    // 過期時間
    const expiredDate =
      couponSettingDetail?.couponRule == COUPON_RULE_TYPE.DATE
        ? couponSettingDetail?.couponEndDate
        : moment()
            .add(couponSettingDetail?.earliestPickupDate, 'day')
            .format('YYYY-MM-DD');

    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    const insCouponDetail = <InsCouponDetailReq>{
      redeemId: redeemId,
      couponId: giftDetail?.couponId,
      cisId: null,
      rewardCardId: giftDetail?.rewardCardId,
      transactionId: transactionId,
      transactionType: MEMBER_COUPON_STATUS.RECEIVED,
      transactionDate: now,
      memberId: req?.memberId,
      point: 0,
      reward: Number(giftDetail?.points),
      expiredDate: expiredDate,
      writeoffStoreId: req?.storeId
    };

    const insRewardDetail = <UpdRewardSendDetailReq>{
      memberId: req?.memberId,
      rewardCardId: giftDetail?.rewardCardId,
      risId: null,
      couponId: giftDetail?.couponId,
      transactionId: transactionId,
      transactionType: 1,
      transactionDate: now,
      rewardPoint: Number(giftDetail?.points) * -1,
      lastPoint: memberPoints + Number(giftDetail?.points) * -1
    };

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      await this.couponRepository.insCouponDetail(connection, insCouponDetail);

      await this.rewardCardRepository.insRewardDetail(
        connection,
        insRewardDetail,
        'system'
      );

      if (Number(giftDetail?.points) > 0) {
        await this.rewardCardRepository.updRewardMemberBalance(
          connection,
          Number(giftDetail?.points) * -1,
          giftDetail?.rewardCardId,
          req?.memberId,
          req?.iam?.authMemberId
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._350008, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    const result = <ExchangeRewardCardResp>{
      id: req?.id,
      couponId: giftDetail?.couponId,
      couponName: giftDetail?.couponName,
      brandId: giftDetail?.brandId,
      transactionId: transactionId,
      transactionType: REWARD_CARD_TYPE.COUPON,
      transactionDate: now,
      point: giftDetail?.points
    };

    return result;
  }

  /**
   * 集點歷程
   *
   * @param req
   * @returns
   */
  async getRewardCardHistory(
    req: GetRewardCardHistoryDto
  ): Promise<GetRewardCardHistoryResp> {
    const rewardCardHistory =
      await this.rewardCardRepository.getRewardCardHistory(
        req?.rewardCardId,
        req?.memberId,
        req?.startDate,
        req?.endDate,
        req?.page,
        req?.perPage
      );

    const rewardCardHistoryCount =
      await this.rewardCardRepository.getRewardCardHistoryCount(
        req?.rewardCardId,
        req?.memberId,
        req?.startDate,
        req?.endDate
      );

    const detail = {};
    rewardCardHistory?.forEach((history) => {
      const month = moment
        .tz(history.transactionDate, process.env.TIME_ZONE)
        .format('MM');
      if (!detail[month]) {
        detail[month] = [] as RewardCardHistoryInfo[];
      }
      detail[month].push(history);
    });

    const history = [] as RewardCardHistory[];
    for (const month in detail) {
      history.push({
        month: month,
        rewardCardHistoryInfo: detail[month]
      });
    }

    const totalPage = Math.ceil(rewardCardHistoryCount / req?.perPage);

    const result = <GetRewardCardHistoryResp>{};
    result.next = req?.page < totalPage ? req?.page : null;
    result.rewardCardHistory = history;

    return result;
  }

  /**
   * 創建集點卡 ID
   *
   * @param date
   * @returns
   */
  async createRewardCardId(date: string): Promise<string> {
    let nextRewardCardId;
    const redisKey = `${config.REDIS_KEY.MAX_REWARD_CARD_ID}:${date}`;
    nextRewardCardId = await this.redisService.rpopData(redisKey);
    if (nextRewardCardId) return nextRewardCardId;

    const prefix = `RC${date}`;
    const maxRewardCardId =
      await this.rewardCardRepository.getMaxRewardCardId();

    let seq = 1;
    if (maxRewardCardId) {
      const maxDate = maxRewardCardId.substring(2, 8);
      if (date == maxDate) {
        seq = Number(maxRewardCardId.substring(8, 12));
      }
    }

    const risIds: string[] = generateSerialNumber(prefix, seq, 4);
    await this.redisService.lpushData(redisKey, risIds, secondsUntilEndOfDay());

    nextRewardCardId = await this.redisService.rpopData(redisKey);

    return nextRewardCardId;
  }

  /**
   * 創建 RID ID
   *
   * @param date
   * @returns
   */
  async createRisId(date: string): Promise<string> {
    let nextRisId;
    const redisKey = `${config.REDIS_KEY.MAX_RIS_ID}:${date}`;
    nextRisId = await this.redisService.rpopData(redisKey);
    if (nextRisId) return nextRisId;

    const prefix = `RIS${date}`;
    const maxRisId = await this.rewardCardRepository.getMaxRisId();

    let seq = 1;
    if (maxRisId) {
      const maxDate = maxRisId.substring(3, 9);
      if (date == maxDate) {
        seq = Number(maxRisId.substring(9, 13));
      }
    }

    const risIds: string[] = generateSerialNumber(prefix, seq, 4);
    await this.redisService.lpushData(redisKey, risIds, secondsUntilEndOfDay());

    nextRisId = await this.redisService.rpopData(redisKey);

    return nextRisId;
  }

  /**
   * 創建集點卡 交易 ID
   *
   * @param brandId
   * @param date
   * @returns
   */
  async createRewardCardTransactionId(date: string): Promise<string> {
    let nextTransactionId;
    const redisKey = `${config.REDIS_KEY.MAX_REWARD_CARD_TRANSACTION_ID}:${date}`;
    nextTransactionId = await this.redisService.rpopData(redisKey);
    if (nextTransactionId) return nextTransactionId;

    const prefix = `T${date}`;
    const maxRewardTransactionId =
      await this.rewardCardRepository.getMaxRewardTransactionId();

    let seq = 1;
    if (maxRewardTransactionId) {
      const maxDate = maxRewardTransactionId.substring(1, 7);
      if (date == maxDate) {
        seq = Number(maxRewardTransactionId.substring(7, 13));
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
}
