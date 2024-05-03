import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import configError from 'src/Config/error.message.config';
import { MetaDataCommon } from 'src/Definition/Dto';
import { CHANNEL } from 'src/Definition/Enum/Channel/channel.enum';
import { COUPON_EXCHANGE_TYPE } from 'src/Definition/Enum/Coupon/coupon.type.enum';
import {
  ENUM_POINT_TYPE_LOG,
  ENUM_POINT_TYPE_LOG_STR
} from 'src/Definition/Enum/Coupon/point.type.log.enum';
import {
  ORDER_MEAL_TYPE,
  ORDER_MEAL_TYPE_STR,
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_CODE,
  TRANSACTION_TYPE_STR
} from 'src/Definition/Enum/Order/order.transaction.type.enum';
import { REWARD_CARD_DETAIL_STATUS } from 'src/Definition/Enum/RewardCard/reward.card.status.enum';
import {
  ENUM_INSERT_EXPORT_EVENT,
  ENUM_INSERT_EXPORT_EVENT_STR
} from 'src/Definition/Enum/insert.export.event.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import { ConvertZip } from 'src/Utils/DataFrame/zip';
import {
  getLogTableMonth,
  getLogTableNameByMonth,
  removeFirstZero
} from 'src/Utils/tools';
import { BrandRepository } from '../Brand/brand.repository';
import { CommonService } from '../Common/common.service';
import { MemberPointLog } from '../Coupon/Interface/get.member.point.interface';
import { MemberRepository } from '../Member/member.repository';
import { MemberShipService } from '../MemberShip/memberShip.service';
import { PaymentRepository } from '../Payment/payment.repository';
import { PermissionRepository } from '../Permission/permission.repository';
import { StoreRepository } from '../Store/store.repository';
import { AddOrderDetailDto } from './Dto/add.order.detail.dto';
import {
  GetMemberOrderDataDto,
  GetMemberOrderDataResp
} from './Dto/get.member.order.data.dto';
import {
  GetMemberOrderLogDto,
  GetMemberOrderLogResp
} from './Dto/get.member.order.log.dto';
import {
  GetOrderDetailDto,
  GetOrderDetailResp,
  ImportOrderInfo,
  OrderDeliveryInfo
} from './Dto/get.order.detail.dto';
import {
  GetOrderDetailByTransactionIdDto,
  GetOrderDetailByTransactionIdResp
} from './Dto/get.order.detail.transaction.dto';
import {
  GetOrderExportListDto,
  GetOrderExportListResp
} from './Dto/get.order.export.list.dto';
import {
  GetOrderLogDto,
  GetOrderLogResp,
  OrderLogList
} from './Dto/get.order.log.dto';
import { GetPointLogDto, GetPointLogResp } from './Dto/get.point.log.dto';
import { GetCouponOrderDetailResp } from './Interface/get.coupon.order.detail.interface';
import { GetPointLogFilterOptionsResp } from './Interface/get.point.log.filter.options.interface';
import { InsOrderDetailReq } from './Interface/ins.order.detail.interface';
import { InsOrderMainReq } from './Interface/ins.order.main.interface';
import { InsReturnOrderDetailReq } from './Interface/ins.return.order.detail.interface';
import { InsTempOrderLogReq } from './Interface/ins.temp.order.log.interface';
import { OrderRepository } from './order.repository';
const fs = require('fs-extra');

import moment = require('moment-timezone');

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private memberRepository: MemberRepository,
    private brandRepository: BrandRepository,
    private storeRepository: StoreRepository,
    private convertExcel: ConvertExcel,
    private paymentRepository: PaymentRepository,
    private permissionRepository: PermissionRepository,
    private memberShipService: MemberShipService,
    private readonly redisService: RedisService,
    private commonService: CommonService,
    private convertZip: ConvertZip,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得交易紀錄
   *
   * @param req
   * @returns
   */
  async getOrderLog(req: GetOrderLogDto): Promise<GetOrderLogResp> {
    // 如果字數超過 2 個字去除第一個 0
    if (req?.search?.length >= 2) {
      req.search = removeFirstZero(req?.search);
    }

    const tempOrderLog = await this.orderRepository.getTempOrderLog(req);
    const tempOrderLogData =
      tempOrderLog?.reduce((acc, orderLog) => {
        if (!acc[`${orderLog.transactionMethod}`]) {
          acc[`${orderLog.transactionMethod}`] = [];
        }

        acc[`${orderLog.transactionMethod}`].push(orderLog.transactionId);
        return acc;
      }, {}) ?? {};

    // 取得 交易紀錄
    const orderList = await this.orderRepository.getOrderLogList(
      tempOrderLogData
    );

    // 取得 交易紀錄總筆數
    const orderListCount = await this.orderRepository.getTempOrderLogCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: orderListCount,
      totalPage: Math.ceil(orderListCount / req?.perPage)
    } as MetaDataCommon;

    const orderReturn = {};
    if (orderList?.length > 0) {
      const orderReturnCount = await this.orderRepository.getOrderReturnCount();

      orderReturnCount?.forEach((order) => {
        orderReturn[order.transactionId] = order.returnCount;
      });
    }

    const orderLogList: OrderLogList[] = [];
    orderList?.forEach((data) => {
      orderLogList.push({
        transactionCode: data.transactionId,
        channelName: data.channelName,
        brandName: data.brandName,
        storeName: data.storeName,
        transactionType: TRANSACTION_TYPE_CODE[data.transactionType] ?? '',
        amount: data.paidAmount,
        mobileCountryCode: data.mobileCountryCode,
        mobile: data.mobile,
        memberCardId: data.memberCardId,
        memberName: data.memberName,
        transactionTime: data.transactionTime,
        invoiceNumber: data.invoiceNumber,
        pointDeduction: data.pointDeduction,
        originalAmount: data.originalAmount,
        paidAmount: data.paidAmount,
        discountAmount: data.discountAmount,
        shippingFee: data.shippingFee,
        isReturn:
          TRANSACTION_TYPE[TRANSACTION_TYPE_STR.RETURN] ==
            data.transactionType || orderReturn[data.transactionId]
            ? false
            : true
      });
    });

    const result = <GetOrderLogResp>{};
    result.metaData = metaData;
    result.orderLogList = orderLogList;

    return result;
  }

  /**
   * 取得會員交易紀錄
   *
   * @param req
   * @returns
   */
  async getMemberOrderLog(
    req: GetMemberOrderLogDto
  ): Promise<GetMemberOrderLogResp> {
    // 取得會員資料
    const memberDetail = await this.memberRepository.getMemberDetailByMemberId(
      req?.memberId
    );
    if (!memberDetail) {
      throw new CustomerException(configError._220005, HttpStatus.OK);
    }

    const tempOrderLog = await this.orderRepository.getMemberTempOrderLog(
      memberDetail?.cardNumber,
      req
    );

    const tempOrderLogData =
      tempOrderLog?.reduce((acc, orderLog) => {
        if (!acc[`${orderLog.transactionMethod}`]) {
          acc[`${orderLog.transactionMethod}`] = [];
        }

        acc[`${orderLog.transactionMethod}`].push(orderLog.transactionId);
        return acc;
      }, {}) ?? {};

    // 取得 交易紀錄
    const memberOrderList = await this.orderRepository.getMemberOrderList(
      tempOrderLogData
    );

    memberOrderList.forEach((order) => {
      order.transactionType =
        TRANSACTION_TYPE_CODE[order.transactionType] ?? '';
    });

    // 取得 交易紀錄總筆數
    const memberOrderListCount =
      await this.orderRepository.getMemberTempOrderLogCount(
        memberDetail?.cardNumber,
        req
      );

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: memberOrderListCount,
      totalPage: Math.ceil(memberOrderListCount / req?.perPage)
    } as MetaDataCommon;

    // 获取今年的开始日期和结束日期
    const thisYearStart = moment().startOf('year');
    const thisYearEnd = moment().endOf('year');

    // 轉換 +8 時區時間
    const convertedThisYearStart = moment
      .tz(thisYearStart, process.env.TIME_ZONE)
      .format('YYYY-MM-DD HH:mm:ss');
    const convertedThisYearEnd = moment
      .tz(thisYearEnd, process.env.TIME_ZONE)
      .format('YYYY-MM-DD HH:mm:ss');

    // 取得 會員消費次數、消費金額
    const saleData = await this.orderRepository.getMemberYearOrderAmount(
      req?.memberId,
      convertedThisYearStart,
      convertedThisYearEnd
    );

    // 取得 會員退款次數、退款金額
    const stopSellData =
      await this.orderRepository.getMemberYearOrderReturnAmount(
        memberDetail?.cardNumber,
        convertedThisYearStart,
        convertedThisYearEnd
      );

    const result = <GetMemberOrderLogResp>{};
    result.payCount = Number(saleData?.orderCount) ?? 0;
    result.payAmount = Number(saleData.orderAmount) ?? 0;
    result.refundCount = Number(stopSellData?.orderCount) ?? 0;
    result.refundAmount = Number(stopSellData?.orderAmount) ?? 0;
    result.metaData = metaData;
    result.orderList = memberOrderList;

    return result;
  }

  /**
   * 取得交易詳細資料
   *
   * @param req
   * @returns
   */
  async getOrderDetail(req: GetOrderDetailDto): Promise<GetOrderDetailResp> {
    const orderDetail = await this.orderRepository.getOrderDetail(
      req?.transactionId
    );
    if (!orderDetail) {
      throw new CustomerException(configError._280002, HttpStatus.OK);
    }

    const productList = await this.orderRepository.getOrderProductList(
      orderDetail?.transactionId,
      orderDetail?.transactionType
    );

    // 取得自取品牌
    const brandDetail = await this.brandRepository.getBrandDetail(
      orderDetail?.pickupBrand
    );

    // 取得自取門市
    const storeDetail = await this.storeRepository.getStoreDetail(
      orderDetail?.pickupStore
    );

    const authMemberDetail = await this.permissionRepository.getMemberDetail(
      orderDetail?.createId
    );

    const result = <GetOrderDetailResp>{};
    result.transactionTime = orderDetail?.transactionTime;
    result.transactionCode = orderDetail?.transactionId;
    result.channelName = orderDetail?.channelName;
    result.brandName = orderDetail?.brandName;
    result.storeName = orderDetail?.storeName;
    result.mobileCountryCode = orderDetail?.mobileCountryCode;
    result.mobile = orderDetail?.mobile;
    result.memberName = orderDetail?.memberName ?? '--';
    result.memberCardId = orderDetail?.memberCardId ?? '--';
    result.transactionType =
      TRANSACTION_TYPE_CODE[orderDetail?.transactionType] ?? '';
    result.paymentMethodName = orderDetail?.paymentName;
    result.invoiceNumber = orderDetail?.invoiceNumber;
    result.pointDeduction = orderDetail?.pointDeduction ?? 0;
    result.originalAmount = orderDetail?.originalAmount;
    result.paidAmount = orderDetail?.paidAmount;
    result.discountAmount = orderDetail?.discountAmount ?? 0;
    result.shippingFee = orderDetail?.shippingFee ?? 0;
    // 訂單商品列表
    result.orderProductList = productList;
    // 訂單宅配資訊
    result.orderDeliveryInfo = <OrderDeliveryInfo>{
      deliveryCity: orderDetail?.deliveryCity ?? '',
      deliveryZip: orderDetail?.deliveryZip ?? '',
      deliveryAddress: orderDetail?.deliveryAddress ?? '',
      pickupBrand: brandDetail?.name ?? '',
      pickupStore: storeDetail?.storeName ?? ''
    };
    // 補登資訊
    result.importOrderInfo = <ImportOrderInfo>{
      memberAccount: authMemberDetail?.account ?? '',
      memberName: authMemberDetail?.name ?? '',
      memberRemark: orderDetail?.remark ?? ''
    };

    return result;
  }

  /**
   * 補登交易資料
   *
   * @param req
   * @returns
   */
  async addOrderDetail(req: AddOrderDetailDto): Promise<Record<string, never>> {
    req.mobile = removeFirstZero(req?.mobile);

    // 檢查手機號碼是否存在
    const memberDetail = await this.memberRepository.getMemberDetailByMobile(
      req?.mobileCountryCode,
      req?.mobile
    );
    if (!memberDetail) {
      throw new CustomerException(configError._220005, HttpStatus.OK);
    }

    // 檢查品牌是否存在
    const brandDetail = await this.brandRepository.getBrandDetail(req?.brandId);
    if (!brandDetail) {
      throw new CustomerException(configError._230001, HttpStatus.OK);
    }

    // 檢查門市是否存在
    const storeDetail = await this.storeRepository.getStoreDetail(req?.storeId);
    if (!storeDetail) {
      throw new CustomerException(configError._240001, HttpStatus.OK);
    }

    // 檢查支付設定是否存在
    const paymentDetail = await this.paymentRepository.getPaymentDetail(
      req?.paymentSeq
    );
    if (!paymentDetail) {
      throw new CustomerException(configError._300005, HttpStatus.OK);
    }

    // 取得銷售資料
    const orderDetail = await this.orderRepository.getOrderDetail(
      req?.transactionCode
    );

    // 根據交易類型，判斷是否檢查交易序號
    switch (req?.transactionType) {
      case TRANSACTION_TYPE_STR.SALE:
        // 檢查 交易序號是否存在，存在錯誤
        if (orderDetail) {
          throw new CustomerException(configError._280003, HttpStatus.OK);
        }

        const orderId = await this.memberShipService.createOrderId(
          moment().tz(process.env.TIME_ZONE).format('YYYYMMDD')
        );

        const insOrderDetail = <InsOrderDetailReq>{
          orderId: orderId,
          mealDate: req?.transactionTime,
          paymentMethod: req?.paymentSeq,
          mealMethod: req?.mealType == ORDER_MEAL_TYPE_STR.DINE_IN ? 1 : 2,
          paidAmount: req?.amount,
          remark: req?.remark
        };

        const insOrderMainReq = <InsOrderMainReq>{
          orderId: orderId,
          channelId: CHANNEL.CRM_BACKEND_CHANNEL_ID,
          transactionId: req?.transactionCode,
          transactionType: Number(TRANSACTION_TYPE[req?.transactionType]),
          transactionTime: req?.transactionTime,
          memberId: memberDetail?.id,
          memberCardId: memberDetail?.cardNumber,
          invoiceNumber: req?.invoiceNumber,
          mobileCountryCode: req?.mobileCountryCode,
          mobile: req?.mobile,
          brandId: req?.brandId,
          storeId: req?.storeId
        };

        const connection = await this.internalConn.getConnection();
        try {
          await connection.beginTransaction();

          // 新增 補登單
          await this.orderRepository.insOrderMain(
            connection,
            insOrderMainReq,
            req?.iam?.authMemberId
          );

          await this.orderRepository.insOrderDetail(
            insOrderDetail,
            req?.iam?.authMemberId
          );

          await connection.commit();
        } catch (error) {
          await connection.rollback();
          throw new CustomerException(configError._290011, HttpStatus.OK);
        } finally {
          await connection.release();
        }

        const insSaleTempOrderLogReq = <InsTempOrderLogReq>{
          transactionId: req?.transactionCode,
          transactionDate: req?.transactionTime,
          transactionMethod: TRANSACTION_TYPE_STR.SALE,
          memberCardId: memberDetail?.cardNumber,
          orderChannelId: CHANNEL.CRM_BACKEND_CHANNEL_ID,
          brandId: req?.brandId,
          mobileCountryCode: req?.mobileCountryCode,
          mobile: req?.mobile
        };
        await this.orderRepository.insTempOrderLog(insSaleTempOrderLogReq);

        break;
      case TRANSACTION_TYPE_STR.RETURN:
        // 檢查 交易序號是否存在，不存在錯誤
        if (!orderDetail) {
          throw new CustomerException(configError._280004, HttpStatus.OK);
        }

        // 檢查 交易時間
        const oldTransactionDate = moment.tz(
          orderDetail?.transactionTime,
          process.env.TIME_ZONE
        );
        const newTransactionDate = moment.tz(
          req?.transactionTime,
          process.env.TIME_ZONE
        );
        if (oldTransactionDate.isAfter(newTransactionDate)) {
          throw new CustomerException(configError._280006, HttpStatus.OK);
        }

        // 檢查訂單金額
        if (req?.amount > orderDetail?.paidAmount) {
          throw new CustomerException(configError._280005, HttpStatus.OK);
        }

        const insReturnOrderDetailReq = <InsReturnOrderDetailReq>{
          channelId: CHANNEL.CRM_BACKEND_CHANNEL_ID,
          transactionId: req?.transactionCode,
          transactionType: Number(TRANSACTION_TYPE[req?.transactionType]),
          transactionTime: req?.transactionTime,
          memberCardId: memberDetail?.cardNumber,
          invoiceNumber: orderDetail?.invoiceNumber,
          mobileCountryCode: orderDetail?.mobileCountryCode,
          mobile: orderDetail?.mobile,
          brandId: orderDetail?.brandId,
          storeId: orderDetail?.storeId,
          paidAmount: req?.amount,
          deliveryCity: orderDetail?.deliveryCity,
          deliveryDistrict: orderDetail?.deliveryZip,
          deliveryAddress: orderDetail?.deliveryAddress,
          remark: orderDetail?.remark
        };
        const insReturnId = await this.orderRepository.insReturnOrderDetail(
          insReturnOrderDetailReq,
          req?.iam?.authMemberId
        );

        const insReturnTempOrderLogReq = <InsTempOrderLogReq>{
          transactionId: insReturnId,
          transactionDate: req?.transactionTime,
          transactionMethod: TRANSACTION_TYPE_STR.RETURN,
          memberCardId: memberDetail?.cardNumber,
          orderChannelId: CHANNEL.CRM_BACKEND_CHANNEL_ID,
          brandId: req?.brandId,
          mobileCountryCode: req?.mobileCountryCode,
          mobile: req?.mobile
        };
        await this.orderRepository.insTempOrderLog(insReturnTempOrderLogReq);

        break;
      default:
        throw new CustomerException(configError._280001, HttpStatus.OK);
    }

    return {};
  }

  /**
   * 依交易編號取得訂單詳情
   *
   * @param req
   * @returns
   */
  async getOrderDetailByTransactionId(
    req: GetOrderDetailByTransactionIdDto
  ): Promise<GetOrderDetailByTransactionIdResp> {
    const orderDetail = await this.orderRepository.getOrderDetail(
      req?.transactionId
    );

    if (!orderDetail) {
      throw new CustomerException(configError._280002, HttpStatus.OK);
    }

    const result = <GetOrderDetailByTransactionIdResp>{};
    result.brandId = orderDetail?.brandId;
    result.mealType = ORDER_MEAL_TYPE[orderDetail?.mealMethod] ?? '';
    result.memberCardId = orderDetail?.memberCardId;
    result.memberName = orderDetail?.memberName;
    result.mobile = orderDetail?.mobile;
    result.mobileCountryCode = orderDetail?.mobileCountryCode;
    result.paymentSeq = orderDetail?.paymentMethod;
    result.storeId = orderDetail?.storeId;
    result.transactionDate = orderDetail?.transactionTime;
    result.amount = orderDetail?.paidAmount;
    result.invoiceNumber = orderDetail?.invoiceNumber;

    return result;
  }

  /**
   * 優惠券商品券退貨
   * @param orderSeq
   * @param authMemberId
   */
  async returnCoupon(
    orderSeq: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const orderDetail = await this.orderRepository.getCouponOrderDetail(
      orderSeq
    );

    // 只有未核銷可以退貨
    if (
      orderDetail?.transactionType.toString() !==
      REWARD_CARD_DETAIL_STATUS.VALID
    )
      throw new CustomerException(configError._280007, HttpStatus.OK);
    // 積點&集點都是0 => 不正常
    if (!orderDetail?.reward && !orderDetail?.point)
      throw new CustomerException(configError._280008, HttpStatus.OK);

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      // 集點 = 0 => 用積點換的 => 退積點
      if (!orderDetail?.reward)
        await this.pointReturn(connection, orderSeq, orderDetail, authMemberId);
      // TODO: 積點 = 0 => 用集點卡換的 => 退集點
      if (!orderDetail?.point) await this.rewardReturn(connection, orderSeq);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._280008, HttpStatus.OK);
    } finally {
      connection.release();
    }

    return {};
  }

  /**
   * 退積點
   * @param connection
   * @param orderSeq
   * @param memberId
   */
  async pointReturn(
    connection,
    orderSeq: number,
    orderDetail: GetCouponOrderDetailResp,
    authMemberId: string
  ): Promise<Record<string, never>> {
    // 會員點數資訊
    const memberPointInfo = await this.orderRepository.getMemberPointInfo(
      connection,
      orderDetail?.memberId,
      orderDetail?.transactionId
    );

    const { memberUsedPoint, memberPoint } = memberPointInfo;

    // 已使用的點數還回去
    memberUsedPoint.forEach((usedPoint) => {
      memberPoint.forEach((point) => {
        if (usedPoint?.expiredDate === point?.expiredDate) {
          point.point += usedPoint?.usedPoint;
        }
      });
    });

    // 把票券明細狀態寫回去：退貨時間、已退貨
    await this.orderRepository.updateOrderDetail(
      connection,
      orderSeq,
      authMemberId
    );

    // 把積點還回去
    const memberPointLog = <MemberPointLog>{};
    memberPointLog.Member_ID = orderDetail?.memberId;
    memberPointLog.Card_ID = orderDetail.cardId;
    memberPointLog.Member_Name = orderDetail.name;
    memberPointLog.Mobile_Country_Code = orderDetail.mobileCountryCode;
    memberPointLog.Mobile = orderDetail.mobile;
    memberPointLog.Point_Type =
      COUPON_EXCHANGE_TYPE.DISCOUNT === orderDetail?.couponType
        ? ENUM_POINT_TYPE_LOG.DISCOUNT_RETURN
        : ENUM_POINT_TYPE_LOG.COMMODITY_RETURN;
    memberPointLog.Point_Type_Str =
      COUPON_EXCHANGE_TYPE.DISCOUNT === orderDetail?.couponType
        ? ENUM_POINT_TYPE_LOG_STR[ENUM_POINT_TYPE_LOG.DISCOUNT_RETURN]
        : ENUM_POINT_TYPE_LOG_STR[ENUM_POINT_TYPE_LOG.COMMODITY_RETURN];
    memberPointLog.Point_Item =
      COUPON_EXCHANGE_TYPE.DISCOUNT === orderDetail?.couponType
        ? ENUM_POINT_TYPE_LOG_STR[ENUM_POINT_TYPE_LOG.DISCOUNT_RETURN]
        : ENUM_POINT_TYPE_LOG_STR[ENUM_POINT_TYPE_LOG.COMMODITY_RETURN];
    memberPointLog.Point = orderDetail?.point;
    memberPointLog.Order_ID = orderDetail?.transactionId;

    const month = Number(moment().tz(process.env.TIME_ZONE).format('MM'));
    const year = moment().tz(process.env.TIME_ZONE).format('YYYY');
    // 點數資訊還回去、寫 log
    await this.orderRepository.updateMemberPoint(
      connection,
      getLogTableMonth(year, month),
      orderDetail,
      memberPoint,
      memberPointLog,
      authMemberId
    );

    return {};
  }

  /**
   * 退集點
   * @param connection
   * @param orderSeq
   */
  async rewardReturn(
    connection,
    orderSeq: number
  ): Promise<Record<string, never>> {
    return {};
  }

  /**
   * 取得積點明細列表
   * @param req
   */
  async getPointLog(req: GetPointLogDto): Promise<GetPointLogResp> {
    // 只要頁數其中一個參數未定義，就使用預設值
    if (!req?.page || !req?.perPage) {
      req.page = 1;
      req.perPage = 20;
    }

    // 取得需要的 table 表格
    const tableNames = await this.getLogTable(req);

    // 取得列表筆數＆積點明細列表
    const logInfo = await this.orderRepository.getPointLogInfo(req, tableNames);
    const { logCount, logList } = logInfo;

    const pointLogCount = logCount?.[0]?.count;

    const metaData = <MetaDataCommon>{};
    metaData.page = req?.page;
    metaData.perPage = req?.perPage;
    metaData.totalCount = pointLogCount;
    metaData.totalPage = Math.ceil(pointLogCount / req?.perPage);

    const result = <GetPointLogResp>{};
    result.metaData = metaData;
    result.logList =
      logList?.map((x) => {
        return {
          ...x,
          point: x?.point?.toLocaleString('en-US') ?? '0',
          orderType: x?.orderType ? x?.orderType : '-',
          expiredDate: x?.expiredDate ? x?.expiredDate : null,
          sendDate: x?.sendDate ? x?.sendDate : null,
          deductDate: x?.deductDate ? x?.deductDate : null,
          brandName: x?.brandName ? x?.brandName : '-',
          storeName: x?.storeName ? x?.storeName : '-'
        };
      }) ?? [];

    return result;
  }

  /**
   * 取得需要的 table 表格
   * @param req
   * @returns
   */
  async getLogTable(req: GetPointLogDto): Promise<string[]> {
    const preName = 'Member_Point_Log_';
    let tableDeductDate = [],
      tableSendDate = [];

    if (req?.sendStartDate && req?.sendEndDate) {
      tableSendDate = getLogTableNameByMonth(
        preName,
        req?.sendStartDate,
        req?.sendEndDate
      );
      tableSendDate = await this.commonService.getExistedTable(tableSendDate);
    }

    if (req?.deductStartDate && req?.deductEndDate) {
      tableDeductDate = getLogTableNameByMonth(
        preName,
        req?.deductStartDate,
        req?.deductEndDate
      );
      tableDeductDate = await this.commonService.getExistedTable(
        tableDeductDate
      );
    }

    let result = [...new Set(tableSendDate?.concat(tableDeductDate))];

    if (!result?.length)
      result = await this.orderRepository.getAllLogTable(preName);

    return result;
  }

  /**
   * 積點明細下拉篩選資料
   */
  async getPointLogFilterOptions(): Promise<GetPointLogFilterOptionsResp> {
    const pointType = Object.keys(ENUM_POINT_TYPE_LOG_STR).map((value) => ({
      value,
      label: ENUM_POINT_TYPE_LOG_STR[value]
    }));

    const brand = (await this.brandRepository.getBrandSettingList())?.map(
      (x) => {
        return {
          value: x?.brandId,
          label: x?.name
        };
      }
    );

    const result = <GetPointLogFilterOptionsResp>{};
    result.pointType = pointType;
    result.brand = brand;

    return result;
  }

  /**
   * 匯出積點明細
   * @param req
   */
  async exportPointLog(res: Response, req: GetPointLogDto) {
    // 單次可下載最多31天的訂單資料
    const sendEndDate = moment(req?.sendStartDate, process.env.DATE_TIME);
    const sendStartDate = moment(req?.sendEndDate, process.env.DATE_TIME);
    const sendDiff = isNaN(sendStartDate.diff(sendEndDate, 'd'))
      ? 0
      : sendStartDate.diff(sendEndDate, 'd');
    const deductEndDate = moment(req?.deductStartDate, process.env.DATE_TIME);
    const deductStartDate = moment(req?.deductEndDate, process.env.DATE_TIME);
    const deductDiff = isNaN(deductStartDate.diff(deductEndDate, 'd') ?? 0)
      ? 0
      : deductStartDate.diff(deductEndDate, 'd');
    if (sendDiff > 31 || deductDiff > 31)
      throw new CustomerException(configError._290009, HttpStatus.OK);

    await this.commonService.insertExportEvent(
      ENUM_INSERT_EXPORT_EVENT.POINT_LOG,
      req?.iam?.authMemberId,
      `【${ENUM_INSERT_EXPORT_EVENT_STR[ENUM_INSERT_EXPORT_EVENT.POINT_LOG]}】`,
      JSON.stringify(req)
    );

    // // excel 主目錄
    // const dir = `${__dirname}/pointLogExcel`;
    // // excel 子目錄
    // const dirUUID = `${__dirname}/pointLogExcel/${ruuidv4()}`;

    // const today = moment().tz(process.env.TIME_ZONE).format('YYYYMMDD');

    // // 初始化分頁
    // req.page = 1;
    // req.perPage = 15000;

    // while (true) {
    //   const pointLogList = (await this.getPointLog(req, true))?.logList;

    //   if (!pointLogList || !pointLogList.length) {
    //     break;
    //   }

    //   const rows = [];
    //   pointLogList.forEach((log) => {
    //     rows.push([
    //       log.pointItem,
    //       log.point,
    //       log.cardId,
    //       log.name,
    //       log.mobileCountryCode,
    //       log.mobile,
    //       log.orderType,
    //       log.orderId,
    //       log.expiredDate,
    //       log.sendDate
    //         ? moment
    //             .tz(log.sendDate, process.env.TIME_ZONE)
    //             .format(process.env.DATE_TIME)
    //         : '-',
    //       log.deductDate
    //         ? moment
    //             .tz(log.deductDate, process.env.TIME_ZONE)
    //             .format(process.env.DATE_TIME)
    //         : '-',
    //       log.brandName,
    //       log.storeName
    //     ]);
    //   });

    //   const excelFileName = `${today}-${req.page}-積點明細.xlsx`;

    //   await this.convertExcel.pointLogToExcel(
    //     rows,
    //     excelFileName,
    //     dir,
    //     dirUUID
    //   );

    //   req.page++;
    // }

    // // 沒有資料不需要下載
    // if (req.page === 1) {
    //   throw new CustomerException(configError._290010, HttpStatus.OK);
    // }

    // // zip 目錄的路徑
    // const zipFolderPath = `${__dirname}/pointLogZip`;
    // // zip 檔案的路径
    // const zipFilePath = `${zipFolderPath}/${ruuidv4()}.zip`;

    // // 檔案壓縮
    // await this.convertZip.filesCompression(zipFolderPath, zipFilePath, dirUUID);

    // const file = fs.createReadStream(zipFilePath);

    // const zipFileName = `${today}-消費紀錄.zip`;

    // res.setHeader('Content-Type', 'application/zip');
    // res.setHeader(
    //   'Content-Disposition',
    //   `attachment; filename=${encodeURIComponent(zipFileName)}`
    // );

    // file.pipe(res);

    // // 監聽事件，已完成後刪除，避免資料過多
    // res.on('finish', () => {
    //   fs.rmSync(zipFolderPath, { recursive: true });
    //   fs.rmSync(dir, { recursive: true });
    // });

    return {};
  }

  /**
   * 取得會員消費資料
   *
   * @param req
   * @returns
   */
  async getMemberOrderData(
    req: GetMemberOrderDataDto
  ): Promise<GetMemberOrderDataResp> {
    const memberOrderData = await this.orderRepository.getMemberOrderData(req);

    const memberOrderDataCount =
      await this.orderRepository.getMemberOrderDataCount(req);

    const totalPage = Math.ceil(memberOrderDataCount / req?.perPage);

    const result = <GetMemberOrderDataResp>{};
    result.next = req?.page < totalPage ? req?.page : null;
    result.memberOrderData = memberOrderData;

    return result;
  }

  /**
   * 取得交易匯出資料列表
   *
   * @param req
   * @returns
   */
  async getOrderExportList(
    req: GetOrderExportListDto
  ): Promise<GetOrderExportListResp> {
    const orderExportList = await this.orderRepository.getOrderExportList(req);

    const orderExportListCount =
      await this.orderRepository.getOrderExportListCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: orderExportListCount,
      totalPage: Math.ceil(orderExportListCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetOrderExportListResp>{};
    result.metaData = metaData;
    result.memberExportList = orderExportList;

    return result;
  }
}
