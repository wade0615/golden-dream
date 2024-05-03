import { Injectable } from '@nestjs/common';
import { MENU_STATE } from 'src/Definition';
import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import { ENUM_EC_VOUCHER_STATE } from 'src/Definition/Enum/Member/ec.voucher.state.enum';
import { GetMemberListDto } from 'src/Models/V1/Member/Dto/get.member.list.dto';
import { GetMemberDetailDaoResp } from 'src/Models/V1/Member/Interface/get.member.detail.interface';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { BonusHistory, GetBonusHistoryDto } from './Dto/get.bonus.history.dto';
import { GetMemberBookingLogDto } from './Dto/get.member.booking.log.dto';
import { GetMemberEcVoucherLogDto } from './Dto/get.member.ec.voucher.log.dto';
import { GetMemberPointLogDto } from './Dto/get.member.point.log.dto';
import { GetMemberShipLogDto } from './Dto/get.member.ship.log.dto';
import { GetMemberSpecialListResp } from './Dto/get.member.special.list.dto';
import {
  ConsumptionElectronicCoupon,
  OverviewAnalysisConsumptionDetail
} from './Dto/get.overview.analysis.dto';
import { GetEcVoucherInfoResp } from './Interface/get.ec.voucher.info.interface';
import { GetMemberBonusFromDBResp } from './Interface/get.member.bonus.interface';
import { GetMemberBookingInfoResp } from './Interface/get.member.booking.info.interface';
import { GetMemberBookingLogInfoResp } from './Interface/get.member.booking.log.info.interface';
import { GetMemberEcVoucherInfoResp } from './Interface/get.member.ec.voucher.info.interface';
import { GetMemberEcVoucherLogInfoResp } from './Interface/get.member.ec.voucher.log.info.interface';
import { GetMemberListInterface } from './Interface/get.member.list.interface';
import { GetMemberShipInfoResp } from './Interface/get.member.ship.info.interface';
import { GetMemberShipLogInfoResp } from './Interface/get.member.ship.log.info.interface';
import { GetMemberSpecialTypeResp } from './Interface/get.member.special.type.interface';
import { GetPointBasicSettingResp } from './Interface/get.point.basic.setting.interface';
import { GetPointLogInfoResp } from './Interface/get.point.log.info.interface';
import { GetTempCsvMemberIdResp } from './Interface/get.temp.csv.member.id.interface';
const fs = require('fs');

/**
 *
 * @class
 */
@Injectable()
export class MemberRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得會員列表
   *
   * @param req
   * @returns
   */
  async getMemberList(
    req: GetMemberListDto
  ): Promise<GetMemberListInterface[]> {
    const _search = this.internalConn.escape(req?.search);
    const _startDate = this.internalConn.escape(req?.startDate);
    const _endDate = this.internalConn.escape(req?.endDate);
    const _memberSpecialType = this.internalConn.escape(req?.memberSpecialType);
    const _membershipStatus = this.internalConn.escape(req?.membershipStatus);
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);

    let sqlStr = `
    SELECT
      member.Member_ID as memberId,
      member.Member_CardID as memberCardId,
      member.Member_Name as memberName,
      member.Mobile_Country_Code as mobileCountryCode,
      member.Mobile as phone,
      member.Birthday as birthday,
      member.Create_Date as registerTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = member.Alter_ID), 'system') as alterName,
      member.Alter_Date as alterTime,
      member.Membership_Status as memberShipBranchId,
      IF(member.Is_Active = 1, 0, 1) as isDelete
    FROM
      IEat_Member member
    WHERE 1
    `;

    // 精準搜尋
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MOBILE:
          sqlStr += ` AND member.Mobile = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.MEMBER_CARD:
          sqlStr += ` AND member.Member_CardID = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.MEMBER_NAME:
          sqlStr += ` AND member.Member_Name = ${_search}`;
          break;
      }
    }

    // 特殊會員類型
    if (req?.memberSpecialType) {
      sqlStr += ` AND member.Member_Special_Type = ${_memberSpecialType}`;
    }

    // 會籍
    if (req?.membershipStatus) {
      sqlStr += ` AND member.Membership_Status = ${_membershipStatus}`;
    }

    // 註冊時間
    if (req?.startDate && req?.endDate) {
      sqlStr += ` AND member.Create_Date >= ${_startDate} && member.Create_Date <= ${_endDate}`;
    }

    sqlStr += ` ORDER BY member.Create_Date DESC`;
    sqlStr += ` LIMIT ${_start}, ${_limit}`;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得會員列表總數量
   *
   * @param req
   * @returns
   */
  async getMemberListCount(req: GetMemberListDto): Promise<number> {
    const _search = this.internalConn.escape(req?.search);
    const _startDate = this.internalConn.escape(req?.startDate);
    const _endDate = this.internalConn.escape(req?.endDate);
    const _memberSpecialType = this.internalConn.escape(req?.memberSpecialType);
    const _membershipStatus = this.internalConn.escape(req?.membershipStatus);
    const _memberIds = this.internalConn.escape(req?.memberIds);

    let sqlStr = `
    SELECT
      COUNT(Member_ID) as memberCount
    FROM
      IEat_Member
    WHERE 1
    `;

    // 精準搜尋
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MOBILE:
          sqlStr += ` AND Mobile = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.MEMBER_CARD:
          sqlStr += ` AND Member_CardID = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.MEMBER_NAME:
          sqlStr += ` AND Member_Name = ${_search}`;
          break;
      }
    }

    // 特殊會員類型
    if (req?.memberSpecialType) {
      sqlStr += ` AND Member_Special_Type = ${_memberSpecialType}`;
    }

    // 會籍
    if (req?.membershipStatus) {
      sqlStr += ` AND Membership_Status = ${_membershipStatus}`;
    }

    // 註冊時間
    if (req?.startDate && req?.endDate) {
      sqlStr += ` AND Create_Date >= ${_startDate} AND Create_Date <= ${_endDate}`;
    }

    // 指定會員
    if (req?.memberIds?.length > 0) {
      sqlStr += ` AND Member_ID IN (${_memberIds})`;
    }

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result?.[0]?.memberCount;
  }

  /**
   * 依會員編號取得會員詳細資料
   *
   * @param memberId
   * @returns
   */
  async getMemberDetailByMemberId(
    memberId: string
  ): Promise<GetMemberDetailDaoResp> {
    const sqlStr = `
    SELECT
      Member_ID as id,
      Member_Name as name,
      Member_CardID as cardNumber,
      Birthday as birthday,
      Gender as gender,
      Email as gmail,
      Referrer_Member as recommenderMemberId,
      Create_Date as createTime,
      Referrer_Code as referralCode,
      City_Code as cityCode,
      Zip_Code as zipCode,
      Address as address,
      Tel_Number as homePhone,
      Invoice_Carrier as carriersKey,
      Member_Remark as remark,
      Mobile as mobile,
      Mobile_Country_Code as mobileCountryCode,
      Membership_Status as membershipStatus,
      Member_Special_Type as spacialType
    FROM
      IEat_Member
    WHERE Member_ID = ?
    AND Is_Active = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [memberId])) ?? [];

    return result?.[0];
  }

  /**
   * 依手機號碼取得會員詳細資料
   *
   * @param mobileCountryCode
   * @param mobile
   * @returns
   */
  async getMemberDetailByMobile(
    mobileCountryCode: string,
    mobile: string
  ): Promise<GetMemberDetailDaoResp> {
    const sqlStr = `
    SELECT
      Member_ID as id,
      Member_Name as name,
      Member_CardID as cardNumber,
      Birthday as birthday,
      Gender as gender,
      Email as gmail,
      Referrer_Member as recommenderMemberId,
      Create_Date as createTime,
      Referrer_Code as referralCode,
      City_Code as cityCode,
      Zip_Code as zipCode,
      Address as address,
      Tel_Number as homePhone,
      Invoice_Carrier as carriersKey,
      Member_Remark as remark,
      Mobile as mobile,
      Mobile_Country_Code as mobileCountryCode,
      Membership_Status as membershipStatus,
      Member_Special_Type as spacialType
    FROM
      IEat_Member
    WHERE Mobile_Country_Code = ?
      AND Mobile = ?
      AND Is_Active = 1
    LIMIT 1
    `;
    const result =
      (await this.internalConn.query(sqlStr, [mobileCountryCode, mobile])) ??
      [];

    return result?.[0];
  }

  /**
   * 依推薦碼查詢使用者資料
   *
   * @param inviteCode  推薦碼
   * @returns
   */
  async getMemberDetailByInviteCode(
    inviteCode: string
  ): Promise<GetMemberDetailDaoResp> {
    const queryStr = `
      SELECT
        Member_ID as id,
        Member_Name as name,
        Member_CardID as cardNumber,
        Birthday as birthday,
        Gender as gender,
        Email as gmail,
        Referrer_Member as recommenderMemberId,
        Create_Date as createTime,
        Referrer_Code as referralCode,
        City_Code as cityCode,
        Zip_Code as zipCode,
        Address as address,
        Tel_Number as homePhone,
        Invoice_Carrier as carriersKey,
        Member_Remark as remark,
        Mobile as mobile,
        Mobile_Country_Code as mobileCountryCode,
        Membership_Status as membershipStatus,
        Member_Special_Type as spacialType
      FROM
        IEat_Member
      WHERE Referrer_Code = ?
        AND Is_Active = 1
      LIMIT 1
    `;

    const result =
      (await this.internalConn.query(queryStr, [inviteCode])) ?? [];

    return result?.[0];
  }

  /**
   * 取得特殊會員類型列表
   *
   * @returns
   */
  async getMemberSpecialList(
    state: string
  ): Promise<GetMemberSpecialListResp[]> {
    let sqlStr = `
    SELECT
      memberSpecialType.ID as specialId,
      memberSpecialType.Type_Name as typeName,
      memberSpecialType.Sort_Order as sortOrder,
      memberSpecialType.Earn_Points as isEarnPoints,
      memberSpecialType.Promote_Rank as isPromoteRank,
      memberSpecialType.Special_Type_Status as state,
      memberSpecialType.Create_Date as createTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = memberSpecialType.Create_ID), 'system') as createName,
      memberSpecialType.Alter_Date as alterTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = memberSpecialType.Alter_ID), 'system') as alterName
    FROM
      IEat_Member_Special_Type memberSpecialType
    WHERE memberSpecialType.Is_Active = 1
    `;

    switch (state) {
      case MENU_STATE.OPEN:
        sqlStr += ` AND memberSpecialType.Special_Type_Status = 1`;
        break;
      case MENU_STATE.CLOSE:
        sqlStr += ` AND memberSpecialType.Special_Type_Status = 0`;
        break;
    }

    sqlStr += ` ORDER BY memberSpecialType.Sort_Order ASC`;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得會員特殊類型詳細資料
   *
   * @param id
   * @returns
   */
  async getMemberSpecialDetail(id: number): Promise<GetMemberSpecialTypeResp> {
    const sqlStr = `
    SELECT
      Type_Name as name
    FROM
      IEat_Member_Special_Type
    WHERE ID = ?
      AND Is_Active = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [id])) ?? [];

    return result?.[0];
  }

  /**
   * 依特殊會員名稱取得會員特殊類型詳細資料
   *
   * @param name
   * @returns
   */
  async getMemberSpecialDetailByName(
    name: string
  ): Promise<GetMemberSpecialTypeResp> {
    const sqlStr = `
    SELECT
      ID as id,
      Type_Name as name
    FROM
      IEat_Member_Special_Type
    WHERE Is_Active = 1
      AND Type_Name = ?
    `;

    const result = (await this.internalConn.query(sqlStr, [name])) ?? [];

    return result?.[0];
  }

  /**
   * 新增會員特殊類型詳細資料
   *
   * @param typeName
   * @param isEarnPoints
   * @param isPromoteRank
   * @param state
   * @param memberId
   * @returns
   */
  async insMemberSpecialTypeDetail(
    typeName: string,
    isEarnPoints: boolean,
    isPromoteRank: boolean,
    state: boolean,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const insData = {
      Type_Name: typeName,
      Earn_Points: isEarnPoints,
      Promote_Rank: isPromoteRank,
      Special_Type_Status: state,
      Sort_Order: 1,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `
    UPDATE IEat_Member_Special_Type SET Sort_Order = Sort_Order + 1;

    INSERT INTO IEat_Member_Special_Type SET ? ;
    `;
    await this.internalConn.query(sqlStr, [insData]);

    return {};
  }

  /**
   * 修改特殊會員類型詳細資料
   *
   * @param specialId
   * @param typeName
   * @param isEarnPoints
   * @param isPromoteRank
   * @param state
   * @param memberId
   * @returns
   */
  async updMemberSpecialDetail(
    specialId: number,
    typeName: string,
    isEarnPoints: boolean,
    isPromoteRank: boolean,
    state: boolean,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE IEat_Member_Special_Type SET
      Type_Name = ?,
      Earn_Points = ?,
      Promote_Rank = ?,
      Special_Type_Status = ?,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE ID = ?
    `;

    await this.internalConn.query(sqlStr, [
      typeName,
      isEarnPoints,
      isPromoteRank,
      state,
      authMemberId,
      specialId
    ]);

    return {};
  }

  /**
   * 修改特殊會員類型順序
   *
   * @param connection
   * @param specialId
   * @param rank
   * @returns
   */
  async updMemberSpecialRank(
    connection,
    specialId: number,
    rank: number
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE IEat_Member_Special_Type SET
      Sort_Order = ?
    WHERE ID = ?`;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      rank,
      specialId
    ]);

    return {};
  }

  /**
   * 刪除特殊會員類型資料
   *
   * @param connection
   * @param specialId
   * @returns
   */
  async delMemberSpecialDetail(
    connection,
    specialId: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE IEat_Member_Special_Type SET
      Is_Active = 0,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      specialId
    ]);

    return {};
  }

  /**
   * 更新會員特殊類型
   *
   * @param connection
   * @param tableName
   * @param csvSql
   * @param specialType
   * @param authMemberId
   * @returns
   */
  async updMemberSpecialType(
    connection,
    tableName: string,
    csvSql: string,
    specialType: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    ${csvSql}

    UPDATE
      IEat_Member member
      INNER JOIN ${tableName} temp ON member.Mobile_Country_Code = temp.Mobile_Country_Code AND member.Mobile = temp.Mobile
    SET
      member.Member_Special_Type = ?,
      member.Alter_Date = CURRENT_TIMESTAMP,
      member.Alter_ID = ?
    WHERE member.Is_Active = 1
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      specialType,
      authMemberId
    ]);

    return {};
  }

  /**
   * 依照會員特殊類型ID修改會員特殊類型
   *
   * @param connection
   * @param specialId
   * @param specialType
   * @returns
   */
  async updMemberSpecialTypeById(
    connection,
    specialId: number,
    specialType: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE IEat_Member SET
      Member_Special_Type = ?,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Is_Active = 1
      AND Member_Special_Type = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      specialType,
      authMemberId,
      specialId
    ]);

    return {};
  }

  /**
   * 依推薦碼取得詳細資料
   *
   * @param referralCode
   * @returns
   */
  async getMemberDetailByReferrerCode(
    referralCode: string
  ): Promise<GetMemberDetailDaoResp> {
    const sqlStr = `
    SELECT
      Member_ID as id,
      Member_Name as name,
      Member_CardID as cardNumber,
      Birthday as birthday,
      Gender as gender,
      Email as gmail,
      Referrer_Member as recommenderMemberId,
      Create_Date as createTime,
      Referrer_Code as referralCode,
      City_Code as cityCode,
      Zip_Code as zipCode,
      Address as address,
      Tel_Number as homePhone,
      Invoice_Carrier as carriersKey,
      Member_Remark as remark,
      Mobile as mobile,
      Mobile_Country_Code as mobileCountryCode,
      Membership_Status as membershipStatus,
      Member_Special_Type as spacialType
    FROM
      IEat_Member
    WHERE Is_Active = 1
      AND Referrer_Code = ?
    LIMIT 1
    `;
    const result =
      (await this.internalConn.query(sqlStr, [referralCode])) ?? [];

    return result?.[0];
  }

  /**
   * 取得積點基本設定
   */
  async getPointBasicSetting(): Promise<GetPointBasicSettingResp> {
    const queryStr = /* sql */ `
SELECT  pm.Expiry_Day expiryDay,
        pm.Expiry_Month expiryMonth,
        pm.Expiry_Date expiryDate
FROM Point_Management pm`;

    const result = (await this.internalConn.query(queryStr)) ?? [];

    return result?.[0];
  }

  /**
   * 取得會員資訊＆點數資訊
   * @param memberId
   * @param pointStartDate
   * @param pointEndDate
   * @param lastDay
   */
  async getMemberInfoAndPoint(
    memberId: string,
    pointStartDate: string,
    pointEndDate: string,
    lastDay: string
  ): Promise<{
    name: string;
    usedPoint: number;
    canUsePoint: number;
    expiringPoint: number;
  }> {
    const _memberId = this.internalConn.escape(memberId);
    const _pointStartDate = this.internalConn.escape(pointStartDate);
    const _pointEndDate = this.internalConn.escape(pointEndDate);
    const _lastDay = this.internalConn.escape(lastDay);

    const queryStr = /* sql */ `
SELECT  im.Member_Name name,
        IFNULL(SUM(mpu.Used_Point),0) usedPoint,
        IFNULL(mp.Point,0) canUsePoint,
        IFNULL(mp1.Point,0) expiringPoint
FROM IEat_Member im
LEFT JOIN IEat_Member_Special_Type imst ON imst.ID = im.Member_Special_Type
INNER JOIN IEat_Member_Ship_Branch imsb ON imsb.Member_Ship_Branch_ID = im.Membership_Status
-- 前一年度新積點起始日 (例:2022/5/1起) 至 本年度積點到期日間(例:2023/4/30止) 使用的積點
LEFT JOIN Member_Point_Used mpu ON mpu.Member_ID = im.Member_ID AND mpu.Create_Date >= ${_pointStartDate} AND mpu.Create_Date <= ${_pointEndDate} AND mpu.Is_Active = 1
-- 截至前一日的可使用積點
LEFT JOIN (SELECT SUM(Point) Point, Member_ID FROM Member_Point WHERE Member_ID = ${_memberId} AND Expired_Date >= ${_lastDay}) mp ON mp.Member_ID = im.Member_ID
-- 前一年度發放的可使用積點
LEFT JOIN (SELECT SUM(Point) Point, Member_ID FROM Member_Point WHERE Member_ID = ${_memberId} AND Expired_Date >= ${_pointStartDate} AND Expired_Date <= ${_pointEndDate}) mp1 ON mp.Member_ID = im.Member_ID
WHERE im.Member_ID = ${_memberId};`;

    const result = (await this.internalConn.query(queryStr)) ?? [];

    return result?.[0];
  }

  /**
   * 取得列表筆數＆積點明細列表
   * @param req
   */
  async getPointLogInfo(
    req: GetMemberPointLogDto,
    startDate: string,
    endDate: string,
    tableNames: string[]
  ): Promise<GetPointLogInfoResp> {
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);
    const _memberId = this.internalConn.escape(req?.memberId);
    const _startDate = this.internalConn.escape(startDate);
    const _endDate = this.internalConn.escape(endDate);
    const _pointType = this.internalConn.escape(req?.pointType);

    const unionClauses = tableNames
      .map(
        (tableName) =>
          `SELECT Member_ID, Point_Type, Point_Item, Point, Order_ID, Expired_Date, Send_Date, Deduct_Date, Brand_Name, Store_Name, Create_Date FROM ${tableName}`
      )
      .join('\nUNION ALL\n');

    let queryCountStr = /* sql */ `
-- 取得資料筆數
SELECT COUNT(1) count
FROM (
   ${unionClauses}
) combinedLog
WHERE Member_ID = ${_memberId}
`;

    let queryStr = /* sql */ `
-- 取得列表資料
SELECT  Point_Item pointItem,
        Point point,
        Order_ID orderId,
        DATE_FORMAT(Expired_Date, '%Y/%m/%d') expiredDate,
        Send_Date sendDate,
        Deduct_Date deductDate,
        Brand_Name brandName,
        Store_Name storeName
FROM (
   ${unionClauses}
) combinedLog
WHERE Member_ID = ${_memberId}
    `;

    if (req?.pointType) {
      queryCountStr += /* sql */ `AND combinedLog.Point_Type = ${_pointType}`;
      queryStr += /* sql */ `AND combinedLog.Point_Type = ${_pointType}`;
    }

    if (startDate && endDate) {
      queryCountStr += /* sql */ `AND ((combinedLog.Send_Date >= ${_startDate} AND combinedLog.Send_Date <= ${_endDate}) OR (combinedLog.Deduct_Date >= ${_startDate} AND combinedLog.Deduct_Date <= ${_endDate}))`;
      queryStr += /* sql */ `AND ((combinedLog.Send_Date >= ${_startDate} AND combinedLog.Send_Date <= ${_endDate}) OR (combinedLog.Deduct_Date >= ${_startDate} AND combinedLog.Deduct_Date <= ${_endDate}))`;
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
   * 更新會員手機/驗證狀態
   *
   * @param req
   * @returns
   */

  async syncMemberMobileEnable(dataSet) {
    const queryStr = /* sql */ `
    UPDATE IEat_Member SET
      Is_Phone_Verification = 1,
      Mobile_Country_Code = ?,
      Mobile = ?
    WHERE
      Member_ID = ? AND Is_Active = 1
  `;

    await this.internalConn.query(queryStr, [
      dataSet.mobileCountryCode,
      dataSet.mobile,
      dataSet.memberId
    ]);

    return {};
  }

  /**
   * 更新會員資訊
   *
   * @param req
   * @returns
   */

  async syncMemberInfo(dataSet) {
    const queryStr = /* sql */ `
    UPDATE IEat_Member SET ?
    WHERE
      Member_ID = ? AND Is_Active = 1
  `;

    await this.internalConn.query(queryStr, [dataSet, dataSet.Member_ID]);

    return {};
  }

  /**
   * 刪除會員
   *
   * @param req
   * @returns
   */

  async syncDeleteMember(dataSet) {
    const queryStr = /* sql */ `
    UPDATE IEat_Member SET ?
    WHERE
      Member_ID = ? AND Is_Active = 1
  `;

    await this.internalConn.query(queryStr, [dataSet, dataSet.Member_ID]);

    return {};
  }

  /**
   * 取得會員點數/會籍資料
   * @param memberId 會員編號
   * @param today 今日日期
   */
  async getMemberBonus(
    memberId: string,
    today: string
  ): Promise<GetMemberBonusFromDBResp> {
    const queryStr = /* sql */ `
-- 積點
SELECT  mp.Point point,
        mp.Expired_Date expiredDate
FROM Member_Point mp
WHERE Member_ID = ? AND UNIX_TIMESTAMP(mp.Expired_Date) >= UNIX_TIMESTAMP(?);

-- 會籍歷程
SELECT  im.Member_ID memberId,
        MAX(imsl.ID) id,
        im.Membership_Status memberShip,
        DATE_FORMAT(imsl.End_Date, '%Y/%m/%d') endDate,
        imsl.Total_Amount totalAmount
FROM IEat_Member im
INNER JOIN IEat_Member_Ship_Log imsl ON imsl.Member_ID = im.Member_ID AND imsl.Branch_ID = im.Membership_Status
WHERE im.Member_ID = ? AND imsl.ID = (SELECT MAX(ID) FROM IEat_Member_Ship_Log WHERE Member_ID = ?);

-- 積點基本設定
SELECT  pm.Expiry_Day expiryDay,
        pm.Expiry_Month expiryMonth,
        pm.Expiry_Date expiryDate
FROM Point_Management pm
  `;

    const result =
      (await this.internalConn.query(queryStr, [
        memberId,
        today,
        memberId,
        memberId
      ])) ?? [];

    const [memberPoint, memberShip, pointSetting] = result;

    return {
      memberPoint,
      memberShip: memberShip?.[0],
      pointSetting: pointSetting?.[0]
    };
  }

  /**
   * 取得會籍歷程 table 上方資訊
   * @param memberId 會員編號
   * @returns
   */
  async getMemberShipInfo(memberId: string): Promise<GetMemberShipInfoResp> {
    const queryStr = /* sql */ `
SELECT  Max(ID) id,
        im.Create_Date createDate,
        imsl.Branch_ID memberShipId,
        DATE_FORMAT(imsl.Start_Date, '%Y/%m/%d') startDate,
        DATE_FORMAT(imsl.End_Date, '%Y/%m/%d') endDate,
        imsl.Total_Amount totalAmount,
        imsl.Total_Count totalCount
FROM IEat_Member im
INNER JOIN IEat_Member_Ship_Log imsl ON im.Member_ID = imsl.Member_ID
WHERE im.Member_ID = ? AND imsl.ID = (SELECT Max(ID) FROM IEat_Member_Ship_Log WHERE Member_ID = ?)`;

    const result =
      (await this.internalConn.query(queryStr, [memberId, memberId])) ?? [];

    return result?.[0];
  }

  /**
   * 取得會籍歷程資料
   * @param req
   * @returns
   */
  async getMemberShipLogInfo(
    req: GetMemberShipLogDto
  ): Promise<GetMemberShipLogInfoResp> {
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);

    let queryCountStr = /* sql */ `
-- 僅顯示近一年(365天) 會籍異動歷程
-- 取得資料筆數
SELECT COUNT(1) count
FROM IEat_Member_Ship_Log imsl
WHERE imsl.Member_ID = ? AND imsl.Is_Show = 1 AND Create_Date >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR)`;

    let queryStr = /* sql */ `
-- 僅顯示近一年(365天) 會籍異動歷程
-- 取得列表資料
SELECT  Branch_ID memberShipId,
        Action_Type actionType,
        DATE_FORMAT(Start_Date, '%Y/%m/%d') startDate,
        DATE_FORMAT(End_Date, '%Y/%m/%d') endDate,
        Create_Date createTime
FROM IEat_Member_Ship_Log imsl
WHERE imsl.Member_ID = ? AND imsl.Is_Show = 1 AND Create_Date >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR)`;

    queryStr += /* sql */ `
ORDER BY Create_Date DESC LIMIT ${_start},${_limit}`;

    const result = await this.internalConn.query(
      `${queryCountStr};${queryStr}`,
      [req?.memberId, req?.memberId]
    );
    const [logCount, logList] = result;

    return { logCount, logList };
  }

  /**
   * 取得紅利點數歷程
   *
   * @param req
   * @param tableNames
   */
  async getBonusHistory(
    req: GetBonusHistoryDto,
    tableNames: string[]
  ): Promise<BonusHistory[]> {
    const unionClauses = tableNames
      .map(
        (tableName) =>
          `SELECT ID, Member_ID, Brand_ID, Order_ID, Point_Type, Store_Name, Create_Date, Point FROM ${tableName}`
      )
      .join('\nUNION ALL\n');

    const sqlStr = `
      SELECT
        ID as id,
        Member_ID as memberId,
        Brand_ID as brandId,
        Order_ID as transactionId,
        Point_Type as pointType,
        Store_Name as storeName,
        Create_Date as createDate,
        Point as point
      FROM (
        ${unionClauses}
      ) combinedLog
      WHERE combinedLog.Member_ID = ?
        AND combinedLog.Create_Date >= ?
        AND combinedLog.Create_Date <= ?
      ORDER BY combinedLog.Create_Date DESC
      LIMIT ?, ?
    `;

    const params = [];
    params.push(
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
   * 取得紅利點數歷程總筆數
   *
   * @param req
   * @param tableNames
   * @returns
   */
  async getBonusHistoryCount(
    req: GetBonusHistoryDto,
    tableNames: string[]
  ): Promise<number> {
    const unionClauses = tableNames
      .map(
        (tableName) =>
          `SELECT Member_ID, Point_Type, Point_Item, Point, Order_ID, Expired_Date, Send_Date, Deduct_Date, Brand_Name, Store_Name, Create_Date FROM ${tableName}`
      )
      .join('\nUNION ALL\n');

    const sqlStr = `
      SELECT COUNT(1) as bonusHistoryCount
      FROM (
        ${unionClauses}
      ) combinedLog
      WHERE combinedLog.Member_ID = ?
        AND combinedLog.Create_Date >= ?
        AND combinedLog.Create_Date <= ?
    `;

    const params = [];
    params.push(req?.memberId, req?.startDate, req?.endDate);

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.bonusHistoryCount;
  }

  /**
   * 新增渠道互動Log
   *
   * @param req
   * @param memberId
   * @returns
   */
  async insChannelLog(dataSet): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO IEat_Member_Channel_Action_Log
    (Member_ID, Channel_ID, Channel_Action, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    for (const detail of dataSet?.insChannelLog) {
      const _memberId = this.internalConn.escape(detail.memberId);
      const _channelId = this.internalConn.escape(detail.channelId);
      const _channelAction = this.internalConn.escape(detail.channelAction);

      if (i >= 1) {
        sqlStr += `,`;
      }

      sqlStr += `(${_memberId}, ${_channelId}, ${_channelAction}, 'system', 'system')`;
      i++;
    }

    await this.internalConn.query(sqlStr);

    return {};
  }

  /**
   * 新增匯入 csv 檔案資料
   *
   * @param tableName
   * @param csvPath
   * @returns
   */
  async addMobileCsvTempData(tableName: string, content) {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      ID int NOT NULL AUTO_INCREMENT,
      Mobile_Country_Code varchar(8) NOT NULL,
      Mobile varchar(20) NOT NULL,
      PRIMARY KEY (ID)
    );

    INSERT INTO ${tableName}
      (Mobile_Country_Code, Mobile)
    VALUES
    `;

    let i = 0;
    for (const str of content) {
      const val = str.split(',');
      if (val[0] == '' || val[1] == '') {
        continue;
      }

      if (i > 0) {
        sqlStr += `,`;
      }

      const _mobileCountryCode = this.internalConn.escape(`+${val[0]}`);
      const _mobile = this.internalConn.escape(val[1]);

      sqlStr += `(${_mobileCountryCode}, ${_mobile})`;
      i++;
    }
    sqlStr += ';';

    return sqlStr;
  }

  /**
   * 取得 csv memberId
   *
   * @param tableName
   * @param csvSql
   * @returns
   */
  async getTempCsvMemberId(
    tableName: string,
    csvSql: string
  ): Promise<GetTempCsvMemberIdResp[]> {
    const sqlStr = `
    ${csvSql}

    SELECT
      member.Member_ID as memberId
    FROM
      IEat_Member member
      INNER JOIN ${tableName} temp ON member.Mobile_Country_Code = temp.Mobile_Country_Code AND member.Mobile = temp.Mobile
    WHERE member.Is_Active = 1;

    DROP TEMPORARY TABLE ${tableName};
    `;

    const result = (await this.internalConn.query(sqlStr)) ?? [];

    return result?.[2];
  }

  /**
   * 取得訂位資訊 table 上方資訊
   * @param memberId
   */
  async getMemberBookingInfo(
    memberId: string
  ): Promise<GetMemberBookingInfoResp> {
    const sqlStr = /* sql */ `
SELECT Booking_Count bookingCount, Check_In_Count checkInCount, Un_Check_In_Count unCheckInCount, No_Show_Count noShowCount
FROM Member_Booking_Info
WHERE Member_ID = ?
    `;

    const result = (await this.internalConn.query(sqlStr, [memberId])) ?? [];

    return result?.[0];
  }

  /**
   * 取得訂位歷程資料
   * @param req
   * @param startDate
   * @param endDate
   * @returns
   */
  async getMemberBookingLogInfo(
    req: GetMemberBookingLogDto,
    startDate: string,
    endDate: string
  ): Promise<GetMemberBookingLogInfoResp> {
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);
    const _brandId = this.internalConn.escape(req?.brandId);
    const _startDate = this.internalConn.escape(startDate);
    const _endDate = this.internalConn.escape(endDate);

    let queryCountStr = /* sql */ `
  -- 取得資料筆數
SELECT COUNT(1) count
FROM His_Member_Booking hmb
WHERE hmb.Member_ID = ?`;

    let queryStr = /* sql */ `
  -- 取得列表資料
SELECT  Brand_Name brandName,
        Store_Name storeName,
        People_Count peopleCount,
        DATE_FORMAT(Meal_Date, '%Y/%m/%d') mealDate,
        DATE_FORMAT(Meal_Time, '%H:%i') mealTime,
        Is_Check_In isCheckIn,
        Booking_ID bookingId
FROM His_Member_Booking hmb
WHERE hmb.Member_ID = ?
`;

    if (req?.brandId) {
      queryCountStr += /* sql */ ` AND hmb.Brand_ID = ${_brandId}`;
      queryStr += /* sql */ ` AND hmb.Brand_ID = ${_brandId}`;
    }

    if (startDate && endDate) {
      queryCountStr += /* sql */ `AND (hmb.Create_Date >= ${_startDate} AND hmb.Create_Date <= ${_endDate})`;
      queryStr += /* sql */ `AND (hmb.Create_Date >= ${_startDate} AND hmb.Create_Date <= ${_endDate})`;
    }

    queryStr += /* sql */ `
  ORDER BY Create_Date DESC LIMIT ${_start},${_limit}`;

    const result =
      (await this.internalConn.query(`${queryCountStr};${queryStr}`, [
        req?.memberId,
        req?.memberId
      ])) ?? [];

    const [logCount, logList] = result;

    return { logCount, logList };
  }

  /**
   * 取得電子票券資訊 table 上方資訊
   * @param memberId
   */
  async getMemberEcVoucherInfo(
    memberId: string
  ): Promise<GetMemberEcVoucherInfoResp> {
    const queryStr = /* sql */ `
SELECT
    SUM(mevp.Can_Use_Count) canUseCount,
    SUM(mevp.Write_Off_Count) writeOffCount,
    SUM(mevp.Expired_Count) expiredCount,
    SUM(mevp.Transfer_Count) transferCount,
    SUM(mevp.Return_Count) returnCount
FROM His_Member_EC_Voucher hmev
INNER JOIN Map_EC_Voucher_Product mevp ON mevp.Member_ID = hmev.Member_ID AND hmev.Trade_No = mevp.Trade_No
WHERE hmev.Member_ID = ?
`;

    const result = (await this.internalConn.query(queryStr, [memberId])) ?? [];
    return result?.[0];
  }

  /**
   *
   * @param req
   * @param startDate
   * @param endDate
   * @returns
   */
  async getMemberEcVoucherLogInfo(
    req: GetMemberEcVoucherLogDto,
    startDate: string,
    endDate: string
  ): Promise<GetMemberEcVoucherLogInfoResp> {
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);
    const _memberId = this.internalConn.escape(req?.memberId);
    const _search = this.internalConn.escape(req?.search);
    const _brandId = this.internalConn.escape(req?.brandId);
    const _startDate = this.internalConn.escape(startDate);
    const _endDate = this.internalConn.escape(endDate);

    let queryCountStr = /* sql */ `
  -- 取得資料筆數
SELECT COUNT(1) count
FROM (
      SELECT
        SUM(mevp.Can_Use_Count) canUseCount,
        SUM(mevp.Write_Off_Count) writeOffCount,
        SUM(mevp.Expired_Count) expiredCount,
        SUM(mevp.Transfer_Count) transferCount,
        SUM(mevp.Return_Count) returnCount
      FROM His_Member_EC_Voucher hmev
      INNER JOIN Map_EC_Voucher_Product mevp ON mevp.Member_ID = hmev.Member_ID AND hmev.Trade_No = mevp.Trade_No
      WHERE 1=1`;

    let queryStr = /* sql */ `
  -- 取得列表資料
SELECT
  hmev.ID id,
  hmev.Brand_Name brandName,
  hmev.Card_ID cardId,
  hmev.Member_Name name,
  hmev.Voucher_Name voucherName,
  hmev.Real_Amount amount,
  hmev.Trade_Date tradeDate,
  hmev.Expire_Date expireDate,
  hmev.Trade_No tradeNo,
  SUM(mevp.Can_Use_Count) canUseCount,
  SUM(mevp.Write_Off_Count) writeOffCount,
  SUM(mevp.Expired_Count) expiredCount,
  SUM(mevp.Transfer_Count) transferCount,
  SUM(mevp.Return_Count) returnCount
FROM His_Member_EC_Voucher hmev
INNER JOIN Map_EC_Voucher_Product mevp ON mevp.Member_ID = hmev.Member_ID AND hmev.Trade_No = mevp.Trade_No
WHERE 1=1
`;
    if (req?.memberId) {
      queryCountStr += /* sql */ ` AND hmev.Member_ID = ${_memberId}`;
      queryStr += /* sql */ ` AND hmev.Member_ID = ${_memberId}`;
    }

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MOBILE:
          queryCountStr += ` AND hmev.Mobile = ${_search}`;
          queryStr += ` AND hmev.Mobile = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.MEMBER_CARD:
          queryCountStr += ` AND hmev.Card_ID = ${_search}`;
          queryStr += ` AND hmev.Card_ID = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.TRANSACTION_ID:
          queryCountStr += ` AND hmev.Trade_No = ${_search}`;
          queryStr += ` AND hmev.Trade_No = ${_search}`;
          break;
      }
    }

    if (req?.brandId) {
      queryCountStr += /* sql */ ` AND hmev.Brand_ID = ${_brandId}`;
      queryStr += /* sql */ ` AND hmev.Brand_ID = ${_brandId}`;
    }

    if (startDate && endDate) {
      queryCountStr += /* sql */ ` AND (hmev.Trade_Date >= ${_startDate} AND hmev.Trade_Date <= ${_endDate})`;
      queryStr += /* sql */ ` AND (hmev.Trade_Date >= ${_startDate} AND hmev.Trade_Date <= ${_endDate})`;
    }

    switch (req?.state) {
      case ENUM_EC_VOUCHER_STATE.CAN_USE:
        queryCountStr += /* sql */ ` GROUP BY mevp.Trade_No HAVING canUseCount > 0`;
        queryStr += /* sql */ ` GROUP BY mevp.Trade_No HAVING canUseCount > 0`;
        break;
      case ENUM_EC_VOUCHER_STATE.WRITE_OFF:
        queryCountStr += /* sql */ ` GROUP BY mevp.Trade_No HAVING writeOffCount > 0`;
        queryStr += /* sql */ ` GROUP BY mevp.Trade_No HAVING writeOffCount > 0`;
        break;
      case ENUM_EC_VOUCHER_STATE.EXPIRED:
        queryCountStr += /* sql */ ` GROUP BY mevp.Trade_No HAVING expiredCount > 0`;
        queryStr += /* sql */ ` GROUP BY mevp.Trade_No HAVING expiredCount > 0`;
        break;
      case ENUM_EC_VOUCHER_STATE.TRANSFER:
        queryCountStr += /* sql */ ` GROUP BY mevp.Trade_No HAVING transferCount > 0`;
        queryStr += /* sql */ ` GROUP BY mevp.Trade_No HAVING transferCount > 0`;
        break;
      case ENUM_EC_VOUCHER_STATE.RETURN:
        queryCountStr += /* sql */ ` GROUP BY mevp.Trade_No HAVING returnCount > 0`;
        queryStr += /* sql */ ` GROUP BY mevp.Trade_No HAVING returnCount > 0`;
        break;
      default:
        queryCountStr += /* sql */ ` GROUP BY mevp.Trade_No`;
        queryStr += /* sql */ ` GROUP BY mevp.Trade_No`;
        break;
    }

    queryStr += /* sql */ `
ORDER BY hmev.Create_Date DESC LIMIT ${_start},${_limit}`;
    queryCountStr += /* sql */ `
) subQuery`;

    const result =
      (await this.internalConn.query(`${queryCountStr};${queryStr}`, [
        req?.memberId,
        req?.memberId
      ])) ?? [];

    const [logCount, logList] = result;

    return { logCount, logList };
  }

  /**
   * 取得會員電子票卷詳細資料
   * @param id
   * @returns
   */
  async getEcVoucherInfo(id: number): Promise<GetEcVoucherInfoResp[]> {
    const queryStr = /* sql */ `
SELECT
    im.Member_Name name,
    im.Member_CardID cardNo,
    CONCAT(im.Mobile_Country_Code,im.Mobile) mobile,
    hmev.Trade_Date tradeDate,
    hmev.Trade_No tradeNo,
    hmev.Source source,
    hmev.Brand_Name brandName,
    hmev.Store_Name storeName,
    hmev.Trade_Type tradeType,
    hmev.Pay_Method payMethod,
    hmev.Invoice_No invoiceNo,
    hmev.Discount discount,
    hmev.Discount_Point discountPoint,
    hmev.Original_Amount originalAmount,
    hmev.Discount_Amount discountAmount,
    hmev.Delivery_Fee deliveryFee,
    hmev.Real_Amount realAmount,
    mevp.Product_ID productId,
    mevp.Product_Name productName,
    mevp.Can_Use_Count canUseCount,
    mevp.Write_Off_Count writeOffCount,
    mevp.Expired_Count expiredCount,
    mevp.Transfer_Count transferCount,
    mevp.Return_Count returnCount
FROM His_Member_EC_Voucher hmev
INNER JOIN Map_EC_Voucher_Product mevp ON mevp.Member_ID = hmev.Member_ID AND hmev.Trade_No = mevp.Trade_No
INNER JOIN IEat_Member im ON im.Member_ID = mevp.Member_ID
WHERE hmev.ID = ?`;

    const result = (await this.internalConn.query(queryStr, [id])) ?? [];
    return result;
  }

  /**
   * 取得會員電子票券資料
   *
   * @param memberId
   * @returns
   */
  async getMemberECVoucherData(
    memberId: string
  ): Promise<ConsumptionElectronicCoupon[]> {
    const sqlStr = `
    SELECT
      Voucher_Name as electronicCouponName,
      COUNT(ID) as electronicCouponCount,
      Trade_Date as consumptionDate
    FROM
      His_Member_EC_Voucher
    WHERE Is_Active = 1
      AND Member_ID = ?
    GROUP BY Voucher_Name
    ORDER BY electronicCouponCount DESC, Trade_Date DESC
    LIMIT 3
    `;

    const result = await this.internalConn.query(sqlStr, [memberId]);

    return result;
  }

  /**
   * 取得會員會籍銷售資料
   *
   * @param memberId
   * @returns
   */
  async getMemberShipOrderData(
    memberId: string
  ): Promise<OverviewAnalysisConsumptionDetail> {
    const sqlStr = `
    SELECT
      COUNT(DISTINCT orderMain.Order_ID) as consumptionCount,
      SUM(orderDetail.Paid_Amount) - SUM(IFNULL(returnMain.Paid_Amount,0)) as consumptionAmount
    FROM
      Order_Main orderMain
      INNER JOIN Order_Detail orderDetail ON orderMain.Order_ID = orderDetail.Order_ID AND orderDetail.Is_Active = 1
      LEFT JOIN Return_Main returnMain ON orderMain.Transaction_ID = returnMain.Transaction_ID AND returnMain.Is_Active = 1
      INNER JOIN IEat_Member member ON orderMain.Member_ID = member.Member_ID AND member.Is_Active = 1
      INNER JOIN IEat_Member_Ship_Log memberShipLog ON memberShipLog.ID = (
        SELECT
          ID
        FROM
          IEat_Member_Ship_Log
        WHERE Is_Active = 1
          AND Member_ID = member.Member_ID
          AND Branch_ID = member.Membership_Status
        ORDER BY ID DESC
        LIMIT 1
    )
    WHERE orderMain.Is_Active = 1
      AND orderMain.Member_ID = ?
      AND orderMain.Transaction_Date > memberShipLog.Start_Date
      AND orderMain.Transaction_Date < memberShipLog.End_Date
    `;

    const result = await this.internalConn.query(sqlStr, [memberId]);

    return result?.[0];
  }
}
