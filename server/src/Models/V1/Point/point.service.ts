import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import configError from 'src/Config/error.message.config';
import { MetaDataCommon } from 'src/Definition/Dto/common';
import { ENUM_POINT_TYPE_LOG } from 'src/Definition/Enum/Coupon/point.type.log.enum';
import { CSV_FILE_EXTENSIONS } from 'src/Definition/Enum/Member/file.extension.enum';
import { ENUM_MEMBER_SHIP_SETTING_STATUS_CODE } from 'src/Definition/Enum/MemberShip/member.ship.setting.status.enum';
import { ENUM_ACTIVE_STATUS } from 'src/Definition/Enum/Point/active.status.enum';
import { ENUM_ADJUST_DATA_TYPE } from 'src/Definition/Enum/Point/adjust.data.type.enum';
import {
  ENUM_ADJUST_MEMBER_TYPE,
  ENUM_ADJUST_MEMBER_TYPE_STR
} from 'src/Definition/Enum/Point/adjust.member.type.enum';
import {
  ENUM_ADJUST_POINT_TYPE,
  ENUM_ADJUST_POINT_TYPE_STR
} from 'src/Definition/Enum/Point/adjust.point.type.enum';
import { ENUM_BASIC_SETTING_STR } from 'src/Definition/Enum/Point/basic.setting.enum';
import { ENUM_POINT_RATIO_TYPE } from 'src/Definition/Enum/Point/point.ratio.type.enum';
import { ENUM_REWARD_STATUS } from 'src/Definition/Enum/Point/reward.status.enum';
import {
  ENUM_REWARD_TYPE,
  ENUM_REWARD_TYPE_STR
} from 'src/Definition/Enum/Point/reward.type.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import {
  getLogTableNameByMonth,
  joinErrorMsg,
  removeFirstZero
} from 'src/Utils/tools';
import { v4 as ruuidv4 } from 'uuid';
import { BrandService } from '../Brand/brand.service';
import { ChannelRepository } from '../Channel/channel.repository';
import { CommonService } from '../Common/common.service';
import { MealPeriodService } from '../MealPeriod/meal.period.service';
import { MemberRepository } from '../Member/member.repository';
import { MemberShipService } from '../MemberShip/memberShip.service';
import { AddConsSettingtDto } from './Dto/add.cons.setting.dto';
import { AddPointAdjustDto } from './Dto/add.point.adjust.dto';
import { AddRewardSettingtDto } from './Dto/add.reward.setting.dto';
import { DownloadMemberPointExampleResp } from './Dto/download.member.special.type.example.dto';
import {
  GetPointSendingListDto,
  GetPointSendingListResp
} from './Dto/get.point.sending.list.dto';
import {
  GetProductListDto,
  GetProductListResp
} from './Dto/get.product.list.dto';
import { GetStoreListDto, GetStoreListResp } from './Dto/get.store.list.dto';
import { UpdateBasicSettingDto } from './Dto/update.basic.setting.dto';
import {
  ExcelData,
  UploadMemberPointResp
} from './Dto/upload.member.point.dto';
import { GetBasicSettingInfoResp } from './Interface/get.basic.setting.info.interface';
import { GetConsSettingInfoResp } from './Interface/get.cons.setting.info.interface';
import { GetConsSettingParameterResp } from './Interface/get.cons.setting.parameter.interface';
import { GetPointAdjustInfoResp } from './Interface/get.point.adjust.info.interface';
import {
  AdjustList,
  GetPointAdjustListResp
} from './Interface/get.point.adjust.list.interface';
import { GetPointSendingFilterOptionsResp } from './Interface/get.point.sending.filter.options.interface';
import { GetRewardSettingInfoResp } from './Interface/get.reward.setting.info.interface';
import { GetStoreFilterOptionResp } from './Interface/get.store.filter.options';
import { PointRepository } from './point.repository';

import moment = require('moment-timezone');

@Injectable()
export class PointService {
  constructor(
    private pointRepository: PointRepository,
    private channelRepository: ChannelRepository,
    private memberRepository: MemberRepository,
    private memberShipService: MemberShipService,
    private mealPeriodService: MealPeriodService,
    private brandService: BrandService,
    private csvDownloadExample: CsvDownloadExample,
    private commonService: CommonService,
    private convertExcel: ConvertExcel
  ) {}

  /**
   * 取得基本設定詳細資訊
   */
  async getBasicSettingInfo(): Promise<GetBasicSettingInfoResp> {
    const basicSettingInfo = await this.pointRepository.getBasicSetting();
    const pointId = [...new Set(basicSettingInfo?.map((x) => x.pointId))];

    if (!pointId?.find((x) => x)) {
      const channelList = await this.channelRepository.getChannelList();
      const channel = channelList.reduce((unique, o) => {
        if (!unique.some((obj) => obj.channelId === o.channelId)) {
          if (o?.pointCalculation) {
            unique.push({
              channelId: o?.channelId,
              channelName: o?.channelName,
              fullDate: null
            });
          }
        }
        return unique;
      }, []);

      const result = <GetBasicSettingInfoResp>{};
      result.channel = channel;
      return result;
    }

    const channel = [];
    const result: GetBasicSettingInfoResp = basicSettingInfo.reduce(
      (acc, curr) => {
        if (acc.pointId === null || curr.pointId !== null) {
          // 第一筆資料處理為新物件的基礎
          acc.pointId = curr.pointId;
          acc.pointName = curr.pointName;
          acc.pointRatio = curr.pointRatio;
          acc.expiryYear = Math.floor(curr.expiryDay / 365);
          acc.expiryMonth = curr.expiryMonth;
          acc.expiryDate = curr.expiryDate;
          acc.channel = channel;
        }
        channel.push({
          channelId: curr.channelId,
          channelName: curr.channelName,
          fullDate: curr.fullDate
        });

        return acc;
      },
      <GetBasicSettingInfoResp>{}
    );

    return result;
  }

  /**
   * 編輯基本設定
   * @param req
   */
  async updateBasicSetting(
    req: UpdateBasicSettingDto
  ): Promise<Record<string, never>> {
    let oldSettingInfo = await this.getBasicSettingInfo();
    oldSettingInfo.channel.forEach((item) => delete item.channelName);

    // 判斷哪些欄位被修改
    let changedFields = {
      field: [],
      fieldName: [],
      newValue: []
    };
    for (const key in oldSettingInfo) {
      if (oldSettingInfo.hasOwnProperty(key)) {
        if (JSON.stringify(oldSettingInfo[key]) !== JSON.stringify(req[key])) {
          changedFields.field.push(key);
          changedFields.fieldName.push(ENUM_BASIC_SETTING_STR[key]);
          changedFields.newValue.push(
            typeof req[key] === 'string' ? req[key] : JSON.stringify(req[key])
          );
        }
      }
    }

    await this.pointRepository.updateBasicSetting(req, changedFields);
    return {};
  }

  /**
   * 積點發放規則列表
   * @param req
   */
  async getPointSendingList(
    req: GetPointSendingListDto
  ): Promise<GetPointSendingListResp> {
    // 只要頁數其中一個參數未定義，就使用預設值
    if (!req?.page || !req?.perPage) {
      req.page = 1;
      req.perPage = 20;
    }

    // 取得列表筆數＆積點發放規則列表
    const sendingInfo = await this.pointRepository.getPointSendingInfo(req);
    const { rewardCount, rewardList } = sendingInfo;
    const sendingCount = rewardCount?.[0]?.rewardCount;

    const sendingList = rewardList?.map((send) => {
      let rewardPoints = [];

      // 處理回饋積點 wording
      send?.rewardPoints.forEach((point) => {
        if (send?.rewardType === ENUM_REWARD_TYPE.REWARD) {
          rewardPoints.push(
            `${point?.handselPoint?.toLocaleString('en-US') ?? 0}點`
          );
        }
        if (send?.rewardType === ENUM_REWARD_TYPE.CONS) {
          if (point?.ratioType === ENUM_POINT_RATIO_TYPE.FIX)
            rewardPoints.push(
              `消費滿${
                point?.purchasedSum?.toLocaleString('en-US') ?? 0
              }元, 贈送${point?.handselPoint?.toLocaleString('en-US') ?? 0}點`
            );
          if (point?.ratioType === ENUM_POINT_RATIO_TYPE.RATIO)
            rewardPoints.push(
              `消費滿${
                point?.purchasedSum?.toLocaleString('en-US') ?? 0
              }元, 每${
                point?.purchasedEvery?.toLocaleString('en-US') ?? 0
              }元贈送${point?.handselPoint?.toLocaleString('en-US') ?? 0}點`
            );
        }
      });

      return {
        ...send,
        memberShipName: [...new Set(send?.memberShipName)],
        rewardPoints: [...new Set(rewardPoints)],
        rewardStatus: req?.status,
        rewardTypeStr: ENUM_REWARD_TYPE_STR[send?.rewardType]
      };
    });

    const metaData = <MetaDataCommon>{};
    metaData.page = req?.page;
    metaData.perPage = req?.perPage;
    metaData.totalCount = sendingCount;
    metaData.totalPage = Math.ceil(sendingCount / req?.perPage);

    const result = <GetPointSendingListResp>{};
    result.metaData = metaData;
    result.sendingList = sendingList;

    return result;
  }

  /**
   * 積點發放規則篩選資料
   */
  async getPointSendingFilterOptions(): Promise<GetPointSendingFilterOptionsResp> {
    // 會籍
    const activeMemberShipId = (
      await this.memberShipService.getMemberShipSettingList()
    )?.settingList?.find(
      (x) => x.settingStatus === ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE
    );

    const memberShipList = (
      await this.memberShipService.getMemberSettingParameter(activeMemberShipId)
    )?.memberShipList;

    // 類型
    const rewardType = Object.keys(ENUM_REWARD_TYPE)?.map((x) => {
      return {
        value: ENUM_REWARD_TYPE[x],
        label: ENUM_REWARD_TYPE_STR[ENUM_REWARD_TYPE[x]]
      };
    });

    const result = <GetPointSendingFilterOptionsResp>{};
    result.memberShipList = memberShipList;
    result.rewardType = rewardType;

    return result;
  }

  /**
   * 複製發放規則
   * @param rewardId 活動編號
   */
  async copyPointSending(rewardId: string): Promise<Record<string, never>> {
    const newRewardId = await this.getPointLatestId();

    await this.pointRepository.copyPointSending(rewardId, newRewardId);

    return {};
  }

  /**
   * 停用發放規則
   * @param rewardId 活動編號
   * @param authMemberId 登入者會員編號
   * @returns
   */
  async stopPointSending(
    rewardId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    // 取得活動開始日
    const rewardDate = await this.pointRepository.getRewardDate(rewardId);

    const today = moment().utc().valueOf();

    // 只有進行中可以停用
    if (
      today < moment.utc(rewardDate?.startDate).valueOf() ||
      today > moment.utc(rewardDate?.endDate).valueOf()
    )
      throw new CustomerException(configError._370004, HttpStatus.OK);

    // 停用即直接寫入當下時間為活動結束時間
    await this.pointRepository.stopPointSending(rewardId, authMemberId);

    return {};
  }

  /**
   * 新增/編輯消費型積點設定
   * @param req
   */
  async addConsSetting(
    req: AddConsSettingtDto
  ): Promise<Record<string, never>> {
    let rewardId;
    req?.rewardId?.length
      ? (rewardId = req?.rewardId)
      : (rewardId = await this.getPointLatestId());

    // 開始時間需早於結束時間
    if (Date.parse(req?.startDate) >= Date.parse(req?.endDate))
      throw new CustomerException(configError._370002, HttpStatus.OK);

    // 指定天數天數必填
    if (req?.activeStatus === ENUM_ACTIVE_STATUS.DAY && !req?.activeDay)
      throw new CustomerException(configError._370003, HttpStatus.OK);

    // utc+0
    const startDate = moment
      .tz(req?.startDate, process.env.DATE_TIME, process.env.TIME_ZONE)
      .utc()
      .format(process.env.DATE_TIME);
    const endDate = moment
      .tz(req?.endDate, process.env.DATE_TIME, process.env.TIME_ZONE)
      .utc()
      .format(process.env.DATE_TIME);

    await this.pointRepository.addConsSetting(
      rewardId,
      req,
      startDate,
      endDate
    );

    return {};
  }

  /**
   * 消費型積點設定所需參數
   */
  async getConsSettingParameter(): Promise<GetConsSettingParameterResp> {
    // 會籍
    const activeMemberShipId = (
      await this.memberShipService.getMemberShipSettingList()
    )?.settingList?.find(
      (x) => x.settingStatus === ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE
    );
    const memberShip = (
      await this.memberShipService.getMemberSettingParameter(activeMemberShipId)
    )?.memberShipList;

    // 渠道
    const channel = (await this.channelRepository.getChannelList()).reduce(
      (unique, o) => {
        if (!unique.some((obj) => obj.value === o.channelId)) {
          if (o?.pointCalculation) {
            unique.push({
              value: o?.channelId,
              label: o?.channelName
            });
          }
        }
        return unique;
      },
      []
    );

    // 餐期
    const mealPeriod = (
      await this.mealPeriodService.getPOSMealPeriodList()
    )?.map((x) => {
      return {
        value: x?.id.toString(),
        label: x?.mealPeriodName
      };
    });

    // 品牌
    const brand = (await this.brandService.getBrandList())?.map((x) => {
      return {
        isCorporation: x?.isCorporation,
        value: x?.brandId,
        label: x?.name
      };
    });

    const result = <GetConsSettingParameterResp>{};
    result.memberShip = memberShip;
    result.channel = channel;
    result.mealPeriod = mealPeriod;
    result.brand = brand;
    return result;
  }

  /**
   * 消費型積點設定詳細資料
   * @param rewardId
   */
  async getConsSettingInfo(rewardId: string): Promise<GetConsSettingInfoResp> {
    const getConsSettingInfo = await this.pointRepository.getConsSettingInfo(
      rewardId
    );
    if (!getConsSettingInfo?.consSettingInfo?.length)
      return <GetConsSettingInfoResp>{};

    const consSettingInfo = getConsSettingInfo?.consSettingInfo?.[0];
    let consSettingBrand = getConsSettingInfo?.consSettingBrand;
    const consSettingProduct = getConsSettingInfo?.consSettingProduct;
    let brands = getConsSettingInfo?.brands;
    let rewardPoint = {};
    const rewardPoints = consSettingInfo?.rewardPoints?.reduce((acc, curr) => {
      if (!rewardPoint[curr?.ratioType]) {
        rewardPoint[curr?.ratioType] = curr?.ratioType;
        acc.push({ ...curr, ratioStatus: Boolean(curr?.ratioStatus) });
      }
      return acc;
    }, []);

    // 如果有包含集團的話直接顯示集團
    if (brands?.filter((x) => x.isCorporation)?.length) {
      brands = brands?.filter((x) => x.isCorporation);
      consSettingBrand = [];
    }

    const result = <GetConsSettingInfoResp>{};
    result.rewardId = consSettingInfo?.rewardId;
    result.rewardName = consSettingInfo?.rewardName;
    result.startDate = consSettingInfo?.startDate;
    result.endDate = consSettingInfo?.endDate;
    result.exceptionDate = !consSettingInfo?.exceptionDate?.[0]
      ? []
      : [...new Set(consSettingInfo?.exceptionDate)];
    result.channelId = [...new Set(consSettingInfo?.channelId)];
    result.memberShip = [...new Set(consSettingInfo?.memberShip)];
    result.mealPriodId = !consSettingInfo?.mealPriodId?.[0]
      ? []
      : [...new Set(consSettingInfo?.mealPriodId)];
    result.rewardPoints = rewardPoints;
    result.activeStatus = consSettingInfo?.activeStatus;
    result.activeDay = consSettingInfo?.activeDay;
    result.selectStore = consSettingInfo?.selectStore;
    result.brands = brands;
    result.brandAndStore = consSettingBrand;
    result.product = consSettingProduct;

    return result;
  }

  /**
   * 取得品牌門市列表
   * @param req
   */

  async getStoreList(req: GetStoreListDto): Promise<GetStoreListResp> {
    // 只要頁數其中一個參數未定義，就使用預設值
    if (!req?.page || !req?.perPage) {
      req.page = 1;
      req.perPage = 20;
    }

    // 取得列表筆數＆門市列表
    const storeInfo = await this.pointRepository.getSotreInfo(req);
    const { storeListCount, storeList } = storeInfo;
    const storeCount = storeListCount?.[0]?.storeCount;

    const metaData = <MetaDataCommon>{};
    metaData.page = req?.page;
    metaData.perPage = req?.perPage;
    metaData.totalCount = storeCount;
    metaData.totalPage = Math.ceil(storeCount / req?.perPage);

    const result = <GetStoreListResp>{};
    result.metaData = metaData;
    result.storeList = storeList;

    return result;
  }

  /**
   * 門市列表篩選資料
   */
  async getStoreFilterOptions(): Promise<GetStoreFilterOptionResp> {
    const cityAndZip = await this.commonService.getTownshipCityData();
    const storeOptions = await this.pointRepository.getStoreFilterOptions();
    const { mallInfo, brandInfo } = storeOptions;
    const mall = mallInfo?.map((x) => x?.mallName);

    const result = <GetStoreFilterOptionResp>{};
    result.cityAndZip = cityAndZip;
    result.mall = mall;
    result.brand = brandInfo;

    return result;
  }

  /**
   * 取得商品列表
   * @param req
   */

  async getProductList(req: GetProductListDto): Promise<GetProductListResp> {
    // 只要頁數其中一個參數未定義，就使用預設值
    if (!req?.page || !req?.perPage) {
      req.page = 1;
      req.perPage = 20;
    }

    // 取得列表筆數＆門市列表
    const productInfo = await this.pointRepository.getProductInfo(req);
    const { productListCount, productList } = productInfo;
    const productCount = productListCount?.[0]?.productCount;

    const metaData = <MetaDataCommon>{};
    metaData.page = req?.page;
    metaData.perPage = req?.perPage;
    metaData.totalCount = productCount;
    metaData.totalPage = Math.ceil(productCount / req?.perPage);

    const result = <GetProductListResp>{};
    result.metaData = metaData;
    result.productList = productList;

    return result;
  }

  /**
   * 取得最新的編號
   * @returns
   */
  async getPointLatestId() {
    let rewardId;
    const today = moment().tz(process.env.TIME_ZONE).format('YYMMDD');

    const lastId = await this.pointRepository.getPointLatestId(today);

    lastId
      ? (rewardId = `R${today}${(Number(lastId) + 1)
          .toString()
          .padStart(3, '0')}`)
      : (rewardId = `R${today}001`);

    return rewardId;
  }

  /**
   * 新增/編輯活動型積點設定
   * @param req
   * @returns
   */
  async addRewardSetting(
    req: AddRewardSettingtDto
  ): Promise<Record<string, never>> {
    let rewardId;
    req?.rewardId?.length
      ? (rewardId = req?.rewardId)
      : (rewardId = await this.getPointLatestId());

    // 開始時間需早於結束時間
    if (Date.parse(req?.startDate) >= Date.parse(req?.endDate))
      throw new CustomerException(configError._370002, HttpStatus.OK);

    // 指定天數天數必填
    if (req?.activeStatus === ENUM_ACTIVE_STATUS.DAY && !req?.activeDay)
      throw new CustomerException(configError._370003, HttpStatus.OK);

    // utc+0
    const startDate = moment
      .tz(req?.startDate, process.env.DATE_TIME, process.env.TIME_ZONE)
      .utc()
      .format(process.env.DATE_TIME);
    const endDate = moment
      .tz(req?.endDate, process.env.DATE_TIME, process.env.TIME_ZONE)
      .utc()
      .format(process.env.DATE_TIME);

    await this.pointRepository.addRewardSetting(
      rewardId,
      req,
      startDate,
      endDate
    );

    return {};
  }

  /**
   * 活動型積點設定詳細資料
   * @param rewardId 活動編號
   */
  async getRewardSettingInfo(
    rewardId: string
  ): Promise<GetRewardSettingInfoResp> {
    const rewardSettingInfo = await this.pointRepository.getRewardSettingInfo(
      rewardId
    );
    if (!rewardSettingInfo?.length) return <GetRewardSettingInfoResp>{};

    const result = <GetRewardSettingInfoResp>{
      ...rewardSettingInfo?.[0]
    };

    // 尚未開始的活動有可能沒有設定日期，所以積點使用數量直接回傳 0
    if (!result?.startDate || !result?.endDate) {
      result.receivedPoint = 0;
      result.remainPoint = result?.handselPoint;
      return result;
    }

    // 取得已贈送的積點
    const startDate = moment
      .tz(result?.startDate, process.env.TIME_ZONE)
      .format(process.env.DATE_ONLY);
    const endDate = moment
      .tz(result?.endDate, process.env.TIME_ZONE)
      .format(process.env.DATE_ONLY);

    const preName = 'Member_Point_Log_';
    let logTables = getLogTableNameByMonth(preName, startDate, endDate);
    logTables = await this.commonService.getExistedTable(logTables);

    // 取得活動型送出去的點數
    const rewardSendPoint = await this.pointRepository.getRewardSendPoint(
      rewardId,
      logTables
    );
    // 送出去的點數
    const sendPoint =
      Number(
        rewardSendPoint?.find((x) => x.pointType === ENUM_POINT_TYPE_LOG.REWARD)
          ?.totalPoint
      ) ?? 0;
    // 退回的點數
    const returnPoint =
      Number(
        rewardSendPoint?.find(
          (x) => x.pointType === ENUM_POINT_TYPE_LOG.REWARD_RETURN
        )?.totalPoint
      ) ?? 0;

    result.receivedPoint = sendPoint - returnPoint;
    result.remainPoint = result?.handselPoint - sendPoint + returnPoint;

    return result;
  }

  /**
   * 刪除消費型、活動型積點設定
   * @param rewardId 活動編號
   * @param authMemberId 登入者會員編號
   */
  async delPointSending(
    rewardId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    // 取得活動開始日
    const rewardDate = await this.pointRepository.getRewardDate(rewardId);

    const today = moment().utc().valueOf();

    // 只有尚未開始的活動才能刪除
    if (today > moment.utc(rewardDate?.startDate).valueOf())
      throw new CustomerException(configError._370001, HttpStatus.OK);

    await this.pointRepository.delPointSending(rewardId, authMemberId);

    return {};
  }

  /**
   * 積點調整列表
   */
  async getPointAdjustList(): Promise<GetPointAdjustListResp> {
    const pointAdjustList = await this.pointRepository.getPointAdjustList();
    const adjustList: AdjustList[] = pointAdjustList?.map((x) => {
      const today = moment()
        .tz(process.env.TIME_ZONE)
        .format(process.env.DATE_ONLY);

      let adjustPoint, status;
      Date.parse(today) >= Date.parse(x?.adjustDate) && x.isDone
        ? (status = ENUM_REWARD_STATUS.END)
        : (status = ENUM_REWARD_STATUS.NOTYET);

      if (x?.memberType === ENUM_ADJUST_MEMBER_TYPE.ASSIGN) {
        x?.adjustType === ENUM_ADJUST_POINT_TYPE.MINUS
          ? (adjustPoint = `-${x?.adjustPoint}`)
          : (adjustPoint = `${x?.adjustPoint}`);
      }

      delete x.isDone;
      return {
        ...x,
        status,
        memberType: ENUM_ADJUST_MEMBER_TYPE_STR[x?.memberType],
        adjustType: ENUM_ADJUST_POINT_TYPE_STR[x?.adjustType],
        adjustPoint:
          x?.memberType === ENUM_ADJUST_MEMBER_TYPE.BATCH
            ? `依批量匯入調整`
            : Number(adjustPoint)
      };
    });

    const result = <GetPointAdjustListResp>{};
    result.adjustList = adjustList;

    return result;
  }

  /**
   * 複製積點調整
   * @param adjustId 積點調整編號
   * @param authMemberId 登入者會員編號
   * @returns
   */
  async copyPointAdjust(
    adjustId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const adjustDate = await this.pointRepository.getAdjustDate(adjustId);

    // 尚未開始才可以複製
    const today = moment().utc().valueOf();
    if (today >= moment.utc(adjustDate).valueOf())
      throw new CustomerException(configError._370010, HttpStatus.OK);

    const newAdjustId = await this.getAdjustLatestId();
    await this.pointRepository.copyPointAdjust(
      adjustId,
      newAdjustId,
      authMemberId
    );

    return {};
  }

  /**
   * 刪除積點調整
   * @param adjustId 積點調整編號
   * @param authMemberId 登入者會員編號
   * @returns
   */
  async delPointAdjust(
    adjustId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const adjustDate = await this.pointRepository.getAdjustDate(adjustId);

    // 尚未開始才可以刪除
    const today = moment().utc().valueOf();
    if (today >= moment.utc(adjustDate).valueOf())
      throw new CustomerException(configError._370005, HttpStatus.OK);

    await this.pointRepository.delPointAdjust(adjustId, authMemberId);

    return {};
  }

  /**
   * 新增/編輯積點調整
   * @param req
   * @returns
   */
  async addPointAdjust(req: AddPointAdjustDto): Promise<Record<string, never>> {
    // 消費日期只能 <= 當日
    const today = moment()
      .tz(process.env.TIME_ZONE)
      .format(process.env.DATE_ONLY);
    if (req?.consumeDate > today)
      throw new CustomerException(configError._370011, HttpStatus.OK);

    // 選指定發放日的話積點調整執行時間必填
    if (req?.dataType === ENUM_ADJUST_DATA_TYPE.ASSIGN && !req?.adjustDate)
      throw new CustomerException(configError._370006, HttpStatus.OK);

    // 指定會員國碼、電話、積點必填
    if (
      req?.memberType === ENUM_ADJUST_MEMBER_TYPE.ASSIGN &&
      (!req?.mobile || !req?.mobileCountryCode || !req?.point)
    )
      throw new CustomerException(configError._370007, HttpStatus.OK);

    // 批量匯入 URL 必填
    if (req?.memberType === ENUM_ADJUST_MEMBER_TYPE.BATCH && !req?.fileUrl)
      throw new CustomerException(configError._370009, HttpStatus.OK);

    // 選增點時積點效期必填
    if (
      req?.adjustType === ENUM_ADJUST_POINT_TYPE.ADD &&
      !req?.activeStatus &&
      req?.activeStatus !== 0
    )
      throw new CustomerException(configError._370008, HttpStatus.OK);

    // 積點效期選指定效期時天數必填
    if (req?.activeStatus === ENUM_ACTIVE_STATUS.DAY && !req?.activeDay)
      throw new CustomerException(configError._370003, HttpStatus.OK);

    let adjustId;
    req?.adjustId?.length
      ? (adjustId = req?.adjustId)
      : (adjustId = await this.getAdjustLatestId());

    if (req?.memberType === ENUM_ADJUST_MEMBER_TYPE.ASSIGN) {
      // double check member
      await this.commonService.checkMobileIsExisted({
        mobileContryCode: req?.mobileCountryCode,
        mobile: req?.mobile
      });
    }

    let adjustDate;
    if (!req?.adjustDate)
      adjustDate = moment()
        .tz(process.env.TIME_ZONE)
        .add(1, 'd')
        .format(process.env.DATE_ONLY);

    await this.pointRepository.addPointAdjust(adjustId, adjustDate, req);

    return {};
  }

  /**
   * 取得積點調整最新的編號
   * @returns
   */
  async getAdjustLatestId() {
    let adjustId;
    const today = moment().tz(process.env.TIME_ZONE).format('YYMMDD');

    const lastId = await this.pointRepository.getAdjustLatestId(today);

    lastId
      ? (adjustId = `Ad${today}${(Number(lastId) + 1)
          .toString()
          .padStart(3, '0')}`)
      : (adjustId = `Ad${today}001`);

    return adjustId;
  }

  /**
   * 積點調整詳細資訊
   * @param adjustId 積點調整編號
   */
  async getPointAdjustInfo(adjustId: string): Promise<GetPointAdjustInfoResp> {
    const adjustInfo = await this.pointRepository.getPointAdjustInfo(adjustId);
    const today = moment()
      .tz(process.env.TIME_ZONE)
      .format(process.env.DATE_ONLY);
    let status;

    Date.parse(today) >= Date.parse(adjustInfo?.adjustDate) && adjustInfo.isDone
      ? (status = ENUM_REWARD_STATUS.END)
      : (status = ENUM_REWARD_STATUS.NOTYET);

    const result = <GetPointAdjustInfoResp>{};
    result.adjustId = adjustInfo?.adjustId;
    result.adjustName = adjustInfo?.adjustName;
    result.adjustType = adjustInfo?.adjustType ?? null;
    result.consumeDate = adjustInfo?.consumeDate ?? '';
    result.dataType = adjustInfo?.dataType ?? null;
    result.adjustDate = adjustInfo?.adjustDate ?? '';
    result.memberType = adjustInfo?.memberType ?? null;
    result.mobileContryCode = adjustInfo?.mobileContryCode ?? '';
    result.mobile = adjustInfo?.mobile ?? '';
    result.memberId = adjustInfo?.memberId ?? '';
    result.name = adjustInfo?.name ?? '';
    result.brandId = adjustInfo?.brandId ?? '';
    result.storeId = adjustInfo?.storeId ?? '';
    result.fileUrl = adjustInfo?.fileUrl ?? '';
    result.fileName = adjustInfo?.fileName ?? '';
    result.fileDataCount = adjustInfo?.fileDataCount ?? 0;
    result.fileCount = Number(adjustInfo?.fileName?.split('-')?.[1])
      ? Number(adjustInfo?.fileName?.split('-')?.[1])
      : 0;
    result.point = adjustInfo?.point;
    result.activeStatus = adjustInfo?.activeStatus;
    result.activeDay = adjustInfo?.activeDay;
    result.status = status;
    result.remark = adjustInfo?.remark;

    return result;
  }

  /**
   * 下載上傳會員積點範本
   * @param res
   * @returns
   */
  async downloadMemberPointExample(
    res: Response
  ): Promise<DownloadMemberPointExampleResp> {
    const buffer = await this.csvDownloadExample.pointMobileExcelExample();

    const filename = '會員積點調整_匯入範本.csv';
    const mimeType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`
    );

    res.send(buffer);

    const result = <DownloadMemberPointExampleResp>{};
    result.buffer = buffer;

    return result;
  }

  /**
   * 檢查上傳的電話國碼與號碼
   * @param req
   * @returns
   */
  async uploadMemberPoint(
    file: Express.Multer.File
  ): Promise<UploadMemberPointResp> {
    if (!file?.originalname) {
      throw new CustomerException(configError._220007, HttpStatus.OK);
    }

    const extension = file.originalname.split('.').pop();
    if (!CSV_FILE_EXTENSIONS.includes(extension)) {
      throw new CustomerException(configError._220008, HttpStatus.OK);
    }

    const uint8Array = new Uint8Array(file?.buffer);

    const dir = `${__dirname}/csv`;
    const dirUUID = `${__dirname}/csv/memberPoint`;

    const excelFileName = `${ruuidv4()}.csv`;

    // 指定位置
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    if (!fs.existsSync(dirUUID)) fs.mkdirSync(dirUUID);
    fs.writeFileSync(`${dirUUID}/${excelFileName}`, uint8Array, 'utf8');

    const fileContent = fs.readFileSync(`${dirUUID}/${excelFileName}`, 'utf8');
    if (fileContent?.length <= 0) {
      throw new CustomerException(configError._220007, HttpStatus.OK);
    }

    const content = fileContent.split(/[\n]/);

    const errorEmptyCol = [];
    const errorEmptyMember = [];
    const errorRepeatMember = [];
    const errorPoint = [];

    const excelData = [] as ExcelData[];
    let i = 0;
    for (const str of content) {
      i++;

      if (i <= 1) {
        continue;
      }
      const val = str.split(',');

      const target = <ExcelData>{};
      target.mobileCountryCode = val[0];
      target.mobile = val[1];
      target.point = val[2];
      // 欄位皆空值
      if (
        !target.mobileCountryCode?.length &&
        !target.mobile?.length &&
        !target.point?.length
      ) {
        continue;
      }

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

      // 手機國碼為空 或 手機號碼為空 或 調整積點為空
      if (
        !target.mobileCountryCode?.length ||
        !target.mobile?.length ||
        !target.point?.length
      ) {
        errorEmptyCol.push(i);
      }

      if (Number(target.point) < 0) {
        const mobileData = `${target.mobileCountryCode}-${target.mobile}`;
        errorPoint.push(mobileData);
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
      errorRepeatMember?.length ||
      errorPoint?.length
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

      if (errorPoint?.length) {
        errorMsg.push(`${configError._220017.msg}${errorPoint.join('、')}`);
      }

      throw new CustomerException(
        {
          code: configError._220007.code,
          msg: joinErrorMsg(errorMsg)
        },
        HttpStatus.OK
      );
    }

    const excelUrls = await this.commonService.uploadExcel(
      dirUUID,
      excelFileName,
      'excel/memberPoint'
    );

    const result = <UploadMemberPointResp>{};
    result.totalCount = excelData.length;
    result.urls = excelUrls?.urls?.[0];
    result.tempFileName = '檔案名稱連結.csv';

    // 刪除 csv 暫存檔
    fs.rmSync(`${dirUUID}/${excelFileName}`, { recursive: true });

    return result;
  }
}
