import { HttpStatus, Injectable } from '@nestjs/common';
import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
import {
  COUPON_REWARD_RULES_TYPE,
  MEMBER_SHIP_GIFT_STR
} from 'src/Definition/Enum/Coupon/coupon.type.enum';
import {
  ENUM_MEMBER_SHIP_SETTING_STATUS,
  ENUM_MEMBER_SHIP_SETTING_STATUS_CODE
} from 'src/Definition/Enum/MemberShip/member.ship.setting.status.enum';
import { ENUM_POINT_TYPE } from 'src/Definition/Enum/Point/point.type.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import { generateSerialNumber, secondsUntilEndOfDay } from 'src/Utils/tools';
import { ChannelRepository } from '../Channel/channel.repository';
import { CouponRepository } from '../Coupon/coupon.repository';
import { AddMemberShipDto, AddMemberShipResp } from './Dto/add.member.ship.dto';
import {
  AddMemberShipSettingDto,
  AddMemberShipSettingResp
} from './Dto/add.member.ship.setting.dto';
import {
  GetMemberSettingParameterDto,
  GetMemberSettingParameterResp,
  GetMemberShipListResp,
  ValueLable
} from './Dto/get.member.setting.parameter.dto';
import { GetMemberShipMenuResp } from './Dto/get.member.ship.menu.dto';
import { UpdateActiveMemberShipDto } from './Dto/update.active.member.ship.dto';
import { UpdateActiveMemberShipSettingDto } from './Dto/update.active.member.ship.setting.dto';
import { CalcMemberShipStartEndDateResp } from './Interface/calc.member.ship.start.end.date.interface';
import { GetBasicMemberShipSettingResp } from './Interface/get.basic.member.ship.setting.interface';
import {
  BasicSetting,
  BirthdaySetting,
  GetMemberShipSettingInfoResp,
  MemberShip,
  MemberShipCouponDetail,
  RegisterGift
} from './Interface/get.member.ship.setting.info.interface';
import { GetMemberShipSettingListResp } from './Interface/get.member.ship.setting.list.interface';
import { SortMemberShipReq } from './Interface/sort.member.ship.interface';
import { MemberShipRepository } from './memberShip.repository';

import moment = require('moment-timezone');

@Injectable()
export class MemberShipService {
  constructor(
    private readonly redisService: RedisService,
    private memberShipRepository: MemberShipRepository,
    private couponRepository: CouponRepository,
    private channelRepository: ChannelRepository,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得會籍設定列表
   */
  async getMemberShipSettingList(): Promise<GetMemberShipSettingListResp> {
    const memberShipSettingList =
      await this.memberShipRepository.getMemberShipSettingList();

    const settingList = memberShipSettingList?.map((setting) => {
      let settingStatusStr,
        realStartDate = '--';
      switch (setting.settingStatus) {
        case ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.DRAFT: //草稿
          settingStatusStr = ENUM_MEMBER_SHIP_SETTING_STATUS.DRAFT;
          break;

        case ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.PENDING: //待生效
          settingStatusStr = ENUM_MEMBER_SHIP_SETTING_STATUS.PENDING;
          break;

        case ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE: //生效中
          const effectiveStarDate = moment
            .tz(setting.effectiveStarDate, process.env.TIME_ZONE)
            .format('YYYY/MM/DD');
          settingStatusStr = ENUM_MEMBER_SHIP_SETTING_STATUS.EFFECTIVE;
          realStartDate = `${effectiveStarDate}～生效中`;
          break;
      }

      return {
        ...setting,
        realStartDate,
        settingStatusStr
      };
    });

    const result = <GetMemberShipSettingListResp>{};
    result.settingList = settingList;

    return result;
  }

  /**
   * 新增編輯會籍版本
   * @param req
   * @returns
   */
  async addMemberShipSetting(
    req: AddMemberShipSettingDto
  ): Promise<AddMemberShipSettingResp> {
    // 複製的會籍版本不能編輯 next會籍、會籍資格、會籍續等/升等期限、會籍到期日、會籍到期異動方式
    await this.checkCopyMemberShip(req, null);

    const authMemberId = req?.iam?.authMemberId;

    for (const detail of req?.gift) {
      if (detail?.couponIds?.length <= 0) {
        continue;
      }

      const channelDetail = await this.channelRepository.getChannelDetail(
        detail?.channelId
      );

      // 檢查渠道是否存在
      if (!channelDetail) {
        throw new CustomerException(configError._250002, HttpStatus.OK);
      }

      const couponDetails = await this.couponRepository.getCouponSettingDetails(
        detail?.couponIds,
        COUPON_REWARD_RULES_TYPE.REGISTER
      );

      // 檢查註冊禮是否存在
      if (couponDetails?.length != detail?.couponIds?.length) {
        throw new CustomerException(configError._320001, HttpStatus.OK);
      }
    }

    if (req?.settingId) {
      const status = await this.memberShipRepository.getMemberShipSettingStatus(
        req?.settingId
      );

      // 會籍設定不存在
      if (!status && status !== 0)
        throw new CustomerException(configError._260008, HttpStatus.OK);

      // 20231120修改：生效中僅可編輯”註冊禮”、”續會禮”、”升等禮” => 改叫另一隻 API
      if (status === 2)
        throw new CustomerException(configError._200002, HttpStatus.OK);

      const memberShipCount =
        await this.memberShipRepository.getMemberShipCount(req?.settingId);

      // 會籍項目=0時 僅可儲存草稿
      if (memberShipCount === 0 && req?.isRelease)
        throw new CustomerException(configError._260003, HttpStatus.OK);
    }

    // 會籍項目=0時 僅可儲存草稿
    if (!req?.settingId && req?.isRelease)
      throw new CustomerException(configError._260003, HttpStatus.OK);

    // 只可選擇>本日的日期，不可與其他生效中、待生效的會籍版本相同
    const today = moment().tz(process.env.TIME_ZONE).valueOf();
    const startDate = moment(req?.startDate, 'YYYY/MM/DD');
    // 取得待生效、生效中的起始日
    const task = [];
    task.push(this.memberShipRepository.getEffectiveDate());
    // 會籍版本設定名稱
    task.push(this.memberShipRepository.getSettingName(req?.settingId));
    const taskResult = await Promise.all(task);
    const effectiveDate = taskResult?.[0];
    const settingName = taskResult?.[1];

    // 會籍版本設定名稱不能重複(包含已失效)
    if (settingName.find((x) => x === req?.settingName))
      throw new CustomerException(configError._260005, HttpStatus.OK);
    // 會籍預定生效日必須大於今日
    if (startDate.valueOf() < today)
      throw new CustomerException(configError._260001, HttpStatus.OK);
    // 會籍預定生效日不可與其他生效中、待生效的會籍版本相同
    if (effectiveDate.find((x) => x === startDate.format('YYYY/MM/DD')))
      throw new CustomerException(configError._260002, HttpStatus.OK);

    let settingId;
    if (req?.settingId?.length) {
      settingId = req?.settingId;
    } else {
      const lastId = await this.memberShipRepository.getLatestId(
        'Member_Ship_ID',
        'IEat_Member_Ship',
        2,
        3
      );
      lastId
        ? (settingId = `M${(Number(lastId) + 1).toString().padStart(3, '0')}`)
        : (settingId = `M001`);
    }

    const connection = await this.internalConn.getConnection();

    try {
      await connection.beginTransaction();

      await this.memberShipRepository.addMemberShipSetting(
        connection,
        settingId,
        req
      );

      await this.memberShipRepository.initMemberShipGift(
        connection,
        settingId,
        authMemberId
      );

      if (req?.gift?.length > 0) {
        await this.memberShipRepository.addMemberShipGift(
          connection,
          settingId,
          req?.gift,
          authMemberId
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._260012, HttpStatus.OK);
    } finally {
      connection.release();
    }

    return { settingId };
  }

  /**
   * 編輯生效中的會籍版本
   * @param req
   * @returns
   */
  async updateActiveMemberShipSetting(
    req: UpdateActiveMemberShipSettingDto
  ): Promise<AddMemberShipSettingResp> {
    const authMemberId = req?.iam?.authMemberId;

    const status = await this.memberShipRepository.getMemberShipSettingStatus(
      req?.settingId
    );

    // 會籍設定不存在
    if (!status && status !== 0)
      throw new CustomerException(configError._260008, HttpStatus.OK);
    // 只有生效中可以叫這隻 API
    if (status !== 2)
      throw new CustomerException(configError._200002, HttpStatus.OK);

    for (const detail of req?.gift) {
      if (detail?.couponIds?.length <= 0) {
        continue;
      }

      const channelDetail = await this.channelRepository.getChannelDetail(
        detail?.channelId
      );

      // 檢查渠道是否存在
      if (!channelDetail) {
        throw new CustomerException(configError._250002, HttpStatus.OK);
      }

      const couponDetails = await this.couponRepository.getCouponSettingDetails(
        detail?.couponIds,
        COUPON_REWARD_RULES_TYPE.REGISTER
      );

      // 檢查註冊禮是否存在
      if (couponDetails?.length != detail?.couponIds?.length) {
        throw new CustomerException(configError._320001, HttpStatus.OK);
      }
    }

    const connection = await this.internalConn.getConnection();

    try {
      await connection.beginTransaction();

      await this.memberShipRepository.initMemberShipGift(
        connection,
        req?.settingId,
        authMemberId
      );

      if (req?.gift?.length) {
        await this.memberShipRepository.addMemberShipGift(
          connection,
          req?.settingId,
          req?.gift,
          authMemberId
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._260012, HttpStatus.OK);
    } finally {
      connection.release();
    }

    return { settingId: req?.settingId };
  }
  /**
   * 複製會籍設定
   * @param settingId
   * @param authMemberId
   */
  async copyMemberShipSetting(
    settingId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const status = await this.memberShipRepository.getMemberShipSettingStatus(
      settingId
    );

    // 會籍設定不存在
    if (!status && status !== 0)
      throw new CustomerException(configError._260008, HttpStatus.OK);

    //20231121：僅可複製啟用中的會籍設定
    if (status !== 2)
      throw new CustomerException(configError._260013, HttpStatus.OK);

    let newSettingId;
    const lastId = await this.memberShipRepository.getLatestId(
      'Member_Ship_ID',
      'IEat_Member_Ship',
      2,
      3
    );
    lastId
      ? (newSettingId = `M${(Number(lastId) + 1).toString().padStart(3, '0')}`)
      : (newSettingId = `M001`);

    await this.memberShipRepository.copyMemberShipSetting(
      settingId,
      newSettingId,
      authMemberId
    );

    return {};
  }

  /**
   * 刪除會籍版本設定
   * @param settingId
   */
  async delMemberShipSetting(
    settingId: string
  ): Promise<Record<string, never>> {
    const status = await this.memberShipRepository.getMemberShipSettingStatus(
      settingId
    );

    // 會籍設定不存在
    if (!status && status !== 0)
      throw new CustomerException(configError._260008, HttpStatus.OK);
    // 生效中無法刪除
    if (status === 2)
      throw new CustomerException(configError._260007, HttpStatus.OK);

    await this.memberShipRepository.delMemberShipSetting(settingId);

    return {};
  }

  /**
   * 檢核複製會籍的欄位值
   * @param memberShipSetting
   * @param memberShip
   * @returns
   */
  async checkCopyMemberShip(
    memberShipSetting: AddMemberShipSettingDto,
    memberShip: AddMemberShipDto
  ) {
    const settingId = memberShipSetting?.settingId || memberShip?.settingId;
    const memberShipId = memberShip?.memberShipId ?? null;
    const originalInfo =
      await this.memberShipRepository.getCopyMemberShipCheckField(
        settingId,
        memberShipId
      );

    // 不是複製的直接 return
    if (!Boolean(originalInfo?.isCopy)) return;

    if (memberShipSetting) {
      if (memberShipSetting.endDate !== originalInfo?.endDate) {
        throw new CustomerException(
          {
            code: configError._260014?.code,
            msg: `${configError._260014?.msg}會籍到期日。`
          },
          HttpStatus.OK
        );
      }
      if (memberShipSetting.startDateYear !== originalInfo?.startDateYear) {
        throw new CustomerException(
          {
            code: configError._260014?.code,
            msg: `${configError._260014?.msg}會籍續等/升等期限。`
          },
          HttpStatus.OK
        );
      }
    }

    if (memberShip) {
      if (memberShip.nextMemberShip !== originalInfo?.nextMemberShip) {
        throw new CustomerException(
          {
            code: configError._260014?.code,
            msg: `${configError._260014?.msg}NEXT會籍。`
          },
          HttpStatus.OK
        );
      }
      if (
        memberShip.purchasedCount !== originalInfo?.purchasedCount ||
        memberShip.purchasedTimes !== originalInfo?.purchasedTimes
      ) {
        throw new CustomerException(
          {
            code: configError._260014?.code,
            msg: `${configError._260014?.msg}會籍資格。`
          },
          HttpStatus.OK
        );
      }
      if (memberShip.expiresChange !== originalInfo?.expiresChange) {
        throw new CustomerException(
          {
            code: configError._260014?.code,
            msg: `${configError._260014?.msg}會籍到期異動方式。`
          },
          HttpStatus.OK
        );
      }
    }
  }

  /**
   * 新增編輯單項會籍
   * @param req
   * @returns
   */
  async addMemberShip(req: AddMemberShipDto): Promise<AddMemberShipResp> {
    // 複製的會籍版本不能編輯 next會籍、會籍資格、會籍續等/升等期限、會籍到期日、會籍到期異動方式
    await this.checkCopyMemberShip(null, req);

    const authMemberId = req?.iam?.authMemberId;

    const status = await this.memberShipRepository.getMemberShipSettingStatus(
      req?.settingId
    );
    // 會籍設定不存在
    if (!status && status !== 0)
      throw new CustomerException(configError._260008, HttpStatus.OK);
    // 生效中無法編輯
    if (status === 2)
      throw new CustomerException(configError._260009, HttpStatus.OK);

    // 待生效不能儲存草稿
    if (status === 1 && !req?.isRelease)
      throw new CustomerException(configError._260011, HttpStatus.OK);

    const memberShipCount = await this.memberShipRepository.getMemberShipCount(
      req?.settingId
    );
    // 會籍資料最多新增10個
    if (memberShipCount > 10)
      throw new CustomerException(configError._260004, HttpStatus.OK);

    let memberShipId;
    if (req?.memberShipId?.length) {
      memberShipId = req?.memberShipId;
    } else {
      const lastId = await this.memberShipRepository.getLatestId(
        'Member_Ship_Branch_ID',
        'IEat_Member_Ship_Branch',
        5,
        6,
        `Member_Ship_ID = '${req?.settingId}'`
      );
      lastId
        ? (memberShipId = `${req?.settingId}${(Number(lastId) + 1)
            .toString()
            .padStart(2, '0')}`)
        : (memberShipId = `${req?.settingId}01`);
    }

    // 目前積點只有兩個
    if (
      req?.basicSetting?.setting?.length > 2 ||
      req?.birthdaySetting?.setting?.length > 2
    )
      throw new CustomerException(configError._200002, HttpStatus.OK);

    await this.memberShipRepository.addMemberShip(memberShipId, req);

    if (req?.renewalCouponIds?.length > 0) {
      const renewalCouponDetails =
        await this.couponRepository.getCouponSettingDetails(
          req?.renewalCouponIds,
          COUPON_REWARD_RULES_TYPE.RENEWAL
        );

      // 檢查續會禮 是否存在
      if (renewalCouponDetails?.length != req?.renewalCouponIds?.length) {
        throw new CustomerException(configError._320001, HttpStatus.OK);
      }
    }

    if (req?.upgradeCouponIds?.length > 0) {
      const upgradeCouponDetails =
        await this.couponRepository.getCouponSettingDetails(
          req?.upgradeCouponIds,
          COUPON_REWARD_RULES_TYPE.UPGRADE
        );

      // 檢查升等禮 是否存在
      if (upgradeCouponDetails?.length != req?.upgradeCouponIds?.length) {
        throw new CustomerException(configError._320001, HttpStatus.OK);
      }
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      await this.memberShipRepository.initMemberShipBranchGift(
        connection,
        memberShipId,
        authMemberId
      );

      if (
        req?.upgradeCouponIds?.length > 0 ||
        req?.renewalCouponIds?.length > 0
      ) {
        await this.memberShipRepository.addMemberShipBranchGift(
          connection,
          memberShipId,
          req?.renewalCouponIds,
          req?.upgradeCouponIds,
          authMemberId
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._260012, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return { memberShipId };
  }

  /**
   * 新增編輯單項會籍
   * @param req
   * @returns
   */
  async updateActiveMemberShip(
    req: UpdateActiveMemberShipDto
  ): Promise<AddMemberShipResp> {
    const authMemberId = req?.iam?.authMemberId;
    const status = await this.memberShipRepository.getMemberShipSettingStatus(
      req?.settingId
    );

    // 只有生效中可以叫這隻 API
    if (status !== 2)
      throw new CustomerException(configError._200002, HttpStatus.OK);

    if (req?.renewalCouponIds?.length) {
      const renewalCouponDetails =
        await this.couponRepository.getCouponSettingDetails(
          req?.renewalCouponIds,
          COUPON_REWARD_RULES_TYPE.RENEWAL
        );

      // 檢查續會禮 是否存在
      if (renewalCouponDetails?.length != req?.renewalCouponIds?.length) {
        throw new CustomerException(configError._320001, HttpStatus.OK);
      }
    }

    if (req?.upgradeCouponIds?.length) {
      const upgradeCouponDetails =
        await this.couponRepository.getCouponSettingDetails(
          req?.upgradeCouponIds,
          COUPON_REWARD_RULES_TYPE.UPGRADE
        );

      // 檢查升等禮 是否存在
      if (upgradeCouponDetails?.length != req?.upgradeCouponIds?.length) {
        throw new CustomerException(configError._320001, HttpStatus.OK);
      }
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      if (req?.upgradeCouponIds?.length || req?.renewalCouponIds?.length) {
        await this.memberShipRepository.addMemberShipBranchGift(
          connection,
          req?.memberShipId,
          req?.renewalCouponIds,
          req?.upgradeCouponIds,
          authMemberId
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._260012, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return { memberShipId: req?.memberShipId };
  }

  /**
   * 發布會籍版本
   * @param settingId
   */
  async releaseMemberShipSetting(
    settingId: string
  ): Promise<Record<string, never>> {
    const status = await this.memberShipRepository.getMemberShipSettingStatus(
      settingId
    );
    // 會籍設定不存在
    if (!status && status !== 0)
      throw new CustomerException(configError._260008, HttpStatus.OK);
    // 生效中無法編輯
    if (status === 2)
      throw new CustomerException(configError._260010, HttpStatus.OK);

    const memberShipCount = await this.memberShipRepository.getMemberShipCount(
      settingId
    );
    // 會籍資料最多新增10個
    if (memberShipCount === 0)
      throw new CustomerException(configError._260003, HttpStatus.OK);

    await this.memberShipRepository.releaseMemberShipSetting(settingId);

    return {};
  }

  /**
   * 會籍版本設定詳細資訊
   * @param settingId
   */
  async getMemberShipSettingInfo(
    settingId: string
  ): Promise<GetMemberShipSettingInfoResp> {
    const settingInfo =
      await this.memberShipRepository.getMemberShipSettingInfo(settingId);

    const memberShipGifts = await this.memberShipRepository.getMemberShipGift(
      settingId
    );

    // 整理註冊禮
    const registerGiftList = [] as RegisterGift[];
    const couponGiftChannel = {};
    memberShipGifts?.forEach((gift) => {
      if (!couponGiftChannel[gift.channelId]) {
        couponGiftChannel[gift.channelId] = [] as MemberShipCouponDetail[];
        registerGiftList.push({
          channelId: gift.channelId,
          channelName: gift.channelName,
          couponDetail: [] as MemberShipCouponDetail[]
        });
      }

      if (gift.couponId) {
        couponGiftChannel[gift.channelId].push({
          couponId: gift.couponId,
          couponName: gift.couponName
        });
      }
    });

    // 整理兌換券詳情
    registerGiftList?.forEach((gift) => {
      gift.couponDetail = couponGiftChannel[gift.channelId];
    });

    const memberShipIds = settingInfo?.map((setting) => {
      return setting?.memberShipId;
    });

    const memberShipBranchGifts =
      await this.memberShipRepository.getMemberShipBranchGifts(memberShipIds);

    // 整理會籍設定續會禮與續會禮
    const upgradeGiftList = {};
    const renewalGiftList = {};
    memberShipBranchGifts?.forEach((gift) => {
      switch (gift.giftType) {
        case MEMBER_SHIP_GIFT_STR.UPGRADE:
          if (!upgradeGiftList[gift.memberShipBranchId]) {
            upgradeGiftList[gift.memberShipBranchId] =
              [] as MemberShipCouponDetail[];
          }

          upgradeGiftList[gift.memberShipBranchId].push({
            couponId: gift.couponId,
            couponName: gift.couponName
          });
          break;
        case MEMBER_SHIP_GIFT_STR.RENEWAL:
          if (!renewalGiftList[gift.memberShipBranchId]) {
            renewalGiftList[gift.memberShipBranchId] =
              [] as MemberShipCouponDetail[];
          }

          renewalGiftList[gift.memberShipBranchId].push({
            couponId: gift.couponId,
            couponName: gift.couponName
          });
          break;
      }
    });

    let memberShips = [];
    const result = settingInfo.reduce((acc, item, index) => {
      if (index === 0) {
        acc.settingId = item?.settingId;
        acc.settingName = item?.settingName;
        acc.startDate = item?.startDate;
        acc.startDateCount = item?.startDateCount;
        acc.startDateYear = item?.startDateYear;
        acc.endDate = item?.endDate;
        acc.consumptionUpgrade = item?.consumptionUpgrade;
        acc.consumptionDue = item?.consumptionDue;
        acc.upgradeDay = item?.upgradeDay;
        acc.upgradeNum = item?.upgradeNum;
        acc.isCopy = Boolean(item?.isCopy) ?? false;
      }

      const existingMemberShip = acc.memberShip?.find(
        (membership) => membership.memberShipId === item?.memberShipId
      );

      let basicSettingActiveStatus,
        basicSettingActiveDay,
        birthdaySettingActiveStatus,
        birthdaySettingActiveDay;

      const basicSettingInfo = settingInfo
        ?.filter(
          (setting) =>
            setting.memberShipId === item?.memberShipId &&
            setting.pointType === ENUM_POINT_TYPE.SETTING_BASIC
        )
        ?.map((x) => {
          basicSettingActiveStatus = x?.activeStatus;
          basicSettingActiveDay = x?.activeDay;
          return {
            pointType: x?.pointType,
            pointRatioType: x?.pointRatioType,
            status: x?.status,
            purchasedSum: x?.purchasedSum,
            purchasedEvery: x?.purchasedEvery,
            purchasedPoint: x?.purchasedPoint
          };
        });
      const birthdaySettingInfo = settingInfo
        .filter(
          (setting) =>
            setting.memberShipId === item?.memberShipId &&
            setting.pointType === ENUM_POINT_TYPE.SETTING_BIRTHDAY
        )
        ?.map((x) => {
          birthdaySettingActiveStatus = x?.activeStatus;
          birthdaySettingActiveDay = x?.activeDay;
          return {
            pointType: x?.pointType,
            pointRatioType: x?.pointRatioType,
            status: x?.status,
            purchasedSum: x?.purchasedSum,
            purchasedEvery: x?.purchasedEvery,
            purchasedPoint: x?.purchasedPoint
          };
        });

      const basicSetting = <BasicSetting>{};
      basicSetting.activeStatus = basicSettingActiveStatus;
      basicSetting.activeDay = basicSettingActiveDay;
      basicSetting.setting = basicSettingInfo;

      const birthdaySetting = <BirthdaySetting>{};
      birthdaySetting.activeStatus = birthdaySettingActiveStatus;
      birthdaySetting.activeDay = birthdaySettingActiveDay;
      birthdaySetting.setting = birthdaySettingInfo;

      const memberShipItem = <MemberShip>{};
      memberShipItem.memberShipId = item?.memberShipId;
      memberShipItem.memberShipName = item?.memberShipName;
      memberShipItem.nextMemberShip = item?.nextShipId;
      memberShipItem.purchasedCount = item?.purchasedCount;
      memberShipItem.purchasedTimes = item?.purchasedTimes;
      memberShipItem.expiresChange = item?.expiresChange;
      memberShipItem.upgradeGift = upgradeGiftList[item?.memberShipId] ?? {};
      memberShipItem.renewalGift = renewalGiftList[item?.memberShipId] ?? {};
      memberShipItem.basicSetting = basicSetting;
      memberShipItem.birthdaySetting = birthdaySetting;

      if (!existingMemberShip && item?.memberShipId) {
        memberShips.push(memberShipItem);
      } else if (!item?.memberShipId) {
        memberShips = [];
      }

      acc.memberShip = memberShips;
      return acc;
    }, <GetMemberShipSettingInfoResp>{});

    result.memberShip = await this.sortMemberShip<MemberShip>(
      result?.memberShip
    );
    result.registerGift = registerGiftList;

    return result;
  }

  /**
   * 會籍排序
   * @param memberShip
   * @returns
   */
  async sortMemberShip<T>(data: SortMemberShipReq[]): Promise<T[]> {
    const findLowestId = (data: SortMemberShipReq[]) => {
      const nextIdSet = new Set(data?.map((item) => item?.nextMemberShip));

      for (const item of data) {
        if (!nextIdSet.has(item?.memberShipId)) {
          return item?.memberShipId;
        }
      }
    };

    const sortedMemberShip = [];
    let currentId = findLowestId(data);

    while (currentId) {
      const currentItem = data?.find(
        (item) => item?.memberShipId === currentId
      );
      sortedMemberShip.push(currentItem);
      currentId = currentItem?.nextMemberShip;
    }

    // 沒有綁 next sort 後會籍會遺失，多判斷長度不一樣的話塞回去
    if (data?.length !== sortedMemberShip?.length) {
      const noNextMemberShip = data.filter((itemA) => {
        return !sortedMemberShip.some(
          (itemB) => itemB.memberShipId === itemA.memberShipId
        );
      });

      noNextMemberShip.forEach((x) => {
        sortedMemberShip.push(x);
      });
    }

    return sortedMemberShip;
  }

  /**
   * 取得會員消費納入會籍計算時間 & next會籍參數
   * @param settingId
   */
  async getMemberSettingParameter(
    req: GetMemberSettingParameterDto
  ): Promise<GetMemberSettingParameterResp> {
    const setting = await this.memberShipRepository.getBasicSetting();
    let memberShipList: ValueLable[] = [];

    const memberShipListFromDb =
      await this.memberShipRepository.geMemberShipList(req);
    const sortMemberShipList =
      (await this.sortMemberShip<GetMemberShipListResp>(
        memberShipListFromDb
      )) ?? [];
    memberShipList = sortMemberShipList?.map((x) => {
      return {
        value: x?.memberShipId,
        label: x?.memberShipName
      };
    });

    const result = <GetMemberSettingParameterResp>{};
    result.setting = setting ?? [];
    result.memberShipList = memberShipList;

    return result;
  }

  /**
   * 會籍版本設定詳細資訊
   * @param settingId
   */
  async getBasicMemberShipSetting(): Promise<GetBasicMemberShipSettingResp> {
    const result = await this.memberShipRepository.getBasicMemberShipSetting();

    return result;
  }

  /**
   * 計算會籍起訖日
   * @param params
   */
  async calcMemberShipStartEndDate(
    params: GetBasicMemberShipSettingResp
  ): Promise<CalcMemberShipStartEndDateResp> {
    const memberShipSetting = params;
    const today = moment().tz(process.env.TIME_ZONE).format('YYYY/MM/DD');
    let memberShipEndDate;

    // 防呆：會籍啟始日-計算&會籍到期日都有選預設選項的情境
    if (
      memberShipSetting?.endDate === 1 &&
      memberShipSetting?.memberShipCount === 1
    ) {
      if (today?.slice(5) === '02/29') {
        // 取得幾年後三月的第一天
        memberShipEndDate = moment()
          .tz(process.env.TIME_ZONE)
          .add(memberShipSetting?.memberShipYear, 'y')
          .month(2)
          .startOf('M');
      } else {
        // 幾年後的今天
        memberShipEndDate = moment()
          .tz(process.env.TIME_ZONE)
          .add(memberShipSetting?.memberShipYear, 'y');
      }
      memberShipEndDate = memberShipEndDate
        .set({
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 59
        })
        .format('YYYY/MM/DD HH:mm:ss');
    } else {
      memberShipEndDate = null;
    }

    const result = <CalcMemberShipStartEndDateResp>{};
    result.memberShipId = memberShipSetting?.memberShipId;
    result.today = today;
    result.memberShipEndDate = memberShipEndDate;

    return result;
  }

  /**
   * 取得會員會籍下拉式選單
   *
   * @returns
   */
  async getMemberShipMenu(): Promise<GetMemberShipMenuResp> {
    // 會籍設定
    const activeMemberShipId = (
      await this.getMemberShipSettingList()
    )?.settingList?.find(
      (x) => x.settingStatus === ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE
    );

    // 會籍資料
    const memberShipList = (
      await this.getMemberSettingParameter(activeMemberShipId)
    )?.memberShipList;

    const result = <GetMemberShipMenuResp>{};
    result.memberShipList = memberShipList;

    return result;
  }

  /**
   * batch insert data for demo and qa team
   * @param req
   */
  async batchDemo(req) {
    switch (req?.body?.key) {
      // 新訂單
      case 'membeShip:order':
      case 'point:add':
        const orderId = await this.createOrderId(
          moment().tz(process.env.TIME_ZONE).format('YYYYMMDD')
        );
        await this.memberShipRepository.insertOrderBatchDemo(
          orderId,
          req?.body?.data
        );

        break;

      // 退貨訂單
      case 'membeShip:orderReturn':
      case 'point:minus':
        await this.memberShipRepository.insertReturnBatchDemo(req?.body?.data);
        break;
    }
    const redisData = {
      memberId: req?.body?.data?.memberId,
      tradeDate: req?.body?.data?.tradeDate,
      orderFinishDate: req?.body?.data?.tradeDate,
      canCalcDate: req?.body?.data?.tradeDate,
      realCalcDate: req?.body?.data?.tradeDate,
      amount: req?.body?.data?.amount,
      source: 'POS',
      channelId: 'Ch0000',
      orderType: 'POS',
      transactionId: req?.body?.data?.transactionId,
      brandId: 'CX',
      brandName: 'TT品牌',
      storeId: 'S2212290073',
      storeName: '台北202店'
    };
    await this.redisService.lpushData(
      req?.body?.key,
      JSON.stringify(redisData)
    );
  }

  async batchMemberShipDemo(req) {
    const orderMainData = await this.memberShipRepository.getOrderMainBatchDemo(
      req?.body?.page,
      req?.body?.perPage
    );

    const orderTask = [];
    for (const data of orderMainData) {
      const redisData = {
        memberId: data?.memberId,
        tradeDate: moment(data?.tradeDate).format('YYYY-MM-DD HH:mm:ss'),
        orderFinishDate: moment(data?.tradeDate).format('YYYY-MM-DD HH:mm:ss'),
        canCalcDate: moment(data?.tradeDate).format('YYYY-MM-DD HH:mm:ss'),
        realCalcDate: moment(data?.tradeDate).format('YYYY-MM-DD HH:mm:ss'),
        amount: data?.amount,
        source: data?.source,
        channelId: data?.channelId,
        orderType: data?.orderType,
        transactionId: data?.transactionId,
        brandId: data?.brandId,
        brandName: data?.brandName,
        storeId: data?.storeId,
        storeName: data?.storeName
      };

      orderTask.push(
        this.redisService.lpushData(
          'membeShip:order',
          JSON.stringify(redisData)
        )
      );
    }

    await Promise.all(orderTask);

    const returnMainData =
      await this.memberShipRepository.getReturnMainBatchDemo(
        req?.body?.page,
        req?.body?.perPage
      );

    const orderReturnTask = [];
    for (const data of returnMainData) {
      const redisData = {
        memberId: data?.memberId,
        tradeDate: moment(data?.tradeDate).format('YYYY-MM-DD HH:mm:ss'),
        orderFinishDate: moment(data?.tradeDate).format('YYYY-MM-DD HH:mm:ss'),
        canCalcDate: moment(data?.tradeDate).format('YYYY-MM-DD HH:mm:ss'),
        realCalcDate: moment(data?.tradeDate).format('YYYY-MM-DD HH:mm:ss'),
        amount: data?.amount,
        source: data?.source,
        channelId: data?.channelId,
        orderType: data?.orderType,
        transactionId: data?.transactionId,
        brandId: data?.brandId,
        brandName: data?.brandName,
        storeId: data?.storeId,
        storeName: data?.storeName
      };

      orderReturnTask.push(
        this.redisService.lpushData(
          'membeShip:orderReturn',
          JSON.stringify(redisData)
        )
      );
    }

    await Promise.all(orderReturnTask);
  }

  /**
   * 創建orderId
   * @param date
   * @returns
   */
  async createOrderId(date: string): Promise<string> {
    let nextOrderId;
    const redisKey = `${config.REDIS_KEY.MAX_ORDER_ID}:${date}`;
    nextOrderId = await this.redisService.rpopData(redisKey);
    if (nextOrderId) return nextOrderId;

    const prefix = `O${date}`;
    const maxCouponTransactionId =
      await this.memberShipRepository.getMaxOrderId();

    let seq = 1;
    if (maxCouponTransactionId) {
      const maxDate = maxCouponTransactionId.substring(1, 9);
      if (date == maxDate) {
        seq = Number(maxCouponTransactionId.substring(9, 15));
      }
    }

    const orderId: string[] = generateSerialNumber(prefix, seq, 6);
    await this.redisService.lpushData(
      redisKey,
      orderId,
      secondsUntilEndOfDay()
    );

    nextOrderId = await this.redisService.rpopData(redisKey);

    return nextOrderId;
  }
}
