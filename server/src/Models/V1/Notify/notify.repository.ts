import { Injectable } from '@nestjs/common';
import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { GetNotifyClassListResp } from './Dto/get.notify.class.dto';
import {
  GetNotifyMemberListDto,
  NotifyMemberList
} from './Dto/get.notify.member.list.dto';
import { UpdNotifyClassDetailDto } from './Dto/upd.notify.class.detail.dto';
import { UpdNotifyMemberDetailDto } from './Dto/upd.notify.member.detail.dto';
import { GetAllNotifyClassNameResp } from './Interface/get.all.notify.class.name.interface';
import { GetNotifyClassDetailResp } from './Interface/get.notify.class.detail.interface';
import { GetNotifyClassMapMemberResp } from './Interface/get.notify.class.map.member.interface';
import { GetNotifyMemberCountResp } from './Interface/get.notify.member.count.interface';
import { GetNotifyMemberDetailResp } from './Interface/get.notify.member.detail.interface';

@Injectable()
export class NotifyRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得通知分類列表
   *
   * @returns
   */
  async getNotifyClassList(): Promise<GetNotifyClassListResp[]> {
    const sqlStr = `
    SELECT
      notifyGroup.ID as seq,
      notifyGroup.Group_Name as groupName,
      notifyGroup.Create_Date as createTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = notifyGroup.Create_ID), 'system') as createName,
      notifyGroup.Alter_Date as alterTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = notifyGroup.Alter_ID), 'system') as alterName
    FROM
      Notify_Group notifyGroup
    WHERE notifyGroup.Is_Active = 1
    ORDER BY notifyGroup.Sort_Order ASC
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得通知分類會員的數量
   *
   * @returns
   */
  async getNotifyMemberCount(): Promise<GetNotifyMemberCountResp[]> {
    const sqlStr = `
    SELECT
      Notify_Group_ID as notifyId,
      COUNT(*) as memberCount
    FROM
      Notify_Group_Members
    WHERE Is_Active = 1
    GROUP BY Notify_Group_ID
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得通知分類詳細資料
   *
   * @param notifyId 通知分類編號
   * @returns
   */
  async getNotifyClassDetail(
    notifyId: number
  ): Promise<GetNotifyClassDetailResp> {
    const _notifyId = this.internalConn.escape(notifyId);

    const sqlStr = `
    SELECT
      Group_Name as groupName
    FROM
      Notify_Group
    WHERE Is_Active = 1
      AND ID = ${_notifyId}
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result?.[0];
  }

  /**
   * 取得通知分類詳細資料
   *
   * @param notifySeq 通知分類編號(複數)
   * @returns
   */
  async getNotifyClassDetails(
    notifySeq: number[]
  ): Promise<GetNotifyClassDetailResp[]> {
    const _notifySeq = this.internalConn.escape(notifySeq);

    const sqlStr = `
    SELECT
      Group_Name as groupName
    FROM
      Notify_Group
    WHERE Is_Active = 1
      AND ID IN (${_notifySeq})
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 依通知分類名稱取得通知分類詳細資料
   *
   * @param name 通知分類名稱
   * @returns
   */
  async getNotifyClassDetailByName(
    req: UpdNotifyClassDetailDto
  ): Promise<GetNotifyClassDetailResp> {
    const _name = this.internalConn.escape(req?.groupName);
    const _id = this.internalConn.escape(req?.notifySeq);

    const sqlStr = `
    SELECT
      Group_Name as groupName
    FROM
      Notify_Group
    WHERE Is_Active = 1
      AND Group_Name = ${_name} AND ID != ${_id}
    LIMIT 1
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result?.[0];
  }

  /**
   * 取得全部通知分類名稱
   *
   * @returns
   */
  async getAllNotifyClassNames(): Promise<GetAllNotifyClassNameResp[]> {
    const sqlStr = `
    SELECT
      ID as notifySeq,
      Group_Name as groupName
    FROM
      Notify_Group
    WHERE Is_Active = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 修改通知分類排序
   *
   * @param connection DB 編號
   * @param notifyId 通知分類編號
   * @param rank 排序
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updNotifyClassRank(
    connection,
    notifyId: number,
    rank: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Notify_Group SET
      Sort_Order = ?,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE ID = ?`;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      rank,
      authMemberId,
      notifyId
    ]);

    return {};
  }

  /**
   * 修改通知分類詳細資料
   *
   * @param notifyId 通知分類編號
   * @param groupName 通知分類名稱
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updNotifyClassDetail(
    notifyId: number,
    groupName: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Notify_Group SET
      Group_Name = ?,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Is_Active = 1
      AND ID = ?
    `;

    await this.internalConn.query(sqlStr, [groupName, authMemberId, notifyId]);

    return {};
  }

  /**
   * 新增通知分類詳細資料
   *
   * @param groupName 通知分類名稱
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insNotifyClassDetail(
    groupName: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const insData = {
      Group_Name: groupName,
      Sort_Order: 1,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `
    UPDATE Notify_Group SET Sort_Order = Sort_Order + 1 WHERE Is_Active = 1;

    INSERT INTO Notify_Group SET ?;
    `;

    await this.internalConn.query(sqlStr, [insData]);

    return {};
  }

  /**
   * 軟刪除通知分類資料
   *
   * @param notifyId 通知分類編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delNotifyClassDetail(
    notifyId: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Notify_Group SET
      Is_Active = 0,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE ID = ?
    `;

    await this.internalConn.query(sqlStr, [authMemberId, notifyId]);

    return {};
  }

  /**
   * 取得通知人員列表
   *
   * @param req
   * @returns
   */
  async getNotifyMemberList(
    req: GetNotifyMemberListDto
  ): Promise<NotifyMemberList[]> {
    const _search = this.internalConn.escape(req?.search);
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);

    let sqlStr = `
    SELECT
      nm.ID as userSeq,
      nm.Member_Name as name,
      nm.Mobile_Country_Code as mobileCountryCode,
      nm.Mobile as mobile,
      nm.Email as email,
      nm.Create_Date as createDate,
      nm.Alter_Date as alterDate,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = nm.Create_ID), 'system') as createName,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = nm.Alter_ID), 'system') as alterName
    FROM
      Notify_Members nm
    WHERE nm.Is_Active = 1
    `;

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MEMBER_NAME:
          sqlStr += ` AND nm.Member_Name = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.MOBILE:
          sqlStr += ` AND nm.Mobile = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.EMAIL:
          sqlStr += ` AND nm.Email = ${_search}`;
          break;
      }
    }

    sqlStr += ` ORDER BY nm.Create_Date DESC`;
    sqlStr += ` LIMIT ${_start}, ${_limit}`;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得通知人員列表數量
   *
   * @param req
   * @returns
   */
  async getNotifyMemberListCount(req: GetNotifyMemberListDto): Promise<number> {
    const _search = this.internalConn.escape(req?.search);

    let sqlStr = `
    SELECT
      COUNT(*) as notifyCount
    FROM
      Notify_Members
    WHERE Is_Active = 1
    `;

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MEMBER_NAME:
          sqlStr += ` AND Member_Name = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.MOBILE:
          sqlStr += ` AND Mobile = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.EMAIL:
          sqlStr += ` AND Email = ${_search}`;
          break;
      }
    }

    const result = await this.internalConn.query(sqlStr);

    return result?.[0]?.notifyCount;
  }

  /**
   * 取得通知分類關聯會員資料
   *
   * @returns
   */
  async getNotifyClassMapMember(): Promise<GetNotifyClassMapMemberResp[]> {
    const sqlStr = `
    SELECT
      groupMembers.Notify_Member_ID as userSeq,
      notifyGroup.ID as groupId,
      notifyGroup.Group_Name as groupName
    FROM
      Notify_Group_Members as groupMembers
      JOIN Notify_Group notifyGroup ON groupMembers.Notify_Group_ID = notifyGroup.ID AND notifyGroup.Is_Active = 1
    WHERE groupMembers.Is_Active = 1
    `;

    const result = await this.internalConn.query(sqlStr);

    return result;
  }

  /**
   * 取得通知人員詳細資料
   *
   * @param userSeq 通知人員編號
   * @returns
   */
  async getNotifyMemberDetail(
    userSeq: number
  ): Promise<GetNotifyMemberDetailResp> {
    const _userSeq = this.internalConn.escape(userSeq);

    const sqlStr = `
    SELECT
      ID as id,
      Member_Name as name,
      Mobile_Country_Code as mobileCountryCode,
      Mobile as mobile
    FROM
      Notify_Members
    WHERE Is_Active = 1
      AND ID = ${_userSeq}
    `;

    const result = await this.internalConn.query(sqlStr);

    return result?.[0];
  }

  /**
   * 依手機號碼取得通知人員
   *
   * @param mobileCountryCode 手機國碼
   * @param mobile 手機號碼
   * @returns
   */
  async getNotifyMemberDetailByMobile(
    mobileCountryCode: string,
    mobile: string
  ): Promise<GetNotifyMemberDetailResp> {
    const sqlStr = `
    SELECT
      ID as id,
      Member_Name as name,
      Mobile_Country_Code as mobileCountryCode,
      Mobile as mobile
    FROM
      Notify_Members
    WHERE Is_Active = 1
      AND Mobile_Country_Code = ?
      AND Mobile = ?
    `;

    const result = await this.internalConn.query(sqlStr, [
      mobileCountryCode,
      mobile
    ]);

    return result?.[0];
  }

  /**
   * 新增通知人員資料
   *
   * @param connection DB 連線
   * @param req
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insNotifyMemberDetail(
    connection,
    req: UpdNotifyMemberDetailDto,
    authMemberId: string
  ): Promise<number> {
    const insData = {
      Member_Name: req?.name,
      Mobile_Country_Code: req?.mobileCountryCode,
      Mobile: req?.mobile,
      Email: req?.email,
      Create_ID: authMemberId,
      ALter_ID: authMemberId
    };

    const sqlStr = `INSERT INTO Notify_Members SET ? `;

    const result = await this.internalConn.transactionQuery(
      connection,
      sqlStr,
      [insData]
    );

    return result?.insertId;
  }

  /**
   * 修改通知人員詳細資料
   *
   * @param connection DB 連線
   * @param req
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updNotifyMemberDetail(
    connection,
    req: UpdNotifyMemberDetailDto,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Notify_Members SET
      Member_Name = ?,
      Mobile_Country_Code = ?,
      Mobile = ?,
      Email = ?,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      req?.name,
      req?.mobileCountryCode,
      req?.mobile,
      req?.email,
      authMemberId,
      req?.userSeq
    ]);

    return {};
  }

  /**
   * 軟刪除通知人員資料
   *
   * @param connection DB 連線
   * @param userSeq 通知人員編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delNotifyMemberDetail(
    connection,
    userSeq: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Notify_Members SET
      Is_Active = 0,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      userSeq
    ]);

    return {};
  }

  /**
   * 軟刪除通知人員資料 by sql 關聯
   *
   * @param connection DB 連線
   * @param tableName 暫存表
   * @param csvSql 關聯語法
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delNotifyMemberDetailBySql(
    connection,
    tableName: string,
    csvSql: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    ${csvSql}

    UPDATE
      Notify_Members notifyMember
      INNER JOIN ${tableName} temp ON notifyMember.Mobile_Country_Code = temp.Mobile_Country_Code AND notifyMember.Mobile = temp.Mobile
    SET
      notifyMember.Is_Active = 0,
      notifyMember.Alter_Date = CURRENT_TIMESTAMP,
      notifyMember.Alter_ID = ?
    WHERE notifyMember.Is_Active = 1
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId
    ]);

    return {};
  }

  /**
   * 初始化通知分類會員關聯
   *
   * @param connection DB 連線
   * @param userId 通知會員編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initNotifyGroupMember(
    connection,
    userId: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Notify_Group_Members SET
      Is_Active = 0,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Notify_Member_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      userId
    ]);

    return {};
  }

  /**
   * 初始化通知分類會員關聯 by sql 關聯
   *
   * @param connection DB 連線
   * @param tableName 暫存表
   * @param csvSql 關聯語法
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initNotifyGroupMemberBySql(
    connection,
    tableName: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Notify_Group_Members SET
      Is_Active = 0,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Notify_Member_ID IN (
      SELECT
        notifyMember.ID
      FROM
        Notify_Members notifyMember
        INNER JOIN ${tableName} temp ON notifyMember.Mobile_Country_Code = temp.Mobile_Country_Code AND notifyMember.Mobile = temp.Mobile
      WHERE notifyMember.Is_Active = 1
    )
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId
    ]);

    return {};
  }

  /**
   * 新增通知分類與人員關聯資料
   *
   * @param connection DB 連線
   * @param userId 通知會員編號
   * @param groupIds 通知分群編號(複數)
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updNotifyGroupMember(
    connection,
    userId: number,
    groupIds: number[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _userId = this.internalConn.escape(userId);
    const _authMemberId = this.internalConn.escape(authMemberId);

    let sqlStr = `
    INSERT INTO Notify_Group_Members
      (Notify_Group_ID, Notify_Member_ID, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    for (const groupId of groupIds) {
      if (i >= 1) {
        sqlStr += `,`;
      }

      sqlStr += `(${this.internalConn.escape(
        groupId
      )},${_userId}, ${_authMemberId}, ${_authMemberId})`;

      i++;
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Is_Active = 1,`;
    sqlStr += ` Alter_Date = CURRENT_TIMESTAMP, Alter_ID = VALUES(Alter_ID)`;

    await this.internalConn.transactionQuery(connection, sqlStr);

    return {};
  }
}
