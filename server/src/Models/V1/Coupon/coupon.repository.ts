import { Injectable } from '@nestjs/common';
import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import {
  COUPON_ISSUANCE_STATE_TYPE,
  COUPON_RELEASE_STATUS_TYPE,
  COUPON_REWARD_RULES_TYPE,
  COUPON_STATE_TYPE,
  FRONT_COUPON_RELEASE_STATUS_TYPE
} from 'src/Definition/Enum/Coupon/coupon.type.enum';
import {
  MEMBER_COUPON_STATUS,
  MEMBER_DETAIL_COUPON_STATUS
} from 'src/Definition/Enum/Coupon/member.coupon.status.enum';
import { ENUM_POINT_TYPE_LOG } from 'src/Definition/Enum/Coupon/point.type.log.enum';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { v4 as ruuidv4 } from 'uuid';
import {
  CouponBrand,
  CouponSearch,
  CouponSendDetail,
  CouponSendList,
  CouponSettingDetail,
  CouponSettingList,
  CouponStore,
  GetCouponSearchDto,
  GetCouponSendListDto,
  GetCouponSettingListDto,
  MemberCouponDetail,
  MemberCouponList,
  UpdCouponSendDetailDto,
  UpdCouponSettingDetailDto,
  UpdCouponStores
} from './Dto';
import {
  CouponDetailList,
  GetCouponDetailListDto
} from './Dto/get.coupon.detail.list.dto';
import {
  GetMemberCouponDetailListDto,
  MemberCouponDetailList
} from './Dto/get.member.coupon.detail.list.dto';
import { GetMemberCouponDetailByTransactionId } from './Dto/get.member.coupon.detail.transaction.id.dto';
import { GetCouponIssuanceMemberResp } from './Interface/get.coupon.issuance.member.interface';
import { GetCouponMemberShipResp } from './Interface/get.coupon.member.ship.interface';
import { GetCouponSendDetail } from './Interface/get.coupon.send.detail.interface';
import { GetMemberCouponDetailByRedeemId } from './Interface/get.member.coupon.detail.interface';
import { GetMemberCouponStatusCountResp } from './Interface/get.member.coupon.status.count.interface';
import { GetMemberExpiringPointResp } from './Interface/get.member.expiring.point.interface';
import {
  GetMemberPointResp,
  MemberPointLog,
  UsedPoint
} from './Interface/get.member.point.interface';
import { GetRegisterCouponResp } from './Interface/get.register.coupon.interface';
import { InsCouponDetailReq } from './Interface/ins.coupon.detail.interface';
import { SendRegisterCouponReq } from './Interface/send.register.coupon.interface';

import moment = require('moment-timezone');

/**
 *
 * @class
 */
@Injectable()
export class CouponRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得優惠券設定列表
   *
   * @param req
   * @returns
   */
  async getCouponSettingList(
    req: GetCouponSettingListDto
  ): Promise<CouponSettingList[]> {
    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');

    let sqlStr = `
    SELECT DISTINCT
      coupon.Coupon_ID as id,
      c.Channel_Name as channelName,
      coupon.Coupon_Type as couponType,
      coupon.Reward_Rules as rewardRule,
      coupon.Coupon_Name as couponName,
      coupon.Thumbnail_Image as couponImgUrl,
      coupon.Coupon_Point as point,
      coupon.Release_Status as releaseStatus,
      coupon.On_Sold_Start_Date as startDate,
      coupon.On_Sold_End_Date as endDate,
      coupon.Redemption_Start_Date as couponStartDate,
      coupon.Redemption_End_Date as couponEndDate,
      coupon.Earliest_Pickup_Date as earliestPickupDate,
      coupon.Create_Date as createTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = coupon.Create_ID), 'system') as createName,
      coupon.Alter_Date as alterTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = coupon.Alter_ID), 'system') as alterName,
      coupon.Quantity as quantity,
      coupon.Coupon_Rule as couponRule
    FROM
      Coupon coupon
      JOIN Channel c ON coupon.Writeoff_Channel_ID = c.Channel_ID AND c.Is_Active = 1
      JOIN Coupon_Brand couponBrand ON coupon.Coupon_ID = couponBrand.Coupon_ID AND couponBrand.Is_Active = 1
      LEFT JOIN Coupon_Member_Ship memberShip ON coupon.Coupon_ID = memberShip.Coupon_ID AND memberShip.Is_Active = 1
    WHERE coupon.Is_Active = 1
    `;

    const params = [];
    switch (req?.state) {
      case COUPON_STATE_TYPE.ING:
        sqlStr += ` AND coupon.On_Sold_Start_Date <= ? AND coupon.On_Sold_End_Date >= ?`;
        params.push(now, now);
        break;
      case COUPON_STATE_TYPE.END:
        sqlStr += ` AND coupon.On_Sold_End_Date < ?`;
        params.push(now);
        break;
      case COUPON_STATE_TYPE.NOT_START:
        sqlStr += ` AND coupon.On_Sold_Start_Date > ?`;
        params.push(now);
        break;
    }

    // 搜尋欄
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.COUPON_NAME:
          sqlStr += ` AND coupon.Coupon_Name = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.COUPON_ID:
          sqlStr += ` AND coupon.Coupon_ID = ?`;
          params.push(req?.search);
          break;
      }
    }

    // 核銷渠道
    if (req?.channelId) {
      sqlStr += ` AND coupon.Writeoff_Channel_ID = ?`;
      params.push(req?.channelId);
    }

    // 通用品牌
    if (req?.brandId) {
      sqlStr += ` AND couponBrand.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    // 兌換類型
    if (req?.exchangeType > 0) {
      sqlStr += ` AND coupon.Coupon_Type = ?`;
      params.push(req?.exchangeType);
    }

    if (req?.excludeCouponIds && req?.excludeCouponIds?.length > 0) {
      sqlStr += ` AND coupon.Coupon_ID NOT IN (`;
      let i = 0;
      for (const couponId of req?.excludeCouponIds) {
        if (i >= 1) {
          sqlStr += `,`;
        }
        sqlStr += `?`;
        params.push(couponId);
        i++;
      }
      sqlStr += `)`;
    }

    // 發放規則
    if (req?.sendType > 0) {
      sqlStr += ` AND coupon.Reward_Rules = ?`;
      params.push(req?.sendType);
    }

    // 發佈狀態
    if (req?.releaseState > 0) {
      switch (req?.releaseState) {
        case FRONT_COUPON_RELEASE_STATUS_TYPE[
          COUPON_RELEASE_STATUS_TYPE.PUBLISHED
        ]:
          sqlStr += ` AND coupon.Release_Status = ?`;
          params.push(COUPON_RELEASE_STATUS_TYPE.PUBLISHED);
          break;
        case FRONT_COUPON_RELEASE_STATUS_TYPE[
          COUPON_RELEASE_STATUS_TYPE.UNPUBLISHED
        ]:
          sqlStr += ` AND coupon.Release_Status = ?`;
          params.push(COUPON_RELEASE_STATUS_TYPE.UNPUBLISHED);
          break;
      }
    }

    // 會籍 ID
    if (req?.levelId) {
      sqlStr += ` AND memberShip.Member_Ship = ?`;
      params.push(req?.levelId);
    }

    sqlStr += ` ORDER BY coupon.Create_Date DESC`;
    sqlStr += ` LIMIT ?, ?`;
    params.push((req?.page - 1) * req?.perPage, req?.perPage);

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result;
  }

  /**
   * 取得優惠券設定列表總筆數
   *
   * @param req
   * @returns
   */
  async getCouponSettingListCount(
    req: GetCouponSettingListDto
  ): Promise<number> {
    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');

    let sqlStr = `
    SELECT
      COUNT(DISTINCT coupon.Coupon_ID) as couponCount
    FROM
      Coupon coupon
      JOIN Channel c ON coupon.Writeoff_Channel_ID = c.Channel_ID AND c.Is_Active = 1
      JOIN Coupon_Brand couponBrand ON coupon.Coupon_ID = couponBrand.Coupon_ID AND couponBrand.Is_Active = 1
      LEFT JOIN Coupon_Member_Ship memberShip ON coupon.Coupon_ID = memberShip.Coupon_ID AND memberShip.Is_Active = 1
    WHERE coupon.Is_Active = 1
    `;

    const params = [];
    switch (req?.state) {
      case COUPON_STATE_TYPE.ING:
        sqlStr += ` AND coupon.On_Sold_Start_Date <= ? AND coupon.On_Sold_End_Date >= ?`;
        params.push(now, now);
        break;
      case COUPON_STATE_TYPE.END:
        sqlStr += ` AND coupon.On_Sold_End_Date < ?`;
        params.push(now);
        break;
      case COUPON_STATE_TYPE.NOT_START:
        sqlStr += ` AND coupon.On_Sold_Start_Date > ?`;
        params.push(now);
        break;
    }

    // 搜尋欄
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.COUPON_NAME:
          sqlStr += ` AND coupon.Coupon_Name = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.COUPON_ID:
          sqlStr += ` AND coupon.Coupon_ID = ?`;
          params.push(req?.search);
          break;
      }
    }

    // 核銷渠道
    if (req?.channelId) {
      sqlStr += ` AND coupon.Writeoff_Channel_ID = ?`;
      params.push(req?.channelId);
    }

    // 通用品牌
    if (req?.brandId) {
      sqlStr += ` AND couponBrand.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    // 兌換類型
    if (req?.exchangeType > 0) {
      sqlStr += ` AND coupon.Coupon_Type = ?`;
      params.push(req?.exchangeType);
    }

    if (req?.excludeCouponIds && req?.excludeCouponIds?.length > 0) {
      sqlStr += ` AND coupon.Coupon_ID NOT IN (`;
      let i = 0;
      for (const couponId of req?.excludeCouponIds) {
        if (i >= 1) {
          sqlStr += `,`;
        }
        sqlStr += `?`;
        params.push(couponId);
        i++;
      }
      sqlStr += `)`;
    }

    // 發放規則
    if (req?.sendType > 0) {
      sqlStr += ` AND coupon.Reward_Rules = ?`;
      params.push(req?.sendType);
    }

    // 發佈狀態
    if (req?.releaseState > 0) {
      switch (req?.releaseState) {
        case FRONT_COUPON_RELEASE_STATUS_TYPE[
          COUPON_RELEASE_STATUS_TYPE.PUBLISHED
        ]:
          sqlStr += ` AND coupon.Release_Status = ?`;
          params.push(COUPON_RELEASE_STATUS_TYPE.PUBLISHED);
          break;
        case FRONT_COUPON_RELEASE_STATUS_TYPE[
          COUPON_RELEASE_STATUS_TYPE.UNPUBLISHED
        ]:
          sqlStr += ` AND coupon.Release_Status = ?`;
          params.push(COUPON_RELEASE_STATUS_TYPE.UNPUBLISHED);
          break;
      }
    }

    // 會籍 ID
    if (req?.levelId) {
      sqlStr += ` AND memberShip.Member_Ship = ?`;
      params.push(req?.levelId);
    }

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result?.[0]?.couponCount;
  }

  /**
   * 取得優惠券設定詳情
   *
   * @param couponId 兌換券編號
   * @param rules 兌換券規則
   * @returns
   */
  async getCouponSettingDetail(
    couponId: string,
    rules?: string[]
  ): Promise<CouponSettingDetail> {
    let sqlStr = `
    SELECT
      Coupon_Name as couponName,
      Coupon_Type as couponType,
      Main_Image as mainImageUrl,
      Thumbnail_Image as thumbnailImageUrl,
      Assign_Channel_ID as assignChannelId,
      Writeoff_Channel_ID as writeoffChannelId,
      Reward_Rules as rewardRule,
      Coupon_Point as point,
      Release_Status as releaseStatus,
      Release_Date as releaseDate,
      Birthday_Year as birthdayYear,
      Birthday_Month as birthdayMonth,
      Coupon_Rule as couponRule,
      Redemption_Start_Date as couponStartDate,
      Redemption_End_Date  as couponEndDate,
      Quantity as quantity,
      On_Sold_Start_Date as startDate,
      On_Sold_End_Date as endDate,
      Is_Transferable as isTransferable,
      Usage_Description as description,
      Alter_Date as alterTime,
      Redeem_Limit as redeemLimit,
      Earliest_Pickup_Date as earliestPickupDate,
      Pickup_Deadline as pickupDeadline
    FROM
      Coupon
    WHERE Is_Active = 1
      AND Coupon_ID = ?
    `;

    if (rules?.length > 0) {
      const _rules = this.internalConn.escape(rules);
      sqlStr += ` AND Reward_Rules IN (${_rules})`;
    }

    const result = (await this.internalConn.query(sqlStr, [couponId])) ?? [];

    return result?.[0];
  }

  /**
   * 取得多筆兌換券詳細資料
   *
   * @param couponIds 兌換券編號(複數)
   * @param rule 兌換券規則
   * @returns
   */
  async getCouponSettingDetails(
    couponIds: string[],
    rule?: string
  ): Promise<CouponSettingDetail[]> {
    const _couponIds = this.internalConn.escape(couponIds);

    let sqlStr = `
    SELECT
      Coupon_ID as couponId,
      Coupon_Name as couponName,
      Main_Image as mainImageUrl,
      Thumbnail_Image as thumbnailImageUrl,
      Assign_Channel_ID as assignChannelId,
      Writeoff_Channel_ID as writeoffChannelId,
      Reward_Rules as rewardRule,
      Coupon_Point as point,
      Earliest_Pickup_Date as earliestPickupDate,
      Release_Status as releaseStatus,
      Birthday_Year as birthdayYear,
      Birthday_Month as birthdayMonth,
      Coupon_Rule as couponRule,
      Redemption_Start_Date as couponStartDate,
      Redemption_End_Date  as couponEndDate,
      Quantity as quantity,
      On_Sold_Start_Date as startDate,
      On_Sold_End_Date as endDate,
      Is_Transferable as isTransferable,
      Usage_Description as description,
      Alter_Date as alterTime,
      Redeem_Limit as redeemLimit
    FROM
      Coupon
    WHERE Is_Active = 1
      AND Coupon_ID IN (${_couponIds})
    `;

    if (rule) {
      const _rule = this.internalConn.escape(rule);
      sqlStr += ` AND Reward_Rules = ${_rule}`;
    }

    const result = (await this.internalConn.query(sqlStr)) ?? [];

    return result;
  }

  /**
   * 取得兌換券會籍
   *
   * @param couponId 兌換券編號
   * @returns
   */
  async getCouponMemberShip(
    couponId: string
  ): Promise<GetCouponMemberShipResp[]> {
    const sqlStr = `
    SELECT
      Member_Ship as memberShipId
    FROM
      Coupon_Member_Ship
    WHERE Is_Active = 1
      AND Coupon_ID = ?
    `;

    const result = (await this.internalConn.query(sqlStr, [couponId])) ?? [];

    return result;
  }

  /**
   * 依發放 ID 取得兌換券發放會員
   *
   * @param cisId 發放編號
   * @returns
   */
  async getCouponIssuanceMemberByCisId(
    cisId: string
  ): Promise<GetCouponIssuanceMemberResp[]> {
    const sqlStr = `
    SELECT
      member.Member_ID as memberId,
      member.Member_Name as memberName,
      member.Mobile_Country_Code as mobileCountryCode,
      member.Mobile as mobile
    FROM
      Coupon_Issuance_Member couponIssuanceMember
      JOIN IEat_Member member ON couponIssuanceMember.Member_ID = member.Member_ID AND member.Is_Active = 1
    WHERE couponIssuanceMember.Is_Active = 1
      AND couponIssuanceMember.Cis_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [cisId]);

    return result;
  }

  /**
   * 取得兌換券已領取數
   *
   * @param couponId 兌換券編號
   * @returns
   */
  async getCouponCount(couponId: string): Promise<number> {
    const sqlStr = `
    SELECT
      COUNT(*) as couponCount
    FROM
      Coupon_Detail
    WHERE Coupon_ID = ?
      AND Is_Active = 1
      AND Transaction_Type > ?
    `;

    const result =
      (await this.internalConn.query(sqlStr, [
        couponId,
        MEMBER_COUPON_STATUS.NOT_RECEIVED
      ])) ?? [];

    return result?.[0]?.couponCount;
  }

  /**
   * 取得會員積點
   * @param memberId 會員編號
   * @param today 兌換日期
   * @returns
   */
  async getMemberPoint(
    memberId: string,
    today: string
  ): Promise<GetMemberPointResp[]> {
    const sqlStr = /* sql */ `
SELECT  mp.Point point,
        DATE_FORMAT(mp.Expired_Date, '%Y-%m-%d %H:%i:%s') expiredDate,
        im.Member_CardID cardId,
        im.Member_Name name,
        im.Mobile_Country_Code mobileCountryCode,
        im.Mobile mobile
FROM Member_Point mp
INNER JOIN IEat_Member im ON im.Member_ID = mp.Member_ID
WHERE mp.Member_ID = ? AND UNIX_TIMESTAMP(mp.Expired_Date) >= UNIX_TIMESTAMP(?)
ORDER BY mp.Expired_Date
    `;

    const result =
      (await this.internalConn.query(sqlStr, [memberId, today])) ?? [];

    return result;
  }

  /**
   * 取得會員即將過期點數
   *
   * @param memberId 會員編號
   * @param startDate 過期起始日
   * @param endDate 過期結束日
   * @returns
   */
  async getMemberExpiringPoint(
    memberId: string,
    startDate: string,
    endDate?: string
  ): Promise<GetMemberExpiringPointResp> {
    let sqlStr = `
    SELECT
      SUM(Point) as point
    FROM
      Member_Point
    WHERE Member_ID = ?
      AND Expired_Date >= ?
    `;

    const params = [];
    params.push(memberId, startDate);
    if (endDate) {
      sqlStr += ` AND Expired_Date <= ?`;
      params.push(endDate);
    }

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result?.[0];
  }

  /**
   * 取得會員兌換券已領取次數
   *
   * @param couponId 兌換券編號
   * @param memberId 會員編號
   * @returns
   */
  async getCouponMemberCount(
    couponId: string,
    memberId: string
  ): Promise<number> {
    const sqlStr = `
    SELECT
      COUNT(*) as couponCount
    FROM
      Coupon_Detail
    WHERE Coupon_ID = ?
      AND Exchange_Member_ID = ?
      AND Is_Active = 1
    `;

    const result =
      (await this.internalConn.query(sqlStr, [couponId, memberId])) ?? [];

    return result?.[0]?.couponCount;
  }

  /**
   * 取得優惠券發放列表
   *
   * @param req
   * @returns
   */
  async getCouponSendList(
    req: GetCouponSendListDto
  ): Promise<CouponSendList[]> {
    let sqlStr = `
    SELECT
      couponIssuance.Cis_ID as id,
      couponIssuance.Cis_Name as name,
      couponIssuance.Cis_Status as cisType,
      couponIssuance.Cis_Date as cisDate,
      couponIssuance.Remark as remark,
      couponIssuance.Create_Date as createTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = couponIssuance.Create_ID), 'system') as createName,
      couponIssuance.Alter_Date as alterTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = couponIssuance.Alter_ID), 'system') as alterName
    FROM
      Coupon_Issuance couponIssuance
    WHERE couponIssuance.Is_Active = 1
    `;

    const params = [];
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.COUPON_SEND_NAME:
          sqlStr += ` AND couponIssuance.Cis_Name = ?`;
          params.push(req?.search);
          break;
      }
    }

    switch (req?.state) {
      case COUPON_ISSUANCE_STATE_TYPE.NOT_START:
        sqlStr += ` AND couponIssuance.Cis_Date > NOW()`;
        break;
      case COUPON_ISSUANCE_STATE_TYPE.END:
        sqlStr += ` AND couponIssuance.Cis_Date < NOW()`;
        break;
    }

    sqlStr += ` ORDER BY couponIssuance.Create_Date DESC`;
    sqlStr += ` LIMIT ?, ?`;
    params.push((req?.page - 1) * req?.perPage, req?.perPage);

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result;
  }

  /**
   * 取得優惠券發放列表總筆數
   *
   * @param req
   * @returns
   */
  async getCouponSendListCount(req: GetCouponSendListDto): Promise<number> {
    let sqlStr = `
    SELECT
      COUNT(*) as cisCount
    FROM
      Coupon_Issuance
    WHERE Is_Active = 1
    `;

    const params = [];
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.COUPON_SEND_NAME:
          sqlStr += ` AND Cis_Name = ?`;
          params.push(req?.search);
          break;
      }
    }

    switch (req?.state) {
      case COUPON_ISSUANCE_STATE_TYPE.NOT_START:
        sqlStr += ` AND Cis_Date > NOW()`;
        break;
      case COUPON_ISSUANCE_STATE_TYPE.END:
        sqlStr += ` AND Cis_Date < NOW()`;
        break;
    }

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result?.[0]?.cisCount;
  }

  /**
   * 取得優惠券發放詳細資料
   *
   * @param sendId 發放編號
   * @returns
   */
  async getCouponSendDetail(sendId: string): Promise<GetCouponSendDetail> {
    const sqlStr = `
    SELECT
      couponIssuance.Cis_ID as id,
      couponIssuance.Cis_Name as name,
      couponIssuance.Cis_Status as cisStatus,
      couponIssuance.Cis_Date as cisDate,
      files.Url as excelUrl,
      couponIssuance.Remark as remark
    FROM
      Coupon_Issuance couponIssuance
      LEFT JOIN Files files ON couponIssuance.Relation_ID = files.Relation_ID AND files.Is_Active = 1
    WHERE couponIssuance.Cis_ID = ?
      AND couponIssuance.Is_Active = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [sendId])) ?? [];

    return result?.[0];
  }

  /**
   * 取得兌換券發送
   *
   * @param sendId 發放編號
   * @returns
   */
  async getCouponSendMap(sendId: string): Promise<CouponSendDetail[]> {
    const sqlStr = `
    SELECT
      coupon.Coupon_ID as couponId,
      coupon.Coupon_Name as couponName,
      coupon.Coupon_Type as couponType
    FROM
      Coupon coupon
      JOIN Coupon_Issuance_Map couponIssuance ON coupon.Coupon_ID = couponIssuance.Coupon_ID
    WHERE coupon.Is_Active = 1
      AND couponIssuance.Cis_ID = ?
    `;

    const result = (await this.internalConn.query(sqlStr, [sendId])) ?? [];

    return result;
  }

  /**
   * 取得兌換券品牌
   *
   * @param couponId 兌換券編號
   * @returns
   */
  async getCouponBrand(couponId: string): Promise<CouponBrand[]> {
    const sqlStr = `
    SELECT
      couponBrand.Coupon_ID as couponId,
      brand.Brand_ID as brandId,
      brand.Brand_Name as brandName,
      brand.Is_Corporation as isCorporation
    FROM
      Coupon_Brand couponBrand
      JOIN Brand brand ON couponBrand.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
    WHERE couponBrand.Is_Active = 1
      AND couponBrand.Coupon_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [couponId]);

    return result;
  }

  /**
   * 取得多個兌換券品牌
   *
   * @param couponIds 兌換券編號(複數)
   * @returns
   */
  async getCouponBrands(couponIds: string[]): Promise<CouponBrand[]> {
    const _couponIds = this.internalConn.escape(couponIds);

    let sqlStr = `
    SELECT
      couponBrand.Coupon_ID as couponId,
      brand.Brand_ID as brandId,
      brand.Brand_Name as brandName
    FROM
      Coupon_Brand couponBrand
      JOIN Brand brand ON couponBrand.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
    WHERE couponBrand.Is_Active = 1
      AND couponBrand.Coupon_ID IN (${_couponIds})
    `;

    const result = await this.internalConn.query(sqlStr);

    return result;
  }

  /**
   * 取得兌換券門市
   *
   * @param couponId 兌換券編號
   * @returns
   */
  async getCouponStore(couponId: string): Promise<CouponStore[]> {
    const sqlStr = `
    SELECT
      brand.Brand_ID as brandId,
      brand.Brand_Name as brandName,
      store.Store_ID as storeId,
      store.Store_Name as storeName,
      store.Store_City as cityCode,
      store.Store_District as zipCode,
      store.Mall_Name as mallName,
      store.Pos_Store as posStore
    FROM
      Coupon_Store couponStore
      JOIN Brand brand ON couponStore.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
      JOIN Store store ON couponStore.Store_ID = store.Store_ID AND store.Is_Active = 1
    WHERE couponStore.Is_Active = 1
      AND couponStore.Coupon_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [couponId]);

    return result;
  }

  /**
   * 取得兌換券 ID 最大值
   *
   * @returns
   */
  async getMaxCouponSettingId(): Promise<string> {
    const sqlStr = `
    SELECT MAX(Coupon_ID) as maxCouponId FROM Coupon LIMIT 1
    `;

    const result = await this.internalConn.query(sqlStr);

    return result?.[0]?.maxCouponId;
  }

  /**
   * 取得兌換券發送 ID 最大值
   *
   * @returns
   */
  async getMaxCouponSendId(): Promise<string> {
    const sqlStr = `
    SELECT MAX(Cis_ID) as maxCouponId FROM Coupon_Issuance LIMIT 1
    `;

    const result = await this.internalConn.query(sqlStr);

    return result?.[0]?.maxCouponId;
  }

  /**
   * 取得兌換券兌換編號 ID 最大值
   *
   * @returns
   */
  async getMaxCouponRedeemId(): Promise<string> {
    const sqlStr = `
    SELECT MAX(Redeem_ID) as maxRedeemId FROM Coupon_Detail LIMIT 1
    `;

    const result = await this.internalConn.query(sqlStr);

    return result?.[0]?.maxRedeemId;
  }

  /**
   * 取得兌換券交易編號 ID 最大值
   *
   * @returns
   */
  async getMaxCouponTransactionId(): Promise<string> {
    const sqlStr = `
    SELECT MAX(Transaction_ID) as maxTransactionId FROM Coupon_Detail LIMIT 1
    `;

    const result = await this.internalConn.query(sqlStr);

    return result?.[0]?.maxTransactionId;
  }

  /**
   * 修改兌換券設定詳細資料
   *
   * @param connection DB 連線
   * @param req
   * @param releaseDate 發佈時間
   * @returns
   */
  async updCouponSettingDetail(
    connection,
    req: UpdCouponSettingDetailDto,
    releaseDate: string
  ): Promise<Record<string, never>> {
    const addData = {
      Coupon_ID: req?.couponId,
      Coupon_Name: req?.couponName,
      Coupon_Type: req?.couponType,
      Main_Image: req?.mainImageUrl,
      Thumbnail_Image: req?.thumbnailImageUrl,
      Assign_Channel_ID: req?.assignChannelId,
      Writeoff_Channel_ID: req?.writeoffChannelId,
      Reward_Rules: req?.rewardRule,
      Coupon_Point: req?.point,
      Release_Status: req?.releaseStatus,
      Birthday_Year: req?.birthdayYear ?? null,
      Birthday_Month: req?.birthdayMonth ?? null,
      On_Sold_Start_Date: req?.startDate,
      On_Sold_End_Date: req?.endDate,
      Coupon_Rule: req?.couponRule,
      Redemption_Start_Date: req?.redemptionStartDate
        ? req?.redemptionStartDate
        : null,
      Redemption_End_Date: req?.redemptionEndDate
        ? req?.redemptionEndDate
        : null,
      Earliest_Pickup_Date: req?.earliestPickupDate
        ? req?.earliestPickupDate
        : 0,
      Pickup_Deadline: req?.pickupDeadline ? req?.pickupDeadline : null,
      Is_Transferable: req?.isTransferable,
      Quantity: req?.quantity,
      Redeem_Limit: req?.redeemLimit,
      Usage_Description: req?.description,
      Release_Date: releaseDate,
      Create_ID: req?.iam?.authMemberId,
      Alter_ID: req?.iam?.authMemberId
    };

    const sqlStr = `
    INSERT INTO Coupon SET ?
    ON DUPLICATE KEY UPDATE Coupon_Name = VALUES(Coupon_Name), Coupon_Type = VALUES(Coupon_Type),
    Main_Image = VALUES(Main_Image), Thumbnail_Image = VALUES(Thumbnail_Image), Assign_Channel_ID = VALUES(Assign_Channel_ID),
    Writeoff_Channel_ID = VALUES(Writeoff_Channel_ID), Reward_Rules = VALUES(Reward_Rules), Coupon_Point = VALUES(Coupon_Point),
    Release_Status = VALUES(Release_Status), Birthday_Year = VALUES(Birthday_Year), Birthday_Month = VALUES(Birthday_Month),
    On_Sold_Start_Date = VALUES(On_Sold_Start_Date), Coupon_Rule = VALUES(Coupon_Rule), Redemption_Start_Date = VALUES(Redemption_Start_Date),
    Redemption_End_Date = VALUES(Redemption_End_Date), Pickup_Deadline = VALUES(Pickup_Deadline), Is_Transferable = VALUES(Is_Transferable),
    Quantity = VALUES(Quantity), Redeem_Limit = VALUES(Redeem_Limit), Usage_Description = VALUES(Usage_Description),
    On_Sold_End_Date = VALUES(On_Sold_End_Date), Release_Date = VALUES(Release_Date), Alter_ID = VALUES(Alter_ID)
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [addData]);

    return {};
  }

  /**
   * 修改指定欄位兌換券設定詳細資料
   *
   * @param couponId 兌換券編號
   * @param updData
   * @returns
   */
  async updCouponSpecifySettingDetail(
    couponId: string,
    updData
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon SET ? WHERE Coupon_ID = ?
    `;

    await this.internalConn.query(sqlStr, [updData, couponId]);

    return {};
  }

  /**
   * 初始化兌換券會籍關聯
   *
   * @param connection DB 連線
   * @param couponId 兌換券編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initCouponMemberShip(
    connection,
    couponId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon_Member_Ship SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Coupon_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      couponId
    ]);

    return {};
  }

  /**
   * 新增兌換券會籍
   *
   * @param connection DB 連線
   * @param couponId 兌換券編號
   * @param memberShips 會籍(複數)
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insCouponMemberShip(
    connection,
    couponId: string,
    memberShips: string[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Coupon_Member_Ship
    (Coupon_ID, Member_Ship, Is_Active, Create_ID, Alter_ID)
    VALUES
    `;
    let i = 0;
    const params = [];
    for (const memberShipId of memberShips) {
      if (i >= 1) {
        sqlStr += `,`;
      }

      sqlStr += ` (?, ?, ?, ?, ?)`;
      params.push(couponId, memberShipId, 1, authMemberId, authMemberId);
      i++;
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Is_Active = VALUES(Is_Active),`;
    sqlStr += ` Alter_ID = VALUES(Alter_ID)`;

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 初始化兌換券與品牌關聯
   *
   * @param connection DB 連線
   * @param couponId 兌換券編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initCouponBrand(
    connection,
    couponId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon_Brand SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Coupon_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      couponId
    ]);

    return {};
  }

  /**
   * 新增兌換券品牌
   *
   * @param connection DB 連線
   * @param couponId 兌換券編號
   * @param brandIds 品牌編號(複數)
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insCouponBrand(
    connection,
    couponId: string,
    brandIds: string[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Coupon_Brand
    (Coupon_ID, Brand_ID, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    const params = [];
    for (const brandId of brandIds) {
      if (i >= 1) {
        sqlStr += `,`;
      }

      sqlStr += ` (?, ?, ?, ?)`;
      params.push(couponId, brandId, authMemberId, authMemberId);
      i++;
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Is_Active = 1, Alter_ID = VALUES(Alter_ID)`;

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 初始化兌換券門市
   *
   * @param connection DB 連線
   * @param couponId 兌換券編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initCouponStore(
    connection,
    couponId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon_Store SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Coupon_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      couponId
    ]);

    return {};
  }

  /**
   * 新增兌換券門市
   *
   * @param connection DB 連線
   * @param couponId 兌換券編號
   * @param couponStores
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insCouponStore(
    connection,
    couponId: string,
    couponStores: UpdCouponStores[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Coupon_Store
    (Coupon_ID, Brand_ID, Store_ID, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    const params = [];
    for (const couponStore of couponStores) {
      if (i >= 1) {
        sqlStr += `,`;
      }

      sqlStr += ` (?, ?, ?, ?, ?)`;
      params.push(
        couponId,
        couponStore?.brandId,
        couponStore?.storeId,
        authMemberId,
        authMemberId
      );
      i++;
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Is_Active = 1, Alter_ID = VALUES(Alter_ID)`;

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 軟刪除兌換券詳細資料
   *
   * @param connection DB 連線
   * @param couponId 兌換券編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delCouponSettingDetail(
    connection,
    couponId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Coupon_ID = ?
    `;
    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      couponId
    ]);

    return {};
  }

  /**
   * 軟刪除兌換券會籍
   *
   * @param connection DB 連線
   * @param couponId 兌換券編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delCouponMemberShip(
    connection,
    couponId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon_Member_Ship SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Coupon_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      couponId
    ]);

    return {};
  }

  /**
   * 軟刪除兌換券發放詳細資料
   *
   * @param connection DB 連線
   * @param sendId 發送編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delCouponSendDetail(
    connection,
    sendId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon_Issuance SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Cis_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      sendId
    ]);

    return {};
  }

  /**
   * 軟刪除兌換券兌換ID關聯資料
   *
   * @param connection DB 連線
   * @param sendId 發送編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delCouponSendMap(
    connection,
    sendId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon_Issuance_Map SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Cis_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      sendId
    ]);

    return {};
  }

  /**
   * 軟刪除兌換券發送會員關聯資料
   *
   * @param connection DB 連線
   * @param sendId 發送編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delCouponSendMemberDetail(
    connection,
    sendId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon_Issuance_Member SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Cis_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      sendId
    ]);

    return {};
  }

  /**
   * 軟刪除會員兌換券
   *
   * @param connection DB 連線
   * @param sendId 發送編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delMemberCouponDetail(
    connection,
    sendId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon_Detail SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Cis_ID = ?
      AND Transaction_Type = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      sendId,
      MEMBER_COUPON_STATUS.NOT_RECEIVED
    ]);

    return {};
  }

  /**
   * 軟刪除兌換券品牌
   *
   * @param connection DB 連線
   * @param couponId 兌換券編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delCouponBrand(
    connection,
    couponId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon_Brand SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Coupon_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      couponId
    ]);

    return {};
  }

  /**
   * 軟刪除兌換券門市
   *
   * @param connection DB 連線
   * @param couponId 兌換券編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delCouponStore(
    connection,
    couponId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon_Store SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Coupon_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      couponId
    ]);

    return {};
  }

  /**
   * 取得會員兌換券列表
   *
   * @param memberId 會員編號
   * @param page 頁數
   * @param perPage 一頁筆數
   * @returns
   */
  async getMemberCouponList(
    memberId: string,
    page: number,
    perPage: number
  ): Promise<MemberCouponList[]> {
    const sqlStr = `
    SELECT
      coupon.Coupon_ID as couponId,
      couponDetail.ID as couponSeq,
      coupon.Coupon_Name as couponName,
      coupon.Main_Image as mainImageUrl,
      coupon.Thumbnail_Image as thumbnailImageUrl,
      coupon.On_Sold_Start_Date as startDate,
      coupon.On_Sold_End_Date as endDate,
      coupon.Redemption_Start_Date as redemptionStartDate,
      coupon.Redemption_End_Date as redemptionEndDate,
      coupon.Usage_Description as content,
      couponDetail.Transaction_Type as couponStatus,
      couponDetail.Transaction_Date as transactionDate,
      couponDetail.Coupon_End_Date as couponEndDate,
      couponDetail.Alter_Date as alterDate,
      member.Mobile_Country_Code as transferorCountryCode,
      member.Mobile as transferorMobile
    FROM
      Coupon coupon
      JOIN Coupon_Detail couponDetail ON coupon.Coupon_ID = couponDetail.Coupon_ID AND couponDetail.Is_Active = 1
      LEFT JOIN IEat_Member member ON couponDetail.Donor_Member_ID = member.Member_ID AND member.Is_Active = 1
    WHERE coupon.Is_Active = 1
      AND couponDetail.Exchange_Member_ID = ?
      AND couponDetail.Transaction_Type > 0
    ORDER BY couponDetail.ID DESC
    LIMIT ?, ?
    `;

    const result =
      (await this.internalConn.query(sqlStr, [
        memberId,
        (page - 1) * perPage,
        perPage
      ])) ?? [];

    return result;
  }

  /**
   * 取得會員兌換券列表總筆數
   *
   * @param memberId 會員編號
   * @returns
   */
  async getMemberCouponListCount(memberId: string): Promise<number> {
    const sqlStr = `
    SELECT
      COUNT(*) as memberCouponListCount
    FROM
      Coupon coupon
      JOIN Coupon_Detail couponDetail ON coupon.Coupon_ID = couponDetail.Coupon_ID AND couponDetail.Is_Active = 1
      LEFT JOIN IEat_Member member ON couponDetail.Donor_Member_ID = member.Member_ID AND member.Is_Active = 1
    WHERE coupon.Is_Active = 1
      AND couponDetail.Exchange_Member_ID = ?
      AND couponDetail.Transaction_Type > 0
    `;

    const result = (await this.internalConn.query(sqlStr, [memberId])) ?? [];

    return result?.[0]?.memberCouponListCount;
  }

  /**
   * 依會員兌換券流水號詳細資料
   *
   * @param memberId 會員編號
   * @param couponSeq 兌換明細流水號
   * @returns
   */
  async getMemberCouponDetailBySeq(
    memberId: string,
    couponSeq: string
  ): Promise<MemberCouponDetail> {
    const sqlStr = `
    SELECT
      couponDetail.ID as couponSeq,
      couponDetail.Redeem_ID as redeemId,
      coupon.Coupon_ID as couponId,
      couponDetail.Reward_Card_ID as rewardCardId,
      coupon.Coupon_Name as couponName,
      coupon.Main_Image as mainImageUrl,
      coupon.Thumbnail_Image as thumbnailImageUrl,
      coupon.On_Sold_Start_Date as startDate,
      coupon.On_Sold_End_Date as endDate,
      coupon.Redemption_Start_Date as redemptionStartDate,
      coupon.Redemption_End_Date as redemptionEndDate,
      couponDetail.Transaction_Type as couponStatus,
      couponDetail.Transaction_Date as transactionDate,
      coupon.Usage_Description as content,
      couponDetail.Coupon_End_Date as expiredDate,
      couponDetail.Transfer_Member_ID as transferMemberId,
      couponDetail.Donor_Member_ID  as donorMemberId,
      couponDetail.Alter_Date as alterDate,
      coupon.Is_Transferable as isTransferable
    FROM
      Coupon coupon
      JOIN Coupon_Detail couponDetail ON coupon.Coupon_ID = couponDetail.Coupon_ID AND couponDetail.Is_Active = 1
    WHERE coupon.Is_Active = 1
      AND couponDetail.Exchange_Member_ID = ?
      AND couponDetail.ID = ?
    `;

    const result =
      (await this.internalConn.query(sqlStr, [memberId, couponSeq])) ?? [];

    return result?.[0];
  }

  /**
   * 取得會員即將到期的票券
   *
   * @param memberId 會員編號
   * @param diffDay N天內即將到期
   * @returns
   */
  async getMemberCouponDetailToExpired(
    memberId: string,
    diffDay: number
  ): Promise<number> {
    const sqlStr = `
    SELECT
      COUNT(*) as couponCount
    FROM
      Coupon coupon
      LEFT JOIN Coupon_Detail couponDetail ON coupon.Coupon_ID = couponDetail.Coupon_ID AND couponDetail.Is_Active = 1
    WHERE coupon.Is_Active = 1
      AND couponDetail.Transaction_Type = ?
      AND couponDetail.Exchange_Member_ID = ?
      AND couponDetail.Coupon_End_Date > NOW()
      AND DATEDIFF(couponDetail.Coupon_End_Date,NOW()) <= ?
    `;

    const result = await this.internalConn.query(sqlStr, [
      MEMBER_COUPON_STATUS.RECEIVED,
      memberId,
      diffDay
    ]);

    return result?.[0].couponCount;
  }

  /**
   * 新增兌換券發放
   *
   * @param connection DB 連線
   * @param req
   * @param relationId 檔案編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insCouponIssuanceDetail(
    connection,
    req: UpdCouponSendDetailDto,
    relationId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    const addData = {
      Cis_ID: req?.sendId,
      Cis_Name: req?.name,
      Cis_Status: req?.cisType,
      Cis_Date: req?.cisType == 1 ? now : req?.cisDate,
      Relation_ID: relationId ? relationId : null,
      Remark: req?.remark,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `
    INSERT INTO Coupon_Issuance SET ?
    ON DUPLICATE KEY UPDATE Cis_Name = VALUES(Cis_Name), Cis_Status = VALUES(Cis_Status), Cis_Date = VALUES(Cis_Date),
    Remark = VALUES(Remark), Alter_ID = VALUES(Alter_ID), Relation_ID = VALUES(Relation_ID), Alter_Date = CURRENT_TIMESTAMP
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [addData]);

    return {};
  }

  /**
   * 新增兌換券發送與兌換券設定關聯
   *
   * @param connection DB 連線
   * @param sendId 發放編號
   * @param couponIds 兌換券編號(複數)
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insCouponIssuanceMap(
    connection,
    sendId: string,
    couponIds: string[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Coupon_Issuance_Map
    (Coupon_ID, Cis_ID, Create_ID, Alter_ID)
    VALUES
    `;
    let i = 0;
    const params = [];
    for (const couponId of couponIds) {
      if (i >= 1) {
        sqlStr += `,`;
      }

      sqlStr += `(?, ?, ?, ?)`;
      params.push(couponId, sendId, authMemberId, authMemberId);
      i++;
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Is_Active = 1, Alter_ID = VALUES(Alter_ID)`;

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 更改會員兌換券狀態
   *
   * @param connection DB 連線
   * @param status 狀態
   * @param couponSeq 兌換明細流水號
   * @param transferMemberId 轉贈會員編號
   * @returns
   */
  async updMemberCouponTransferStatus(
    connection,
    status: number,
    couponSeq: string,
    transferMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon_Detail SET
      Transaction_Type = ?,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?,
      Transfer_Member_ID = ?,
      Transfer_Date = CURRENT_TIMESTAMP
    WHERE Is_Active = 1
      AND ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      status,
      'system',
      transferMemberId,
      couponSeq
    ]);

    return {};
  }

  /**
   * 取得會員兌換券列表
   *
   * @param req
   * @returns
   */
  async getCouponSearchList(req: GetCouponSearchDto): Promise<CouponSearch[]> {
    const _brandIds = this.internalConn.escape(req?.brandIds);

    let sqlStr = `
    SELECT
      coupon.Coupon_ID as couponId,
      coupon.Coupon_Name as couponName,
      c.Channel_Name as channelName,
      coupon.Coupon_Point as point,
      coupon.On_Sold_Start_Date as startDate,
      coupon.On_Sold_End_Date as endDate,
      coupon.Main_Image as mainImageUrl,
      coupon.Thumbnail_Image as thumbnailImageUrl,
      coupon.Redemption_Start_Date as couponStartDate,
      coupon.Redemption_End_Date as couponEndDate,
      coupon.Release_Status as releaseStatus,
      coupon.Release_Date as releaseDate,
      coupon.Usage_Description as content,
      coupon.Alter_Date as alterTime
    FROM
      Coupon coupon
      JOIN Channel c ON coupon.Writeoff_Channel_ID = c.Channel_ID AND c.Is_Active = 1
      JOIN Coupon_Brand couponBrand ON coupon.Coupon_ID = couponBrand.Coupon_ID AND couponBrand.Is_Active = 1
      JOIN Coupon_Member_Ship memberShip ON coupon.Coupon_ID = memberShip.Coupon_ID AND memberShip.Is_Active = 1
    WHERE coupon.Is_Active = 1
      AND coupon.Release_Status = 1
      AND coupon.On_Sold_Start_Date <= NOW() AND coupon.On_Sold_End_Date >= NOW()
      AND c.Channel_Pwd = ?
      AND memberShip.Member_Ship = ?
    `;

    if (req?.brandIds && req?.brandIds.length > 0) {
      sqlStr += ` AND couponBrand.Brand_ID IN (${_brandIds})`;
    }

    sqlStr += ` AND (coupon.Reward_Rules = ? OR (coupon.Reward_Rules = ? && coupon.Birthday_Year = ? && coupon.Birthday_Month = ?))`;
    sqlStr += ` ORDER BY coupon.Create_Date DESC`;
    sqlStr += ` LIMIT ?, ?`;

    const result = await this.internalConn.query(sqlStr, [
      req?.channelPwd,
      req?.memberShipId,
      COUPON_REWARD_RULES_TYPE.POINT,
      COUPON_REWARD_RULES_TYPE.BIRTHDAY,
      req?.birthdayYear,
      req?.birthdayMonth,
      (req?.page - 1) * req?.perPage,
      req?.perPage
    ]);

    return result;
  }

  /**
   * 取得會員兌換券列表總筆數
   *
   * @param req
   * @returns
   */
  async getCouponSearchListCount(req: GetCouponSearchDto): Promise<number> {
    const _brandIds = this.internalConn.escape(req?.brandIds);

    let sqlStr = `
    SELECT
      COUNT(*) as couponSearchListCount
    FROM
      Coupon coupon
      JOIN Channel c ON coupon.Writeoff_Channel_ID = c.Channel_ID AND c.Is_Active = 1
      JOIN Coupon_Brand couponBrand ON coupon.Coupon_ID = couponBrand.Coupon_ID AND couponBrand.Is_Active = 1
      JOIN Coupon_Member_Ship memberShip ON coupon.Coupon_ID = memberShip.Coupon_ID AND memberShip.Is_Active = 1
    WHERE coupon.Is_Active = 1
      AND coupon.Release_Status = 1
      AND coupon.On_Sold_Start_Date <= NOW() AND coupon.On_Sold_End_Date >= NOW()
      AND c.Channel_Pwd = ?
      AND memberShip.Member_Ship = ?
    `;

    if (req?.brandIds && req?.brandIds.length > 0) {
      sqlStr += ` AND couponBrand.Brand_ID IN (${_brandIds})`;
    }

    sqlStr += ` AND (coupon.Reward_Rules = ? OR (coupon.Reward_Rules = ? && coupon.Birthday_Year = ? && coupon.Birthday_Month = ?))`;

    const result = await this.internalConn.query(sqlStr, [
      req?.channelPwd,
      req?.memberShipId,
      COUPON_REWARD_RULES_TYPE.POINT,
      COUPON_REWARD_RULES_TYPE.BIRTHDAY,
      req?.birthdayYear,
      req?.birthdayMonth
    ]);

    return result?.[0]?.couponSearchListCount;
  }

  /**
   * 新增兌換券詳細資料
   *
   * @param connection DB 連線
   * @param req
   * @returns
   */
  async insCouponDetail(connection, req: InsCouponDetailReq): Promise<number> {
    const addData = {
      Redeem_ID: req?.redeemId,
      Coupon_ID: req?.couponId,
      Cis_ID: req?.cisId,
      Reward_Card_ID: req?.rewardCardId,
      Transaction_ID: req?.transactionId,
      Transaction_Type: req?.transactionType,
      Transaction_Date: req?.transactionDate,
      Exchange_Point: req?.point,
      Exchange_Reward: req?.reward,
      Exchange_Member_ID: req?.memberId,
      Coupon_End_Date: req?.expiredDate,
      Transfer_Member_ID: req?.transferMemberId,
      Donor_Member_ID: req?.donorMemberId,
      Transfer_Date: req?.transferDate ? req?.transferDate : null,
      Writeoff_Store_ID: req?.writeoffStoreId ? req?.writeoffStoreId : null,
      Create_ID: req?.createId,
      Alter_ID: req?.alterId
    };

    const sqlStr = `
    INSERT INTO Coupon_Detail SET ?
    `;

    const result = await this.internalConn.transactionQuery(
      connection,
      sqlStr,
      [addData]
    );

    return result?.insertId;
  }

  /**
   * 核銷兌換券
   *
   * @param redeemIds 兌換券兌換編號(複數)
   * @param storeId 門市編號
   * @param transactionType 兌換券交易類型
   * @param transactionDate 核銷時間
   * @param authMemberId 後台人員編號
   * @returns
   */
  async writeOffCouponDetail(
    redeemIds: string[],
    storeId: string,
    transactionType: number,
    transactionDate: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _redeemIds = this.internalConn.escape(redeemIds);
    const sqlStr = `
    UPDATE Coupon_Detail SET
      Transaction_Type = ?,
      Writeoff_Date = ?,
      Writeoff_Store_ID = ?,
      Alter_ID = ?
    WHERE Redeem_ID IN (${_redeemIds})
    `;

    await this.internalConn.query(sqlStr, [
      transactionType,
      transactionDate,
      storeId,
      authMemberId
    ]);

    return {};
  }

  /**
   * 退貨兌換券
   *
   * @param connection DB 連線
   * @param transactionId 交易編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async refundCouponDetail(
    connection,
    transactionId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Coupon_Detail SET
      Exchange_Point = 0,
      Exchange_Reward = 0,
      Transaction_Type = ?,
      Return_Date = CURRENT_TIMESTAMP,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Transaction_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      MEMBER_COUPON_STATUS.RETURNED,
      authMemberId,
      transactionId
    ]);

    return {};
  }

  /**
   * 初始化發送兌換券關聯
   *
   * @param connection DB 連線
   * @param couponIds 兌換券編號(複數)
   * @param cisId 發送編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initCouponIssuanceMap(
    connection,
    couponIds: string[],
    cisId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _couponIds = this.internalConn.escape(couponIds);

    const sqlStr = `
    UPDATE Coupon_Issuance_Map SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Coupon_ID IN (${_couponIds})
      AND Cis_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      cisId
    ]);

    return {};
  }

  /**
   * 初始化發送會員關聯
   *
   * @param connection DB 連線
   * @param couponIds 兌換券編號(複數)
   * @param cisId 發送編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initCouponIssuanceMember(
    connection,
    couponIds: string[],
    cisId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _couponIds = this.internalConn.escape(couponIds);

    const sqlStr = `
    UPDATE Coupon_Issuance_Member SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Coupon_ID IN (${_couponIds})
      AND Cis_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      cisId
    ]);

    return {};
  }

  /**
   * 新增發送會員關聯
   *
   * @param connection DB 連線
   * @param couponIds 兌換券編號(複數)
   * @param cisId 發送編號
   * @param memberIds 會員編號(複數)
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insCouponIssuanceMember(
    connection,
    couponIds: string[],
    cisId: string,
    memberIds: string[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Coupon_Issuance_Member
    (Coupon_ID, Cis_ID, Member_ID, Create_ID, Alter_ID)
    VALUES
    `;
    let i = 0;
    const params = [];
    for (const couponId of couponIds) {
      for (const memberId of memberIds) {
        if (i >= 1) {
          sqlStr += `,`;
        }

        sqlStr += `(?, ?, ?, ?, ?)`;
        params.push(couponId, cisId, memberId, authMemberId, authMemberId);
        i++;
      }
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Is_Active = 1, Alter_ID = VALUES(Alter_ID)`;

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 依兌換券編號取得會員兌換券詳細資料
   *
   * @param redeemId 兌換券兌換編號
   * @returns
   */
  async getMemberCouponDetailByRedeemId(
    redeemId: string
  ): Promise<GetMemberCouponDetailByRedeemId> {
    const sqlStr = `
    SELECT
      couponDetail.Exchange_Member_ID as memberId,
      coupon.Coupon_ID as couponId,
      coupon.Coupon_Name as couponName,
      coupon.Coupon_Type as couponType,
      couponDetail.Redeem_ID as redeemId,
      couponDetail.Transaction_Type as transactionType,
      coupon.Reward_Rules as rewardRule,
      couponDetail.Coupon_End_Date as couponEndDate
    FROM
      Coupon coupon
      JOIN Coupon_Detail couponDetail ON coupon.Coupon_ID = couponDetail.Coupon_ID AND couponDetail.Is_Active = 1
    WHERE coupon.Is_Active = 1
      AND couponDetail.Redeem_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [redeemId]);

    return result?.[0];
  }

  /**
   * 取得集點卡 ID 最大值
   * @returns
   */
  async getMaxExchangeId(yearAndMonth: string): Promise<string> {
    const sqlStr = /* sql */ `
SELECT MAX(Order_ID) orderId FROM Member_Point_Log_${yearAndMonth}
WHERE Point_Type = ? OR Point_Type = ?
LIMIT 1`;

    const result = await this.internalConn.query(sqlStr, [
      ENUM_POINT_TYPE_LOG.DISCOUNT,
      ENUM_POINT_TYPE_LOG.COMMODITY
    ]);

    return result?.[0]?.orderId;
  }

  /**
   * 點數扣點
   * @param yearAndMonth YYYYMM
   * @param memberId 會員編號
   * @param transactionId 交易編號
   * @param memberPoint 會員點數
   * @param usedPoint 使用點數
   * @param memberPointLog 會員歷程
   */
  async deductPoint(
    yearAndMonth: string,
    memberId: string,
    transactionId: string,
    memberPoint: GetMemberPointResp[],
    usedPoint: UsedPoint[],
    memberPointLog: MemberPointLog
  ): Promise<Record<string, never>> {
    const _yearAndMonth = this.internalConn.escape(yearAndMonth);
    const _memberId = this.internalConn.escape(memberId);
    const _transactionId = this.internalConn.escape(transactionId);

    let sqlStr = /* sql */ `
-- 使用點數
INSERT INTO Member_Point_Used
(Member_ID, Exchange_ID, Used_Point, Expired_Date, Create_ID, Alter_ID)
VALUES`;
    usedPoint?.forEach((point, index) => {
      const _point = this.internalConn.escape(point?.point);
      const _expiredDate = this.internalConn.escape(point?.expiredDate);
      sqlStr += `
(${_memberId}, ${_transactionId}, ${_point}, ${_expiredDate}, 'system', 'system')${
        index === usedPoint?.length - 1 ? ';' : ','
      }`;
    });

    memberPoint.forEach((x) => {
      const _point = this.internalConn.escape(x?.point);
      const _expiredDate = this.internalConn.escape(x?.expiredDate);
      sqlStr += /* sql */ `
UPDATE Member_Point
SET Point = ${_point}, Alter_ID = 'system', Alter_Date = CURRENT_TIMESTAMP
WHERE Member_ID = ${_memberId} AND Expired_Date = ${_expiredDate};`;
    });

    sqlStr += /* sql */ `
-- 檢核 table，不存在新增
CALL CheckMemberPointLogTable(${_yearAndMonth});

-- 積點歷程 log
INSERT INTO Member_Point_Log_${yearAndMonth} SET ? ,Deduct_Date = CURRENT_TIMESTAMP`;

    await this.internalConn.query(sqlStr, [memberPointLog]);

    return {};
  }

  /**
   * 依多筆兌換券編號取得會員兌換券詳細資料
   *
   * @param redeemIds
   * @returns
   */
  async getMemberCouponDetailByRedeemIds(
    redeemIds: string[]
  ): Promise<GetMemberCouponDetailByRedeemId[]> {
    const _redeemIds = this.internalConn.escape(redeemIds);
    const sqlStr = `
    SELECT
      coupon.Coupon_ID as couponId,
      coupon.Coupon_Name as couponName,
      coupon.Coupon_Type as couponType,
      couponDetail.Redeem_ID as redeemId,
      couponDetail.Transaction_Type as transactionType
    FROM
      Coupon coupon
      JOIN Coupon_Detail couponDetail ON coupon.Coupon_ID = couponDetail.Coupon_ID AND couponDetail.Is_Active = 1
    WHERE coupon.Is_Active = 1
      AND couponDetail.Redeem_ID IN (${_redeemIds})
    `;

    const result = await this.internalConn.query(sqlStr);

    return result;
  }

  /**
   * 依交易序號取得會員兌換券詳細資料
   *
   * @param transactionId 交易編號
   * @returns
   */
  async getMemberCouponDetailByTransactionId(
    transactionId: string
  ): Promise<GetMemberCouponDetailByTransactionId> {
    const sqlStr = `
    SELECT
      coupon.Coupon_ID as couponId,
      coupon.Reward_Rules as rewardRule,
      coupon.On_Sold_Start_Date as startDate,
      coupon.On_Sold_End_Date as endDate,
      couponDetail.Exchange_Point as point,
      couponDetail.Exchange_Reward as reward,
      couponDetail.Exchange_Member_ID as memberId,
      couponDetail.Transaction_Type as transactionType,
      couponDetail.Donor_Member_ID as donorMemberId,
      couponDetail.Reward_Card_ID as rewardCardId
    FROM
      Coupon coupon
      JOIN Coupon_Detail couponDetail ON coupon.Coupon_ID = couponDetail.Coupon_ID AND couponDetail.Is_Active = 1
    WHERE coupon.Is_Active = 1
      AND couponDetail.Transaction_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [transactionId]);

    return result?.[0];
  }

  /**
   * 取得會員兌換券明細列表
   *
   * @param req
   * @returns
   */
  async getMemberCouponDetailList(
    req: GetMemberCouponDetailListDto
  ): Promise<MemberCouponDetailList[]> {
    let sqlStr = `
    SELECT DISTINCT
      coupon.Coupon_ID as couponId,
      IFNULL((SELECT Channel_Name FROM Channel WHERE Channel_ID = coupon.Writeoff_Channel_ID AND Is_Active = 1), '') as channelName,
      coupon.Reward_Rules as rewardRule,
      coupon.Coupon_Name as couponName,
      couponDetail.Transaction_Type as transactionType,
      couponDetail.Exchange_Point as point,
      couponDetail.Exchange_Reward as reward,
      couponDetail.Coupon_End_Date as couponEndDate,
      couponDetail.Transfer_Date as transferDate,
      couponDetail.Writeoff_Date as writeOffDate,
      couponDetail.Return_Date as returnDate,
      IFNULL((SELECT Store_Name FROM Store WHERE Store_ID = couponDetail.Writeoff_Store_ID), '') as writeOffStoreName,
      couponDetail.Transaction_Date as transactionDate,
      couponDetail.Transaction_ID as transactionId,
      IFNULL((SELECT Member_CardID FROM IEat_Member WHERE Member_ID = couponDetail.Transfer_Member_ID), '') as transferMemberCardId
    FROM
      Coupon_Detail couponDetail
      JOIN Coupon coupon ON couponDetail.Coupon_ID = coupon.Coupon_ID AND coupon.Is_Active = 1
      JOIN Coupon_Brand couponBrand ON couponDetail.Coupon_ID = couponBrand.Coupon_ID AND couponBrand.Is_Active = 1
    WHERE couponDetail.Is_Active = 1
      AND couponDetail.Exchange_Member_ID = ?
    `;

    const params = [];
    params.push(req?.memberId);
    if (req?.couponType > 0) {
      sqlStr += ` AND coupon.Coupon_Type = ?`;
      params.push(req?.couponType);
    }

    if (req?.channelId) {
      sqlStr += ` AND coupon.Writeoff_Channel_ID = ?`;
      params.push(req?.channelId);
    }

    if (req?.rewardRule > 0) {
      sqlStr += ` AND coupon.Reward_Rules = ?`;
      params.push(req?.rewardRule);
    }

    if (req?.brandId) {
      sqlStr += ` AND couponBrand.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    switch (req?.state) {
      case MEMBER_DETAIL_COUPON_STATUS.VALID:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        sqlStr += ` AND couponDetail.Coupon_End_Date > NOW()`;
        params.push(MEMBER_COUPON_STATUS.RECEIVED);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.REDEEMED:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.VERIFIED);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.EXPIRED:
        sqlStr += ` AND couponDetail.Transaction_Type = ? AND couponDetail.Coupon_End_Date <= ? `;
        params.push(MEMBER_COUPON_STATUS.RECEIVED, now);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.TRANSFERRED:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.TRANSFERRED);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.RETURNED:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.RETURNED);
        break;
      default:
        sqlStr += ` AND couponDetail.Transaction_Type > 0`;
    }

    if (req?.transactionStartDate && req?.transactionEndDate) {
      sqlStr += ` AND couponDetail.Transaction_Date >= ? AND couponDetail.Transaction_Date <= ?`;
      params.push(req?.transactionStartDate, req?.transactionEndDate);
    }

    sqlStr += ` ORDER BY couponDetail.Transaction_Date DESC`;
    sqlStr += ` LIMIT ?, ?`;
    params.push((req?.page - 1) * req?.perPage, req?.perPage);

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 取得會員兌換券明細列表總筆數
   *
   * @param req
   * @returns
   */
  async getMemberCouponDetailListCount(
    req: GetMemberCouponDetailListDto
  ): Promise<number> {
    let sqlStr = `
    SELECT
      COUNT(DISTINCT couponDetail.ID) as couponListCount
    FROM
      Coupon_Detail couponDetail
      JOIN Coupon coupon ON couponDetail.Coupon_ID = coupon.Coupon_ID AND coupon.Is_Active = 1
      JOIN Coupon_Brand couponBrand ON couponDetail.Coupon_ID = couponBrand.Coupon_ID AND couponBrand.Is_Active = 1
    WHERE couponDetail.Is_Active = 1
      AND couponDetail.Exchange_Member_ID = ?
    `;
    const params = [];
    params.push(req?.memberId);
    if (req?.couponType > 0) {
      sqlStr += ` AND coupon.Coupon_Type = ?`;
      params.push(req?.couponType);
    }

    if (req?.channelId) {
      sqlStr += ` AND coupon.Writeoff_Channel_ID = ?`;
      params.push(req?.channelId);
    }

    if (req?.rewardRule > 0) {
      sqlStr += ` AND coupon.Reward_Rules = ?`;
      params.push(req?.rewardRule);
    }

    if (req?.brandId) {
      sqlStr += ` AND couponBrand.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    switch (req?.state) {
      case MEMBER_DETAIL_COUPON_STATUS.VALID:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.RECEIVED);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.REDEEMED:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.VERIFIED);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.EXPIRED:
        sqlStr += ` AND couponDetail.Transaction_Type = ? AND couponDetail.Coupon_End_Date <= ? `;
        params.push(MEMBER_COUPON_STATUS.RECEIVED, now);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.TRANSFERRED:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.TRANSFERRED);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.RETURNED:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.RETURNED);
        break;
      default:
        sqlStr += ` AND couponDetail.Transaction_Type > 0`;
    }

    if (req?.transactionStartDate && req?.transactionEndDate) {
      sqlStr += ` AND couponDetail.Transaction_Date >= ? AND couponDetail.Transaction_Date <= ?`;
      params.push(req?.transactionStartDate, req?.transactionEndDate);
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.couponListCount;
  }

  /**
   * 取得會員兌換券狀態數量
   *
   * @param memberId 會員編號
   * @param couponType 兌換券類型 優惠券/商品券
   * @returns
   */
  async getMemberCouponStatusCount(
    memberId: string,
    couponType: number
  ): Promise<GetMemberCouponStatusCountResp[]> {
    let sqlStr = `
    SELECT
      couponDetail.Transaction_Type as transactionType,
      IF(couponDetail.Coupon_End_Date < NOW(), 1, 0) as isExpired,
      COUNT(*) as couponDetailCount
    FROM
      Coupon_Detail couponDetail
      JOIN Coupon coupon ON couponDetail.Coupon_ID = coupon.Coupon_ID AND coupon.Is_Active = 1
    WHERE couponDetail.Is_Active = 1
      AND couponDetail.Exchange_Member_ID = ?
    `;

    const params = [];
    params.push(memberId);
    if (couponType > 0) {
      sqlStr += ` AND coupon.Coupon_Type = ?`;
      params.push(couponType);
    }

    sqlStr += ` AND couponDetail.Transaction_Type > 0`;
    sqlStr += ` GROUP BY couponDetail.Transaction_Type, IF(couponDetail.Coupon_End_Date < NOW(), 1, 0)`;

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 取捯兌換券明細列表
   *
   * @param req
   * @returns
   */
  async getCouponDetailList(
    req: GetCouponDetailListDto
  ): Promise<CouponDetailList[]> {
    let sqlStr = `
    SELECT DISTINCT
      coupon.Coupon_ID as couponId,
      channel.Channel_Name as channelName,
      coupon.Reward_Rules as rewardRule,
      coupon.Coupon_Name as couponName,
      couponDetail.Redeem_ID as redeemId,
      couponDetail.Transaction_Type as transactionType,
      couponDetail.Exchange_Point as point,
      couponDetail.Exchange_Reward as reward,
      members.Member_Name as memberName,
      members.Member_CardID as memberCardId,
      members.Mobile_Country_Code as mobileCountryCode,
      members.Mobile as mobile,
      couponDetail.Coupon_End_Date as couponEndDate,
      couponDetail.Transfer_Date as transferDate,
      couponDetail.Writeoff_Date as writeOffDate,
      couponDetail.Return_Date as returnDate,
      IFNULL((SELECT Store_Name FROM Store WHERE Store_ID = couponDetail.Writeoff_Store_ID), '') as writeOffStoreName,
      couponDetail.Transaction_Date as transactionDate,
      couponDetail.Transaction_ID as transactionId,
      IFNULL((SELECT Member_CardID FROM IEat_Member WHERE Member_ID = couponDetail.Transfer_Member_ID), '') as transferMemberCardId
    FROM
      Coupon_Detail couponDetail USE INDEX(Transaction_Date_IDX)
      JOIN Coupon coupon ON couponDetail.Coupon_ID = coupon.Coupon_ID AND coupon.Is_Active = 1
      JOIN Coupon_Brand couponBrand ON couponDetail.Coupon_ID = couponBrand.Coupon_ID AND couponBrand.Is_Active = 1
      JOIN IEat_Member members ON couponDetail.Exchange_Member_ID = members.Member_ID AND members.Is_Active = 1
      JOIN Channel channel ON coupon.Writeoff_Channel_ID = channel.Channel_ID AND channel.Is_Active = 1
    WHERE couponDetail.Is_Active = 1
    `;

    const params = [];
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MOBILE:
          sqlStr += ` AND members.Mobile = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.MEMBER_CARD:
          sqlStr += ` AND members.Member_CardID = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.COUPON_NAME:
          sqlStr += ` AND coupon.Coupon_Name = ?`;
          params.push(req?.search);
          break;
      }
    }

    if (req?.couponType > 0) {
      sqlStr += ` AND coupon.Coupon_Type = ?`;
      params.push(req?.couponType);
    }

    if (req?.channelId) {
      sqlStr += ` AND channel.Channel_ID = ?`;
      params.push(req?.channelId);
    }

    if (req?.rewardRule > 0) {
      sqlStr += ` AND coupon.Reward_Rules = ?`;
      params.push(req?.rewardRule);
    }

    if (req?.brandId) {
      sqlStr += ` AND couponBrand.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    switch (req?.state) {
      case MEMBER_DETAIL_COUPON_STATUS.VALID:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        sqlStr += ` AND couponDetail.Coupon_End_Date > NOW()`;
        params.push(MEMBER_COUPON_STATUS.RECEIVED);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.REDEEMED:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.VERIFIED);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.EXPIRED:
        sqlStr += ` AND couponDetail.Transaction_Type = ? AND couponDetail.Coupon_End_Date <= ? `;
        params.push(MEMBER_COUPON_STATUS.RECEIVED, now);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.TRANSFERRED:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.TRANSFERRED);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.RETURNED:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.RETURNED);
        break;
      default:
        sqlStr += ` AND couponDetail.Transaction_Type > 0`;
    }

    if (req?.transactionStartDate && req?.transactionEndDate) {
      sqlStr += ` AND couponDetail.Transaction_Date >= ? AND couponDetail.Transaction_Date <= ?`;
      params.push(req?.transactionStartDate, req?.transactionEndDate);
    }

    if (req?.writeOffStartDate && req?.writeOffEndDate) {
      sqlStr += ` AND couponDetail.Writeoff_Date >= ? AND couponDetail.Writeoff_Date <= ?`;
      params.push(req?.writeOffStartDate, req?.writeOffEndDate);
    }

    sqlStr += ` ORDER BY couponDetail.Transaction_Date DESC`;
    sqlStr += ` LIMIT ?, ?`;
    params.push((req?.page - 1) * req?.perPage, req?.perPage);

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 取捯兌換券明細列表總筆數
   *
   * @param req
   * @returns
   */
  async getCouponDetailListCount(req: GetCouponDetailListDto): Promise<number> {
    const tableName = `Temp_${ruuidv4().replace(/-/g, '_')}`;

    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      couponId varchar(22) NOT NULL,
      INDEX(couponId)
    );

    INSERT INTO ${tableName} (couponId)
      SELECT DISTINCT
        coupon.Coupon_ID as couponId
      FROM
        Coupon coupon
        INNER JOIN Coupon_Brand couponBrand ON coupon.Coupon_ID = couponBrand.Coupon_ID AND couponBrand.Is_Active = 1
        INNER JOIN Channel channel ON coupon.Writeoff_Channel_ID = channel.Channel_ID AND channel.Is_Active = 1
      WHERE coupon.Is_Active = 1
    `;
    const params = [];

    if (req?.couponType > 0) {
      sqlStr += ` AND coupon.Coupon_Type = ?`;
      params.push(req?.couponType);
    }

    if (req?.channelId) {
      sqlStr += ` AND coupon.Writeoff_Channel_ID = ?`;
      params.push(req?.channelId);
    }

    if (req?.rewardRule > 0) {
      sqlStr += ` AND coupon.Reward_Rules = ?`;
      params.push(req?.rewardRule);
    }

    if (req?.brandId) {
      sqlStr += ` AND couponBrand.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    sqlStr += `;`;

    sqlStr += `
    SELECT
      COUNT(couponDetail.ID) as couponDetailCount
    FROM
      Coupon_Detail couponDetail
      INNER JOIN ${tableName} temp ON couponDetail.Coupon_ID = temp.couponId
      INNER JOIN IEat_Member members ON couponDetail.Exchange_Member_ID = members.Member_ID AND members.Is_Active = 1
    WHERE couponDetail.Is_Active = 1
    `;

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MOBILE:
          sqlStr += ` AND members.Mobile = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.MEMBER_CARD:
          sqlStr += ` AND members.Member_CardID = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.COUPON_NAME:
          sqlStr += ` AND coupon.Coupon_Name = ?`;
          params.push(req?.search);
          break;
      }
    }

    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    switch (req?.state) {
      case MEMBER_DETAIL_COUPON_STATUS.VALID:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        sqlStr += ` AND couponDetail.Coupon_End_Date > NOW()`;
        params.push(MEMBER_COUPON_STATUS.RECEIVED);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.REDEEMED:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.VERIFIED);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.EXPIRED:
        sqlStr += ` AND couponDetail.Transaction_Type = ? AND couponDetail.Coupon_End_Date <= ? `;
        params.push(MEMBER_COUPON_STATUS.RECEIVED, now);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.TRANSFERRED:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.TRANSFERRED);
        break;
      case MEMBER_DETAIL_COUPON_STATUS.RETURNED:
        sqlStr += ` AND couponDetail.Transaction_Type = ?`;
        params.push(MEMBER_COUPON_STATUS.RETURNED);
        break;
      default:
        sqlStr += ` AND couponDetail.Transaction_Type > 0`;
    }

    if (req?.transactionStartDate && req?.transactionEndDate) {
      sqlStr += ` AND couponDetail.Transaction_Date >= ? AND couponDetail.Transaction_Date <= ?`;
      params.push(req?.transactionStartDate, req?.transactionEndDate);
    }

    if (req?.writeOffStartDate && req?.writeOffEndDate) {
      sqlStr += ` AND couponDetail.Writeoff_Date >= ? AND couponDetail.Writeoff_Date <= ?`;
      params.push(req?.writeOffStartDate, req?.writeOffEndDate);
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[2]?.[0]?.couponDetailCount;
  }

  /**
   * 取得入會禮
   * @param settingId 啟用中的會籍設定
   */
  async getRegisterCoupon(settingId: string): Promise<GetRegisterCouponResp[]> {
    const queryStr = /* sql */ `
    SELECT
      gift.Coupon_ID couponId,
      coupon.Coupon_Rule couponRule,
      coupon.Earliest_Pickup_Date earliestPickupDate,
      Redemption_End_Date couponEndDate
    FROM
      IEat_Member_Ship_NGift gift
    INNER JOIN Coupon coupon ON coupon.Coupon_ID = gift.Coupon_ID AND coupon.Is_Active = 1
    WHERE Member_Ship_ID = ?
    `;

    const result = (await this.internalConn.query(queryStr, [settingId])) ?? [];

    return result;
  }

  /**
   * 發送入會禮
   * @returns
   */
  async sendRegisterCoupon(
    params: SendRegisterCouponReq[]
  ): Promise<Record<string, never>> {
    if (!params?.length) return;

    let couponIssuanceMemberQuery = /* sql */ `
      INSERT INTO Coupon_Issuance_Member
      (Coupon_ID, Cis_ID, Member_ID, Create_ID, Alter_ID)
      VALUES
    `;

    let couponIssuanceMapQuery = /* sql */ `
      INSERT INTO Coupon_Issuance_Map
      (Coupon_ID, Cis_ID, Create_ID, Alter_ID)
      VALUES
    `;

    let couponDetailQuery = /* sql */ `
      INSERT INTO Coupon_Detail
      (Redeem_ID, Exchange_Member_ID, Coupon_ID, Transaction_ID, Transaction_Type, Transaction_Date, Coupon_End_Date, Create_ID, Alter_ID)
      VALUES
    `;
    const queryParams = [];
    const couponIssuanceMemberParams = [];
    const couponIssuanceMapParams = [];
    const couponDatailParams = [];

    params?.forEach((param, index) => {
      if (index >= 1) couponIssuanceMemberQuery += `,`;
      couponIssuanceMemberQuery += ` (?, ?, ?, ?, ?)`;
      if (index === params?.length - 1) couponIssuanceMemberQuery += `;`;

      if (index >= 1) couponIssuanceMapQuery += `,`;
      couponIssuanceMapQuery += ` (?, ?, ?, ?)`;
      if (index === params?.length - 1) couponIssuanceMapQuery += `;`;

      if (index >= 1) couponDetailQuery += `,`;
      couponDetailQuery += ` (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?)`;
      if (index === params?.length - 1) couponDetailQuery += `;`;

      couponIssuanceMemberParams.push(
        param?.couponId,
        param?.sendId,
        param?.memberId,
        'system',
        'system'
      );
      couponIssuanceMapParams.push(
        param?.couponId,
        param?.sendId,
        'system',
        'system'
      );
      couponDatailParams.push(
        param?.redeemId,
        param?.memberId,
        param?.couponId,
        param?.transactionId,
        1,
        param?.expiredDate,
        'system',
        'system'
      );
    });

    couponIssuanceMemberParams.forEach((x) => queryParams.push(x));
    couponIssuanceMapParams.forEach((x) => queryParams.push(x));
    couponDatailParams.forEach((x) => queryParams.push(x));

    const queryStr = `${couponIssuanceMemberQuery}${couponIssuanceMapQuery}${couponDetailQuery}`;

    await this.internalConn.query(queryStr, queryParams);

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
