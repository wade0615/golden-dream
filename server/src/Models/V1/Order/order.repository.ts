import { Injectable } from '@nestjs/common';

import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import { CONSUMER_MEMBER_TYPE } from 'src/Definition/Enum/Member/member.type.enum';
import {
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_STR
} from 'src/Definition/Enum/Order/order.transaction.type.enum';
import { REWARD_CARD_DETAIL_STATUS } from 'src/Definition/Enum/RewardCard/reward.card.status.enum';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { MemberPointLog } from '../Coupon/Interface/get.member.point.interface';
import {
  GetMemberOrderDataDto,
  MemberOrderData
} from './Dto/get.member.order.data.dto';
import {
  GetMemberOrderLogDto,
  MemberOrderList
} from './Dto/get.member.order.log.dto';
import { OrderProductList } from './Dto/get.order.detail.dto';
import {
  GetOrderExportListDto,
  OrderExportList
} from './Dto/get.order.export.list.dto';
import { GetOrderLogDto } from './Dto/get.order.log.dto';
import { GetPointLogDto } from './Dto/get.point.log.dto';
import { GetCouponOrderDetailResp } from './Interface/get.coupon.order.detail.interface';
import { GetMemberOrderBrandResp } from './Interface/get.member.order.brand.interface';
import { GetMemberOrderCommodityResp } from './Interface/get.member.order.commodity.interface';
import {
  GetMemberPointInfoResp,
  MemberPoint
} from './Interface/get.member.point.info.interface';
import { GetMemberYearAmountResp } from './Interface/get.member.year.amount.interface';
import { OrderDetailResp } from './Interface/get.order.detail.interface';
import { GetOrderLogListResp } from './Interface/get.order.log.list.interface';
import { GetOrderReturnCountResp } from './Interface/get.order.return.count.interface';
import { GetPointLogInfoResp } from './Interface/get.point.log.info.interface';
import { GetTempOrderLogResp } from './Interface/get.temp.order.log.interface';
import { InsOrderDetailReq } from './Interface/ins.order.detail.interface';
import { InsOrderMainReq } from './Interface/ins.order.main.interface';
import { InsReturnOrderDetailReq } from './Interface/ins.return.order.detail.interface';
import { InsTempOrderLogReq } from './Interface/ins.temp.order.log.interface';

/**
 *
 * @class
 */
@Injectable()
export class OrderRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得暫存交易紀錄
   *
   * @param req
   * @returns
   */
  async getTempOrderLog(req: GetOrderLogDto): Promise<GetTempOrderLogResp[]> {
    const start = (req?.page - 1) * req?.perPage;
    const limit = req?.perPage;

    let sqlStr = `
    SELECT
      tempOrderLog.Transaction_ID as transactionId,
      tempOrderLog.Transaction_Method as transactionMethod
    FROM
      Temp_Order_Log tempOrderLog
      LEFT JOIN IEat_Member members ON tempOrderLog.Member_Phone_Country_Code = members.Mobile_Country_Code AND tempOrderLog.Member_Phone_Number = members.Mobile AND members.Is_Active = 1
    WHERE 1
    `;
    const params = [];

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MOBILE:
          sqlStr += ` AND members.Mobile = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.MEMBER_CARD:
          sqlStr += ` AND tempOrderLog.Member_CardID = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.TRANSACTION_ID:
          sqlStr += ` AND tempOrderLog.Transaction_ID = ?`;
          params.push(req?.search);
          break;
      }
    }

    if (req?.brandId) {
      sqlStr += ` AND tempOrderLog.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    if (req?.channelId) {
      sqlStr += ` AND tempOrderLog.Order_Channel_ID = ?`;
      params.push(req?.channelId);
    }

    if (req?.transactionType) {
      sqlStr += ` AND tempOrderLog.Transaction_Method = ?`;
      params.push(req?.transactionType);
    }

    if (req?.startDate && req?.endDate) {
      sqlStr += ` AND tempOrderLog.Transaction_Date >= ?`;
      sqlStr += ` AND tempOrderLog.Transaction_Date <= ?`;
      params.push(req?.startDate, req?.endDate);
    }

    switch (req?.memberType) {
      case CONSUMER_MEMBER_TYPE.MEMBER:
        sqlStr += ` AND members.Member_ID IS NOT NULL`;
        break;
      case CONSUMER_MEMBER_TYPE.NON_MEMBER:
        sqlStr += ` AND members.Member_ID IS NULL`;
        break;
    }

    sqlStr += ` ORDER BY tempOrderLog.Transaction_Date DESC`;
    sqlStr += ` LIMIT ?, ?`;
    params.push(start, limit);

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result;
  }

  /**
   * 取得暫存交易紀錄總筆數
   *
   * @param req
   * @returns
   */
  async getTempOrderLogCount(req: GetOrderLogDto): Promise<number> {
    let sqlStr = `
    SELECT
      COUNT(*) as orderLogCount
    FROM
      Temp_Order_Log tempOrderLog
      LEFT JOIN IEat_Member members ON tempOrderLog.Member_Phone_Country_Code = members.Mobile_Country_Code AND tempOrderLog.Member_Phone_Number = members.Mobile AND members.Is_Active = 1
    WHERE 1
    `;
    const params = [];

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MOBILE:
          sqlStr += ` AND members.Mobile = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.MEMBER_CARD:
          sqlStr += ` AND tempOrderLog.Member_CardID = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.TRANSACTION_ID:
          sqlStr += ` AND tempOrderLog.Transaction_ID = ?`;
          params.push(req?.search);
          break;
      }
    }

    if (req?.brandId) {
      sqlStr += ` AND tempOrderLog.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    if (req?.channelId) {
      sqlStr += ` AND tempOrderLog.Order_Channel_ID = ?`;
      params.push(req?.channelId);
    }

    if (req?.transactionType) {
      sqlStr += ` AND tempOrderLog.Transaction_Method = ?`;
      params.push(req?.transactionType);
    }

    if (req?.startDate && req?.endDate) {
      sqlStr += ` AND tempOrderLog.Transaction_Date >= ?`;
      sqlStr += ` AND tempOrderLog.Transaction_Date <= ?`;
      params.push(req?.startDate, req?.endDate);
    }

    switch (req?.memberType) {
      case CONSUMER_MEMBER_TYPE.MEMBER:
        sqlStr += ` AND members.Member_ID IS NOT NULL`;
        break;
      case CONSUMER_MEMBER_TYPE.NON_MEMBER:
        sqlStr += ` AND members.Member_ID IS NULL`;
        break;
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.orderLogCount;
  }

  /**
   * 取得會員暫存交易紀錄
   *
   * @param req
   * @returns
   */
  async getMemberTempOrderLog(
    memberCardId: string,
    req: GetMemberOrderLogDto
  ): Promise<GetTempOrderLogResp[]> {
    const start = (req?.page - 1) * req?.perPage;
    const limit = req?.perPage;

    let sqlStr = `
    SELECT
      tempOrderLog.Transaction_ID as transactionId,
      tempOrderLog.Transaction_Method as transactionMethod
    FROM
      Temp_Order_Log tempOrderLog
    WHERE tempOrderLog.Member_CardID = ?
    `;

    const params = [];
    params.push(memberCardId);

    if (req?.brandId) {
      sqlStr += ` AND tempOrderLog.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    if (req?.channelId) {
      sqlStr += ` AND tempOrderLog.Order_Channel_ID = ?`;
      params.push(req?.channelId);
    }

    if (req?.transactionType) {
      sqlStr += ` AND tempOrderLog.Transaction_Method = ?`;
      params.push(req?.transactionType);
    }

    if (req?.startDate && req?.endDate) {
      sqlStr += ` AND tempOrderLog.Transaction_Date >= ?`;
      sqlStr += ` AND tempOrderLog.Transaction_Date <= ?`;
      params.push(req?.startDate, req?.endDate);
    }

    sqlStr += ` ORDER BY tempOrderLog.Transaction_Date DESC`;
    sqlStr += ` LIMIT ?, ?`;
    params.push(start, limit);

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 取得會員暫存交易紀錄總筆數
   *
   * @param req
   * @returns
   */
  async getMemberTempOrderLogCount(
    memberCardId: string,
    req: GetMemberOrderLogDto
  ): Promise<number> {
    let sqlStr = `
    SELECT
      COUNT(*) as orderLogCount
    FROM
      Temp_Order_Log tempOrderLog
    WHERE tempOrderLog.Member_CardID = ?
    `;

    const params = [];
    params.push(memberCardId);

    if (req?.brandId) {
      sqlStr += ` AND tempOrderLog.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    if (req?.channelId) {
      sqlStr += ` AND tempOrderLog.Order_Channel_ID = ?`;
      params.push(req?.channelId);
    }

    if (req?.transactionType) {
      sqlStr += ` AND tempOrderLog.Transaction_Method = ?`;
      params.push(req?.transactionType);
    }

    if (req?.startDate && req?.endDate) {
      sqlStr += ` AND tempOrderLog.Transaction_Date >= ?`;
      sqlStr += ` AND tempOrderLog.Transaction_Date <= ?`;
      params.push(req?.startDate, req?.endDate);
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.orderLogCount;
  }

  /**
   * 取得消費紀錄列表
   *
   * @param req
   * @returns
   */
  async getOrderLogList(req: any): Promise<GetOrderLogListResp[]> {
    const _saleIds = this.internalConn.escape(req[TRANSACTION_TYPE_STR.SALE]);
    const _returnIds = this.internalConn.escape(
      req[TRANSACTION_TYPE_STR.RETURN]
    );

    let subSqlStr = [];
    if (req[TRANSACTION_TYPE_STR.SALE]?.length > 0) {
      subSqlStr.push(`
      SELECT
        members.Member_ID as memberId,
        orderMain.Transaction_ID as transactionId,
        c.Channel_ID as channelId,
        c.Channel_Name as channelName,
        brand.Brand_ID as brandId,
        brand.Brand_Name as brandName,
        store.Store_Name as storeName,
        orderMain.Transaction_Type as transactionType,
        orderDetail.Paid_Amount as paidAmount,
        orderMain.Member_CardID as memberCardId,
        members.Member_Name as memberName,
        orderMain.Member_Phone_Country_Code as mobileCountryCode,
        orderMain.Member_Phone_Number as mobile,
        orderMain.Transaction_Date as transactionTime,
        orderMain.Invoice_Number as invoiceNumber,
        orderDetail.Point_Deduction as pointDeduction,
        orderDetail.Original_Amount as originalAmount,
        orderDetail.Discount_Amount as discountAmount,
        orderDetail.Shipping_Fee as shippingFee
      FROM
        Order_Main orderMain
        JOIN Order_Detail orderDetail ON orderMain.Order_ID = orderDetail.Order_ID AND orderDetail.Is_Active = 1
        LEFT JOIN IEat_Member members ON orderMain.Member_Phone_Country_Code = members.Mobile_Country_Code AND orderMain.Member_Phone_Number = members.Mobile AND members.Is_Active = 1
        LEFT JOIN Brand brand ON orderMain.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
        LEFT JOIN Store store ON orderMain.Store_ID = store.Store_ID AND store.Is_Active = 1
        LEFT JOIN Channel c ON orderMain.Order_Channel_ID =  c.Channel_ID AND c.Is_Active = 1
      WHERE orderMain.Is_Active = 1
        AND orderMain.Transaction_ID IN (${_saleIds})
      `);
    }

    if (req[TRANSACTION_TYPE_STR.RETURN]?.length) {
      subSqlStr.push(`
      SELECT
        members.Member_ID as memberId,
        returnMain.Transaction_ID as transactionId,
        c.Channel_ID as channelId,
        c.Channel_Name as channelName,
        brand.Brand_ID as brandId,
        brand.Brand_Name as brandName,
        store.Store_Name as storeName,
        returnMain.Transaction_Type as transactionType,
        returnMain.Paid_Amount as paidAmount,
        returnMain.Member_CardID as memberCardId,
        members.Member_Name as memberName,
        returnMain.Member_Phone_Country_Code as mobileCountryCode,
        returnMain.Member_Phone_Number as mobile,
        returnMain.Transaction_Date as transactionTime,
        returnMain.Invoice_Number as invoiceNumber,
        returnMain.Point_Deduction as pointDeduction,
        returnMain.Original_Amount as originalAmount,
        returnMain.Discount_Amount as discountAmount,
        returnMain.Shipping_Fee as shippingFee
      FROM
        Return_Main returnMain
        LEFT JOIN IEat_Member members ON returnMain.Member_Phone_Country_Code = members.Mobile_Country_Code AND returnMain.Member_Phone_Number = members.Mobile AND members.Is_Active = 1
        LEFT JOIN Brand brand ON returnMain.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
        LEFT JOIN Store store ON returnMain.Store_ID = store.Store_ID AND store.Is_Active = 1
        LEFT JOIN Channel c ON returnMain.Order_Channel_ID =  c.Channel_ID AND c.Is_Active = 1
      WHERE returnMain.Is_Active = 1
        AND returnMain.ID IN (${_returnIds})
      `);
    }

    if (subSqlStr?.length == 0) {
      return [] as GetOrderLogListResp[];
    }

    let sqlStr = `
    SELECT
      memberId,
      transactionId,
      channelId,
      channelName,
      brandId,
      brandName,
      storeName,
      transactionType,
      paidAmount,
      memberCardId,
      memberName,
      mobileCountryCode,
      mobile,
      transactionTime,
      invoiceNumber,
      pointDeduction,
      originalAmount,
      discountAmount,
      shippingFee
    FROM (${subSqlStr.join(' UNION ALL ')}) combinedLog
    WHERE 1
    ORDER BY combinedLog.transactionTime DESC
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得會員訂單列表
   *
   * @param mobileCountryCode
   * @param mobile
   * @returns
   */
  async getMemberOrderList(req: any): Promise<MemberOrderList[]> {
    const _saleIds = this.internalConn.escape(req[TRANSACTION_TYPE_STR.SALE]);
    const _returnIds = this.internalConn.escape(
      req[TRANSACTION_TYPE_STR.RETURN]
    );

    let subSqlStr = [];
    if (req[TRANSACTION_TYPE_STR.SALE]?.length > 0) {
      subSqlStr.push(`
        SELECT
          members.Member_ID as memberId,
          orderMain.Transaction_ID as transactionId,
          c.Channel_ID as channelId,
          c.Channel_Name as channelName,
          brand.Brand_ID as brandId,
          brand.Brand_Name as brandName,
          store.Store_Name as storeName,
          orderMain.Transaction_Type as transactionType,
          orderDetail.Paid_Amount as paidAmount,
          orderMain.Member_CardID as memberCardId,
          members.Member_Name as memberName,
          orderMain.Member_Phone_Country_Code as mobileCountryCode,
          orderMain.Member_Phone_Number as mobile,
          orderMain.Transaction_Date as transactionTime,
          orderMain.Invoice_Number as invoiceNumber,
          orderDetail.Point_Deduction as pointDeduction,
          orderDetail.Original_Amount as originalAmount,
          orderDetail.Discount_Amount as discountAmount,
          orderDetail.Shipping_Fee as shippingFee
        FROM
          Order_Main orderMain
          JOIN Order_Detail orderDetail ON orderMain.Order_ID = orderDetail.Order_ID AND orderDetail.Is_Active = 1
          LEFT JOIN IEat_Member members ON orderMain.Member_Phone_Country_Code = members.Mobile_Country_Code AND orderMain.Member_Phone_Number = members.Mobile AND members.Is_Active = 1
          LEFT JOIN Brand brand ON orderMain.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
          LEFT JOIN Store store ON orderMain.Store_ID = store.Store_ID AND store.Is_Active = 1
          LEFT JOIN Channel c ON orderMain.Order_Channel_ID =  c.Channel_ID AND c.Is_Active = 1
        WHERE orderMain.Is_Active = 1
          AND orderMain.Transaction_ID IN (${_saleIds})
      `);
    }

    if (req[TRANSACTION_TYPE_STR.RETURN]?.length) {
      subSqlStr.push(`
        SELECT
          members.Member_ID as memberId,
          returnMain.Transaction_ID as transactionId,
          c.Channel_ID as channelId,
          c.Channel_Name as channelName,
          brand.Brand_ID as brandId,
          brand.Brand_Name as brandName,
          store.Store_Name as storeName,
          returnMain.Transaction_Type as transactionType,
          returnMain.Paid_Amount as paidAmount,
          returnMain.Member_CardID as memberCardId,
          members.Member_Name as memberName,
          returnMain.Member_Phone_Country_Code as mobileCountryCode,
          returnMain.Member_Phone_Number as mobile,
          returnMain.Transaction_Date as transactionTime,
          returnMain.Invoice_Number as invoiceNumber,
          returnMain.Point_Deduction as pointDeduction,
          returnMain.Original_Amount as originalAmount,
          returnMain.Discount_Amount as discountAmount,
          returnMain.Shipping_Fee as shippingFee
        FROM
          Return_Main returnMain
          LEFT JOIN IEat_Member members ON returnMain.Member_Phone_Country_Code = members.Mobile_Country_Code AND returnMain.Member_Phone_Number = members.Mobile AND members.Is_Active = 1
          LEFT JOIN Brand brand ON returnMain.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
          LEFT JOIN Store store ON returnMain.Store_ID = store.Store_ID AND store.Is_Active = 1
          LEFT JOIN Channel c ON returnMain.Order_Channel_ID =  c.Channel_ID AND c.Is_Active = 1
        WHERE returnMain.Is_Active = 1
          AND returnMain.ID IN (${_returnIds})
      `);
    }

    if (subSqlStr?.length == 0) {
      return [] as MemberOrderList[];
    }

    let sqlStr = `
    SELECT
      memberId,
      transactionId,
      channelName,
      brandName,
      storeName,
      transactionType,
      paidAmount,
      memberCardId,
      memberName,
      mobileCountryCode,
      mobile,
      transactionTime,
      invoiceNumber,
      pointDeduction,
      originalAmount,
      discountAmount,
      shippingFee
    FROM (${subSqlStr.join(' UNION ALL ')}) combinedLog
    WHERE 1
    ORDER BY combinedLog.transactionTime DESC
    `;

    const result = (await this.internalConn.query(sqlStr)) ?? [];

    return result;
  }

  /**
   * 取得會員訂單列表總筆數
   *
   * @param mobileCountryCode
   * @param mobile
   * @param req
   * @returns
   */
  async getMemberOrderListCount(
    memberId: string,
    req: GetMemberOrderLogDto
  ): Promise<number> {
    let sqlStr = `
    SELECT
      COUNT(*) as memberOrderCount
    FROM (
      SELECT
        members.Member_ID as memberId,
        orderMain.Transaction_ID as transactionId,
        c.Channel_ID as channelId,
        c.Channel_Name as channelName,
        brand.Brand_ID as brandId,
        brand.Brand_Name as brandName,
        store.Store_Name as storeName,
        orderMain.Transaction_Type as transactionType,
        orderDetail.Paid_Amount as paidAmount,
        orderMain.Member_CardID as memberCardId,
        members.Member_Name as memberName,
        orderMain.Member_Phone_Country_Code as mobileCountryCode,
        orderMain.Member_Phone_Number as mobile,
        orderMain.Transaction_Date as transactionTime,
        orderMain.Invoice_Number as invoiceNumber,
        orderDetail.Point_Deduction as pointDeduction,
        orderDetail.Original_Amount as originalAmount,
        orderDetail.Discount_Amount as discountAmount,
        orderDetail.Shipping_Fee as shippingFee
      FROM
        Order_Main orderMain
        JOIN Order_Detail orderDetail ON orderMain.Order_ID = orderDetail.Order_ID AND orderDetail.Is_Active = 1
        LEFT JOIN IEat_Member members ON orderMain.Member_Phone_Country_Code = members.Mobile_Country_Code AND orderMain.Member_Phone_Number = members.Mobile AND members.Is_Active = 1
        LEFT JOIN Brand brand ON orderMain.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
        LEFT JOIN Store store ON orderMain.Store_ID = store.Store_ID AND store.Is_Active = 1
        LEFT JOIN Channel c ON orderMain.Order_Channel_ID =  c.Channel_ID AND c.Is_Active = 1
      WHERE orderMain.Is_Active = 1
      UNION ALL
      SELECT
        members.Member_ID as memberId,
        returnMain.Transaction_ID as transactionId,
        c.Channel_ID as channelId,
        c.Channel_Name as channelName,
        brand.Brand_ID as brandId,
        brand.Brand_Name as brandName,
        store.Store_Name as storeName,
        returnMain.Transaction_Type as transactionType,
        returnMain.Paid_Amount as paidAmount,
        returnMain.Member_CardID as memberCardId,
        members.Member_Name as memberName,
        returnMain.Member_Phone_Country_Code as mobileCountryCode,
        returnMain.Member_Phone_Number as mobile,
        returnMain.Transaction_Date as transactionTime,
        returnMain.Invoice_Number as invoiceNumber,
        returnMain.Point_Deduction as pointDeduction,
        returnMain.Original_Amount as originalAmount,
        returnMain.Discount_Amount as discountAmount,
        returnMain.Shipping_Fee as shippingFee
      FROM
        Return_Main returnMain
        LEFT JOIN IEat_Member members ON returnMain.Member_Phone_Country_Code = members.Mobile_Country_Code AND returnMain.Member_Phone_Number = members.Mobile AND members.Is_Active = 1
        LEFT JOIN Brand brand ON returnMain.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
        LEFT JOIN Store store ON returnMain.Store_ID = store.Store_ID AND store.Is_Active = 1
        LEFT JOIN Channel c ON returnMain.Order_Channel_ID =  c.Channel_ID AND c.Is_Active = 1
      WHERE returnMain.Is_Active = 1
    ) combinedLog
    WHERE combinedLog.memberId = ?
    `;

    const params = [];
    params.push(memberId);

    if (req?.brandId) {
      sqlStr += ` AND combinedLog.brandId = ?`;
      params.push(req?.brandId);
    }

    if (req?.channelId) {
      sqlStr += ` AND combinedLog.channelId = ?`;
      params.push(req?.channelId);
    }

    if (req?.transactionType) {
      sqlStr += ` AND combinedLog.transactionType = ?`;
      params.push(TRANSACTION_TYPE[req?.transactionType] ?? '');
    }

    if (req?.startDate && req?.endDate) {
      sqlStr += ` AND combinedLog.transactionTime >= ? && combinedLog.transactionTime <= ?`;
      params.push(req?.startDate, req?.endDate);
    }

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result?.[0]?.memberOrderCount;
  }

  /**
   * 取讀會員銷售年度總金額總筆數
   *
   * @param memberId
   * @param yearStart
   * @param yearEnd
   * @returns
   */
  async getMemberYearOrderAmount(
    memberId: string,
    yearStart: string,
    yearEnd: string
  ): Promise<GetMemberYearAmountResp> {
    const sqlStr = `
    SELECT
      COUNT(*) as orderCount,
      SUM(orderDetail.Paid_Amount) as orderAmount
    FROM
      Order_Main orderMain
      JOIN Order_Detail orderDetail ON orderMain.Order_ID = orderDetail.Order_ID AND orderDetail.Is_Active = 1
    WHERE orderMain.Is_Active = 1
      AND orderMain.Member_ID = ?
      AND orderMain.Transaction_Type = ?
      AND orderMain.Transaction_Date >= ?
      AND orderMain.Transaction_Date <= ?
    `;

    const params = [
      memberId,
      TRANSACTION_TYPE[TRANSACTION_TYPE_STR.SALE],
      yearStart,
      yearEnd
    ];

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0];
  }

  /**
   * 取讀會員退貨年度總金額總筆數
   *
   * @param memberId
   * @param yearStart
   * @param yearEnd
   * @returns
   */
  async getMemberYearOrderReturnAmount(
    memberCardId: string,
    yearStart: string,
    yearEnd: string
  ): Promise<GetMemberYearAmountResp> {
    const sqlStr = `
    SELECT
      COUNT(*) as orderCount,
      SUM(returnMain.Paid_Amount) as orderAmount
    FROM
      Return_Main returnMain
    WHERE returnMain.Is_Active = 1
      AND returnMain.Member_CardID = ?
      AND returnMain.Transaction_Type = ?
      AND returnMain.Transaction_Date >= ?
      AND returnMain.Transaction_Date <= ?
    `;

    const params = [
      memberCardId,
      TRANSACTION_TYPE[TRANSACTION_TYPE_STR.RETURN],
      yearStart,
      yearEnd
    ];

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0];
  }

  /**
   * 取得訂單詳細資料
   *
   * @param transactionId
   * @returns
   */
  async getOrderDetail(transactionId: string): Promise<OrderDetailResp> {
    const sqlStr = `
    SELECT
        orderMain.Transaction_ID as transactionId,
        orderMain.Transaction_Type as transactionType,
        orderMain.Transaction_Date as transactionTime,
        c.Channel_Name as channelName,
        brand.Brand_ID as brandId,
        brand.Brand_Name as brandName,
        store.Store_ID as storeId,
        store.Store_Name as storeName,
        orderMain.Member_Phone_Country_Code as mobileCountryCode,
        orderMain.Member_Phone_Number as mobile,
        orderMain.Member_CardID as memberCardId,
        members.Member_Name as memberName,
        orderDetail.Payment_Method as paymentMethod,
        orderMain.Invoice_Number as invoiceNumber,
        orderDetail.Meal_Method as mealMethod,
        orderDetail.Point_Deduction as pointDeduction,
        orderDetail.Original_Amount as originalAmount,
        orderDetail.Paid_Amount as paidAmount,
        orderDetail.Discount_Amount as discountAmount,
        orderDetail.Shipping_Fee as shippingFee,
        orderDetail.Create_ID as createId,
        orderDetail.Delivery_City as deliveryCity,
        orderDetail.Delivery_District as deliveryZip,
        orderDetail.Delivery_Address as deliveryAddress,
        orderDetail.Pickup_Store_Brand as pickupBrand,
        orderDetail.Pickup_Store as pickupStore,
        orderDetail.Remark as remark,
        ps.Payment_Name as paymentName
      FROM
        Order_Main orderMain
        JOIN Order_Detail orderDetail ON orderMain.Order_ID = orderDetail.Order_ID AND orderDetail.Is_Active = 1
        LEFT JOIN IEat_Member members ON orderMain.Member_Phone_Country_Code = members.Mobile_Country_Code AND orderMain.Member_Phone_Number = members.Mobile AND members.Is_Active = 1
        LEFT JOIN Brand brand ON orderMain.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
        LEFT JOIN Store store ON orderMain.Store_ID = store.Store_ID AND store.Is_Active = 1
        LEFT JOIN Channel c ON orderMain.Order_Channel_ID =  c.Channel_ID AND c.Is_Active = 1
        LEFT JOIN Payment_Setting ps ON orderDetail.Payment_Method = ps.ID AND ps.Is_Active = 1
      WHERE orderMain.Is_Active = 1
        AND orderMain.Transaction_ID = ?
    `;

    const result =
      (await this.internalConn.query(sqlStr, [transactionId])) ?? [];

    return result?.[0];
  }

  /**
   * 取得訂單商品列表
   *
   * @param transactionId
   * @param transactionType
   * @returns
   */
  async getOrderProductList(
    transactionId: string,
    transactionType: string
  ): Promise<OrderProductList[]> {
    const sqlStr = `
    SELECT
      Product_ID as productId,
      Product_Name as productName,
      Product_Count as productCount
    FROM
      Order_Detail_Product
    WHERE Is_Active = 1
      AND Transaction_ID = ?
      AND Transaction_Type = ?
    `;

    const params = [transactionId, transactionType];

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result;
  }

  /**
   * 補登訂單記錄
   *
   * @param req
   * @param memberId
   * @returns
   */
  async insOrderDetail(
    req: InsOrderDetailReq,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const addData = {
      Order_ID: req?.orderId,
      Meal_Date: req?.mealDate,
      Meal_Method: req?.mealMethod,
      Payment_Method: req?.paymentMethod,
      Point_Deduction: 0,
      Original_Amount: req?.paidAmount,
      Paid_Amount: req?.paidAmount,
      Discount_Amount: 0,
      Shipping_Fee: 0,
      Remark: req?.remark,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `INSERT INTO Order_Detail SET ?`;

    await this.internalConn.query(sqlStr, [addData]);

    return {};
  }

  /**
   * 新增暫存消費紀錄
   *
   * @param req
   * @returns
   */
  async insTempOrderLog(
    req: InsTempOrderLogReq
  ): Promise<Record<string, never>> {
    const addData = {
      Transaction_ID: req?.transactionId,
      Transaction_Date: req?.transactionDate,
      Transaction_Method: req?.transactionMethod,
      Member_CardID: req?.memberCardId,
      Order_Channel_ID: req?.orderChannelId,
      Brand_ID: req?.brandId,
      Member_Phone_Country_Code: req?.mobileCountryCode,
      Member_Phone_Number: req?.mobile
    };

    const sqlStr = `
    INSERT INTO Temp_Order_Log SET ?
    `;

    await this.internalConn.query(sqlStr, [addData]);

    return {};
  }

  /**
   * 補登訂單主表
   *
   * @param connection
   * @param req
   * @param authMemberId
   * @returns
   */
  async insOrderMain(
    connection,
    req: InsOrderMainReq,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const addData = {
      Order_ID: req?.orderId,
      Order_Channel_ID: req?.channelId,
      Transaction_ID: req?.transactionId,
      Transaction_Type: req?.transactionType,
      Transaction_Date: req?.transactionTime,
      Completion_Date: req?.transactionTime,
      Member_ID: req?.memberId,
      Member_CardID: req?.memberCardId,
      Invoice_Number: req?.invoiceNumber,
      Member_Phone_Country_Code: req?.mobileCountryCode,
      Member_Phone_Number: req?.mobile,
      Brand_ID: req?.brandId,
      Store_ID: req?.storeId,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `INSERT INTO Order_Main SET ?`;

    await this.internalConn.transactionQuery(connection, sqlStr, [addData]);

    return {};
  }

  /**
   * 補登退貨訂單主表
   *
   * @param req
   * @param authMemberId
   * @returns
   */
  async insReturnOrderDetail(
    req: InsReturnOrderDetailReq,
    authMemberId: string
  ): Promise<Number> {
    const addData = {
      Order_Channel_ID: req?.channelId,
      Transaction_ID: req?.transactionId,
      Transaction_Type: req?.transactionType,
      Transaction_Date: req?.transactionTime,
      Completion_Date: req?.transactionTime,
      Member_CardID: req?.memberCardId,
      Invoice_Number: req?.invoiceNumber,
      Member_Phone_Country_Code: req?.mobileCountryCode,
      Member_Phone_Number: req?.mobile,
      Brand_ID: req?.brandId,
      Store_ID: req?.storeId,
      Point_Deduction: 0,
      Original_Amount: req?.paidAmount,
      Paid_Amount: req?.paidAmount,
      Discount_Amount: 0,
      Shipping_Fee: 0,
      Delivery_City: req?.deliveryCity,
      Delivery_District: req?.deliveryDistrict,
      Delivery_Address: req?.deliveryAddress,
      Remark: req?.remark,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `INSERT INTO Return_Main SET ?`;

    const result = await this.internalConn.query(sqlStr, [addData]);

    return result?.insertId;
  }

  /**
   * 取得兌換券明細
   * @param orderSeq
   */
  async getCouponOrderDetail(
    orderSeq: number
  ): Promise<GetCouponOrderDetailResp> {
    const queryStr = /* sql */ `
SELECT  cd.Transaction_Type transactionType,
        cd.Transaction_ID transactionId,
        cd.Exchange_Point point,
        cd.Exchange_Reward reward,
        cd.Exchange_Member_ID memberId,
        c.Coupon_Type couponType,
        im.Member_CardID cardId,
        im.Member_Name name,
        im.Mobile_Country_Code mobileCountryCode,
        im.Mobile mobile
FROM Coupon_Detail cd
INNER JOIN Coupon c ON c.Coupon_ID = cd.Coupon_ID
INNER JOIN IEat_Member im ON im.Member_ID = cd.Exchange_Member_ID
WHERE ID = ? `;

    const result = await this.internalConn.query(queryStr, [orderSeq]);

    return result?.[0];
  }

  /**
   * 取得會員點數/已使用資訊
   * @param connection
   * @param memberId
   * @param transactionId
   * @returns
   */
  async getMemberPointInfo(
    connection,
    memberId: string,
    transactionId: string
  ): Promise<GetMemberPointInfoResp> {
    const queryStr = /* sql */ `
SELECT Used_Point usedPoint, DATE_FORMAT(Expired_Date, '%Y-%m-%d %H:%i:%s') expiredDate
FROM Member_Point_Used
WHERE Member_ID = ? AND Exchange_ID = ? AND Is_Active = 1;

SELECT Point point, DATE_FORMAT(Expired_Date, '%Y-%m-%d %H:%i:%s') expiredDate
FROM Member_Point
WHERE Member_ID = ?`;

    const result = await this.internalConn.transactionQuery(
      connection,
      queryStr,
      [memberId, transactionId, memberId]
    );

    const [memberUsedPoint, memberPoint] = result;

    return { memberUsedPoint, memberPoint };
  }

  /**
   * 把退券明細改為已退貨
   * @param connection
   * @param orderSeq
   * @param authMemberId
   * @returns
   */
  async updateOrderDetail(
    connection,
    orderSeq: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const queryStr = /* sql */ `
UPDATE Coupon_Detail
SET Transaction_Type = ?, Return_Date = CURRENT_TIMESTAMP, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ?
WHERE ID = ?;
`;

    await this.internalConn.transactionQuery(connection, queryStr, [
      REWARD_CARD_DETAIL_STATUS.RETURNED,
      authMemberId,
      orderSeq
    ]);

    return {};
  }

  /**
   * 把積點還回去&記錄歷程
   * @param connection
   * @param yearAndMonth
   * @param orderDetail
   * @param memberPoint
   * @param memberPointLog
   * @param authMemberId
   * @returns
   */
  async updateMemberPoint(
    connection,
    yearAndMonth: string,
    orderDetail: GetCouponOrderDetailResp,
    memberPoint: MemberPoint[],
    memberPointLog: MemberPointLog,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _yearAndMonth = this.internalConn.escape(yearAndMonth);
    const _memberId = this.internalConn.escape(orderDetail?.memberId);
    const _transactionId = this.internalConn.escape(orderDetail?.transactionId);
    const _authMemberId = this.internalConn.escape(authMemberId);

    let sqlStr = '';

    memberPoint.forEach((x) => {
      const _point = this.internalConn.escape(x?.point);
      const _expiredDate = this.internalConn.escape(x?.expiredDate);
      sqlStr += /* sql */ `
-- 可使用點數
UPDATE Member_Point
SET Point = ${_point}, Alter_ID = ${_authMemberId}, Alter_Date = CURRENT_TIMESTAMP
WHERE Member_ID = ${_memberId} AND Expired_Date = ${_expiredDate};`;
    });

    sqlStr += /* sql */ `
-- 取消已使用點數
UPDATE Member_Point_Used
SET Is_Active = 0, Alter_ID = ${_authMemberId}, Alter_Date = CURRENT_TIMESTAMP
WHERE  Member_ID = ${_memberId} AND Exchange_ID = ${_transactionId};

-- 檢核 table，不存在新增
CALL CheckMemberPointLogTable(${_yearAndMonth});

-- 積點歷程 log
INSERT INTO Member_Point_Log_${yearAndMonth} SET ? ,Send_Date = CURRENT_TIMESTAMP`;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      memberPointLog
    ]);

    return {};
  }

  /**
   * 取得所有年份月份log表
   * @param preName table 前綴
   * @returns
   */
  async getAllLogTable(preName: string): Promise<string[]> {
    const queryStr = /* sql */ `
SELECT TABLE_NAME tableName
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'iEat_CRM' AND TABLE_NAME LIKE ?`;

    const result =
      (await this.internalConn.query(queryStr, [`${preName}%`]))?.map(
        (x) => x?.tableName
      ) ?? [];

    return result;
  }

  /**
   * 取得列表筆數＆積點明細列表
   * @param req
   */
  async getPointLogInfo(
    req: GetPointLogDto,
    tableNames: string[]
  ): Promise<GetPointLogInfoResp> {
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);
    const _sendStartDate = this.internalConn.escape(req?.sendStartDate);
    const _sendEndDate = this.internalConn.escape(req?.sendEndDate);
    const _search = this.internalConn.escape(req?.search);
    const _pointType = this.internalConn.escape(req?.pointType);
    const _brand = this.internalConn.escape(req?.brand);
    const _deductStartDate = this.internalConn.escape(req?.deductStartDate);
    const _deductEndDate = this.internalConn.escape(req?.deductEndDate);

    const unionClauses = tableNames
      .map(
        (tableName) =>
          `SELECT Point_Type, Mobile_Country_Code, Mobile, Point_Item, Point, Card_ID, Member_Name, Order_Type, Order_ID, Expired_Date, Send_Date, Deduct_Date, Brand_ID, Brand_Name, Store_Name, Create_Date FROM ${tableName}`
      )
      .join('\nUNION ALL\n');

    let queryCountStr = /* sql */ `
-- 取得資料筆數
SELECT COUNT(1) count
FROM (
   ${unionClauses}
) combinedLog
WHERE 1=1
`;

    let queryStr = /* sql */ `
-- 取得列表資料
SELECT  Point_Item pointItem,
        Point point,
        Card_ID cardId,
        Member_Name name,
        Order_Type orderType,
        Order_ID orderId,
        DATE_FORMAT(Expired_Date, '%Y/%m/%d') expiredDate,
        Send_Date sendDate,
        Deduct_Date deductDate,
        Brand_Name brandName,
        Store_Name storeName,
        Mobile_Country_Code mobileCountryCode,
        Mobile mobile
FROM (
   ${unionClauses}
) combinedLog
WHERE 1=1
    `;

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MOBILE:
          queryCountStr += ` AND combinedLog.Mobile = ${_search}`;
          queryStr += ` AND combinedLog.Mobile = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.MEMBER_CARD:
          queryCountStr += ` AND combinedLog.Card_ID = ${_search}`;
          queryStr += ` AND combinedLog.Card_ID = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.TRANSACTION_ID:
          queryCountStr += ` AND combinedLog.Order_ID = ${_search}`;
          queryStr += ` AND combinedLog.Order_ID = ${_search}`;
          break;
      }
    }

    if (req?.pointType) {
      queryCountStr += /* sql */ `AND combinedLog.Point_Type = ${_pointType}`;
      queryStr += /* sql */ `AND combinedLog.Point_Type = ${_pointType}`;
    }

    if (req?.brand) {
      queryCountStr += /* sql */ `AND combinedLog.Brand_ID = ${_brand}`;
      queryStr += /* sql */ `AND combinedLog.Brand_ID = ${_brand}`;
    }

    if (req?.sendStartDate && req?.sendEndDate) {
      queryCountStr += /* sql */ `AND combinedLog.send_date >= ${_sendStartDate} AND combinedLog.send_date <= ${_sendEndDate}`;
      queryStr += /* sql */ `AND combinedLog.send_date >= ${_sendStartDate} AND combinedLog.send_date <= ${_sendEndDate}`;
    }

    if (req?.deductStartDate && req?.deductEndDate) {
      queryCountStr += /* sql */ `AND combinedLog.Deduct_Date >= ${_deductStartDate} AND combinedLog.Deduct_Date <= ${_deductEndDate}`;
      queryStr += /* sql */ `AND combinedLog.Deduct_Date >= ${_deductStartDate} AND combinedLog.Deduct_Date <= ${_deductEndDate}`;
    }

    queryStr += /* sql */ `
ORDER BY Create_Date DESC LIMIT ${_start},${_limit}`;

    const result = await this.internalConn.query(
      `${queryCountStr};${queryStr}`
    );

    const [logCount, logList] = result;

    return { logCount, logList };
  }

  /**
   * 取得會員消費資料
   *
   * @param req
   * @returns
   */
  async getMemberOrderData(
    req: GetMemberOrderDataDto
  ): Promise<MemberOrderData[]> {
    const sqlStr = `
    SELECT
      transactionId,
      transactionDate,
      transactionType,
      brandId,
      storeName,
      cost
    FROM (
      SELECT
        orderMain.Transaction_ID as transactionId,
      	orderMain.Transaction_Date as transactionDate,
      	1 as transactionType,
    		orderMain.Brand_ID as brandId,
    		store.Store_Name as storeName,
    		orderDetail.Paid_Amount as cost
		  FROM
        Order_Main orderMain
        JOIN Order_Detail orderDetail ON orderMain.Order_ID = orderDetail.Order_ID AND orderDetail.Is_Active = 1
        LEFT JOIN Store store ON orderMain.Store_ID = store.Store_ID AND store.Is_Active = 1
      WHERE orderMain.Is_Active = 1
        AND orderMain.Member_ID = ?
        AND orderMain.Transaction_Date >= ?
        AND orderMain.Transaction_Date <= ?
    UNION ALL
      SELECT
        returnMain.Transaction_ID as transactionId,
        returnMain.Transaction_Date as transactionDate,
        2 as transactionType,
        returnMain.Brand_ID as brandId,
        store.Store_Name as storeName,
        returnMain.Paid_Amount as cost
      FROM
        Order_Main orderMain
        JOIN Return_Main returnMain ON orderMain.Transaction_ID = returnMain.Transaction_ID AND returnMain.Is_Active = 1
        LEFT JOIN Store store ON returnMain.Store_ID = store.Store_ID AND store.Is_Active = 1
      WHERE returnMain.Is_Active = 1
        AND orderMain.Member_ID = ?
        AND returnMain.Transaction_Date >= ?
        AND returnMain.Transaction_Date <= ?
    ) as tmp
    ORDER BY transactionId DESC, transactionType ASC
    LIMIT ?, ?
    `;

    const params = [];
    params.push(
      req?.memberId,
      req?.startDate,
      req?.endDate,
      req?.memberId,
      req?.startDate,
      req?.endDate,
      (req?.page - 1) * req?.perPage,
      req?.perPage
    );

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 取得會員消費資料總筆數
   *
   * @param req
   * @returns
   */
  async getMemberOrderDataCount(req: GetMemberOrderDataDto): Promise<number> {
    const sqlStr = `
    SELECT COUNT(1) as orderCount
    FROM (
      SELECT
        orderMain.Transaction_ID as transactionId,
      	orderMain.Transaction_Date as transactionDate,
      	1 as transactionType,
    		orderMain.Brand_ID as brandId,
    		store.Store_Name as storeName,
    		orderDetail.Paid_Amount as cost
		  FROM
        Order_Main orderMain
        JOIN Order_Detail orderDetail ON orderMain.Order_ID = orderDetail.Order_ID AND orderDetail.Is_Active = 1
        LEFT JOIN Store store ON orderMain.Store_ID = store.Store_ID AND store.Is_Active = 1
      WHERE orderMain.Is_Active = 1
        AND orderMain.Member_ID = ?
        AND orderMain.Transaction_Date >= ?
        AND orderMain.Transaction_Date <= ?
    UNION ALL
      SELECT
        returnMain.Transaction_ID as transactionId,
        returnMain.Transaction_Date as transactionDate,
        2 as transactionType,
        returnMain.Brand_ID as brandId,
        store.Store_Name as storeName,
        returnMain.Paid_Amount as cost
      FROM
        Order_Main orderMain
        JOIN Return_Main returnMain ON orderMain.Transaction_ID = returnMain.Transaction_ID AND returnMain.Is_Active = 1
        LEFT JOIN Store store ON returnMain.Store_ID = store.Store_ID AND store.Is_Active = 1
      WHERE returnMain.Is_Active = 1
        AND orderMain.Member_ID = ?
        AND returnMain.Transaction_Date >= ?
        AND returnMain.Transaction_Date <= ?
    ) as tmp
    `;

    const params = [];
    params.push(
      req?.memberId,
      req?.startDate,
      req?.endDate,
      req?.memberId,
      req?.startDate,
      req?.endDate
    );

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.orderCount ?? 0;
  }

  /**
   * 取得會員消費品牌
   *
   * @param memberId
   * @returns
   */
  async getMemberOrderBrand(
    memberId: string
  ): Promise<GetMemberOrderBrandResp[]> {
    const sqlStr = `
    SELECT
      brand.Brand_Name as brandName,
      MAX(orderMain.Completion_Date) as orderDate,
      COUNT(orderMain.Order_ID) as orderCount
    FROM
      Order_Main orderMain
      JOIN Brand brand ON orderMain.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
    WHERE orderMain.Is_Active = 1
      AND orderMain.Member_ID = ?
    GROUP BY orderMain.Brand_ID
    ORDER BY orderCount DESC, orderDate DESC
    LIMIT 3
    `;

    const result = (await this.internalConn.query(sqlStr, [memberId])) ?? [];

    return result;
  }

  /**
   * 取得會員消費商品
   *
   * @param memberId
   * @param channelId
   * @returns
   */
  async getMemberOrderCommodity(
    memberId: string,
    channelId: string
  ): Promise<GetMemberOrderCommodityResp[]> {
    const sqlStr = `
    SELECT
      orderProduct.Product_Name as productName,
      MAX(orderMain.Completion_Date) as orderDate,
      SUM(orderProduct.Product_Count) as productCount
    FROM
      Order_Main orderMain
      JOIN Order_Detail_Product orderProduct ON orderMain.Transaction_ID = orderProduct.Transaction_ID AND orderProduct.Is_Active = 1
    WHERE orderMain.Is_Active = 1
      AND orderMain.Member_ID = ?
      AND orderMain.Order_Channel_ID = ?
    GROUP BY orderProduct.Product_ID
    ORDER BY productCount DESC, orderDate DESC
    LIMIT 3
    `;

    const result =
      (await this.internalConn.query(sqlStr, [memberId, channelId])) ?? [];

    return result;
  }

  /**
   * 取得退貨訂單筆數
   *
   * @param transactionIds
   * @returns
   */
  async getOrderReturnCount(): Promise<GetOrderReturnCountResp[]> {
    const sqlStr = `
    SELECT
      returnMain.Transaction_ID as transactionId,
      COUNT(returnMain.ID) as returnCount
    FROM
      Return_Main returnMain
    WHERE returnMain.Is_Active = 1
    GROUP BY returnMain.Transaction_ID
    `;

    const result = (await this.internalConn.query(sqlStr)) ?? [];

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
  ): Promise<OrderExportList[]> {
    let sqlStr = `
    SELECT
      exportCsvLog.ID as exportId,
      exportCsvLog.File_Name as exportName,
      exportCsvLog.File_Url as exportUrl,
      exportCsvLog.Alter_Date as exportDate,
      exportCsvLog.Create_Date as createDate,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = exportCsvLog.Create_ID), 'system') as createName
    FROM
      Export_Csv_Log exportCsvLog
    WHERE exportCsvLog.Csv_Type = ?
    `;
    const params = [];
    params.push(req?.action);

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.EXPORT_ID:
          sqlStr += ` AND exportCsvLog.ID = ?`;
          params.push(req?.search);
          break;
      }
    }

    sqlStr += ` ORDER BY exportCsvLog.Create_Date DESC`;
    sqlStr += ` LIMIT ?, ?`;
    params.push((req?.page - 1) * req?.perPage, req?.perPage);

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 取得交易匯出資料總筆數
   *
   * @param req
   * @returns
   */
  async getOrderExportListCount(req: GetOrderExportListDto): Promise<number> {
    let sqlStr = `
    SELECT
      COUNT(ID) as memberExportCount
    FROM
      Export_Csv_Log
    WHERE Csv_Type = ?
    `;
    const params = [];
    params.push(req?.action);

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.EXPORT_ID:
          sqlStr += ` AND ID = ?`;
          params.push(req?.search);
          break;
      }
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.memberExportCount;
  }
}
