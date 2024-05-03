import { Injectable } from '@nestjs/common';
import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import {
  TAG_DATE_STATE_TYPE,
  TAG_DATE_STATE_TYPE_CODE,
  TAG_STATE_TYPE,
  TAG_STATE_TYPE_CODE
} from 'src/Definition/Enum/Tag/tag.enum';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { GetTagGroupListResp } from './Dto/get.tag.group.list.dto';
import { GetTagListDto, TagList } from './Dto/get.tag.list.dto';
import {
  GetTagMemberListDto,
  TagMemberList
} from './Dto/get.tag.member.list.dto';
import { GetTagMenuResp } from './Dto/get.tag.menu.dto';
import { InsTagDataDto } from './Dto/ins.tag.data.dto';
import { InsTagGroupDto } from './Dto/ins.tag.group.dto';
import { GetMemberTagResp } from './Interface/get.member.tag.interface';
import { GetTagDetailInterfaceResp } from './Interface/get.tag.detail.interface';
import { GetTagGroupDetailResp } from './Interface/get.tag.group.detail.interface';
import moment = require('moment-timezone');

/**
 *
 * @class
 */
@Injectable()
export class TagRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得標籤分類列表
   *
   * @returns
   */
  async getTagGroupList(): Promise<GetTagGroupListResp[]> {
    const sqlStr = `
    SELECT
      tagGroup.Tag_Group_ID as tagGroupId,
      tagGroup.Group_Name as tagGroupName,
      tagGroup.Create_Date as createTime,
      COUNT(tag.Tag_ID) as tagCount,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = tagGroup.Create_ID), 'system') as createName,
      tagGroup.Alter_Date as alterTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = tagGroup.Alter_ID), 'system') as alterName
    FROM
      Tag_Group tagGroup
      LEFT JOIN Tag tag ON tagGroup.Tag_Group_ID = tag.Tag_Group_ID AND tag.Is_Active = 1
    WHERE tagGroup.Is_Active = 1
    GROUP BY tagGroup.Tag_Group_ID
    ORDER BY tagGroup.Sort_Order ASC, tagGroup.Create_Date DESC
    `;

    const result = await this.internalConn.query(sqlStr);

    return result;
  }

  /**
   * 取得標籤分類詳情資料
   *
   * @param tagGroupId
   * @returns
   */
  async getTagGroupDetail(tagGroupId: number): Promise<GetTagGroupDetailResp> {
    const sqlStr = `
    SELECT
      Group_Name as groupName
    FROM
      Tag_Group
    WHERE Is_Active = 1
      AND Tag_Group_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [tagGroupId]);

    return result?.[0];
  }

  /**
   * 取得多筆標籤分類詳情資料
   *
   * @param tagGroupIds
   * @returns
   */
  async getTagGroupDetails(
    tagGroupIds: number[]
  ): Promise<GetTagGroupDetailResp[]> {
    const _tagGroupIds = this.internalConn.escape(tagGroupIds);

    const sqlStr = `
    SELECT
      Group_Name as groupName
    FROM
      Tag_Group
    WHERE Is_Active = 1
      AND Tag_Group_ID IN (${_tagGroupIds})
    `;

    const result = await this.internalConn.query(sqlStr);

    return result;
  }

  /**
   * 新增標籤分類
   *
   * @param req
   * @returns
   */
  async insTagGroup(
    req: InsTagGroupDto,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const addData = {
      Tag_Group_ID: req?.tagGroupId ?? null,
      Group_Name: req?.tagGroupName,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `
    INSERT INTO Tag_Group SET ?
    ON DUPLICATE KEY UPDATE
    Group_Name = VALUES(Group_Name), Alter_ID = VALUES(Alter_ID)
    `;

    await this.internalConn.query(sqlStr, [addData]);

    return {};
  }

  /**
   * 刪除標籤分類
   *
   * @param tagGroupId
   * @param authMemberId
   * @returns
   */
  async delTagGroup(
    tagGroupId: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Tag_Group SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Tag_Group_ID = ?
    `;

    await this.internalConn.query(sqlStr, [authMemberId, tagGroupId]);

    return {};
  }

  /**
   * 取得標籤下拉式選單資料
   *
   * @returns
   */
  async getTagMenuData(): Promise<GetTagMenuResp[]> {
    const sqlStr = `
    SELECT
      Tag_ID as id,
      Tag_Name as name
    FROM
      Tag
    WHERE Is_Active = 1
      AND State = 1
      AND ((Tag_Active_Type = 'RANGE' AND Active_End_Time > NOW()) OR Tag_Active_Type = 'PERMANENT')
    `;

    const result = await this.internalConn.query(sqlStr);

    return result;
  }

  /**
   * 修改標籤分類排序
   *
   * @param connection
   * @param tagGroupId
   * @param rank
   * @param authMemberId
   * @returns
   */
  async updTagGroupSort(
    connection,
    tagGroupId: number,
    rank: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Tag_Group SET
      Sort_Order = ?,
      Alter_ID = ?
    WHERE Tag_Group_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      rank,
      authMemberId,
      tagGroupId
    ]);

    return {};
  }

  /**
   * 取得會員標籤列表
   *
   * @param req
   * @returns
   */
  async getTagList(req: GetTagListDto): Promise<TagList[]> {
    let sqlStr = `
    SELECT
      tag.Tag_ID as tagId,
      tag.Tag_Name as tagName,
      tagGroup.Group_Name as tagGroupName,
      tag.Active_Start_Time as startDate,
      tag.Active_End_Time as endDate,
      tag.Tag_Active_Type as dateState,
      COUNT(mapTagMember.Member_ID) as tagMemberCount,
      tag.Create_Date as createTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = tag.Create_ID), 'system') as createName,
      tag.Alter_Date as alterTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = tag.Alter_ID), 'system') as alterName
    FROM
      Tag tag
      INNER JOIN Tag_Group tagGroup ON tag.Tag_Group_ID = tagGroup.Tag_Group_ID AND tagGroup.Is_Active = 1
      LEFT JOIN Map_Tag_Member mapTagMember ON tag.Tag_ID = mapTagMember.Tag_ID AND mapTagMember.Is_Active = 1
    WHERE tag.Is_Active = 1
    `;
    const params = [];
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.TAG_NAME:
          sqlStr += ` AND tag.Tag_Name LIKE CONCAT('%', ?, '%')`;
          params.push(req?.search);
          break;
      }
    }

    if (req?.tagGroupId) {
      sqlStr += ` AND tag.Tag_Group_ID = ?`;
      params.push(req?.tagGroupId);
    }

    switch (req?.dateState) {
      case TAG_DATE_STATE_TYPE_CODE[TAG_DATE_STATE_TYPE.RANGE]:
        sqlStr += ` AND tag.Tag_Active_Type = ?`;
        sqlStr += ` AND tag.Active_End_Time > ?`;
        sqlStr += ` AND tag.Active_Start_Time < ?`;

        params.push(req?.dateState, req?.startDate, req?.endDate);
        break;
      case TAG_DATE_STATE_TYPE_CODE[TAG_DATE_STATE_TYPE.PERMANENT]:
        sqlStr += ` AND tag.Tag_Active_Type = ?`;

        params.push(req?.dateState);
        break;
    }

    switch (req?.state) {
      case TAG_STATE_TYPE_CODE[TAG_STATE_TYPE.ENABLE]:
        sqlStr += ` AND tag.State = 1`;
        sqlStr += ` AND ((tag.Tag_Active_Type = 'RANGE' AND tag.Active_End_Time > NOW()) OR tag.Tag_Active_Type = 'PERMANENT')`;
        break;
      case TAG_STATE_TYPE_CODE[TAG_STATE_TYPE.DISABLE]:
        sqlStr += ` AND (tag.State = 0`;
        sqlStr += ` OR (tag.Tag_Active_Type = 'RANGE' AND tag.Active_End_Time <= NOW()))`;
        break;
    }

    sqlStr += ` GROUP BY tag.Tag_ID`;
    sqlStr += ` ORDER BY tag.Tag_ID DESC`;

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 取得會員標籤列表總筆數
   *
   * @param req
   * @returns
   */
  async getTagListCount(req: GetTagListDto): Promise<number> {
    let sqlStr = `
    SELECT
      COUNT(DISTINCT tag.Tag_ID) as tagIdCount
    FROM
      Tag tag
      INNER JOIN Tag_Group tagGroup ON tag.Tag_Group_ID = tagGroup.Tag_Group_ID AND tagGroup.Is_Active = 1
    WHERE tag.Is_Active = 1
    `;
    const params = [];
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.TAG_NAME:
          sqlStr += ` AND tag.Tag_Name LIKE CONCAT('%', ?, '%')`;
          params.push(req?.search);
          break;
      }
    }

    if (req?.tagGroupId) {
      sqlStr += ` AND tag.Tag_Group_ID = ?`;
      params.push(req?.tagGroupId);
    }

    switch (req?.dateState) {
      case TAG_DATE_STATE_TYPE_CODE[TAG_DATE_STATE_TYPE.RANGE]:
        sqlStr += ` AND tag.Tag_Active_Type = ?`;
        sqlStr += ` AND tag.Active_End_Time > ?`;
        sqlStr += ` AND tag.Active_Start_Time < ?`;

        params.push(req?.dateState, req?.startDate, req?.endDate);
        break;
      case TAG_DATE_STATE_TYPE_CODE[TAG_DATE_STATE_TYPE.PERMANENT]:
        sqlStr += ` AND tag.Tag_Active_Type = ?`;

        params.push(req?.dateState);
        break;
    }

    switch (req?.state) {
      case TAG_STATE_TYPE_CODE[TAG_STATE_TYPE.ENABLE]:
        sqlStr += ` AND tag.State = 1`;
        sqlStr += ` AND ((tag.Tag_Active_Type = 'RANGE' AND tag.Active_End_Time > NOW()) OR tag.Tag_Active_Type = 'PERMANENT')`;
        break;
      case TAG_STATE_TYPE_CODE[TAG_STATE_TYPE.DISABLE]:
        sqlStr += ` AND (tag.State = 0`;
        sqlStr += ` OR (tag.Tag_Active_Type = 'RANGE' AND tag.Active_End_Time <= NOW()))`;
        break;
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.tagIdCount;
  }

  /**
   * 取得標籤詳細資料
   *
   * @param tagId
   * @returns
   */
  async getTagDetail(tagId: number): Promise<GetTagDetailInterfaceResp> {
    const sqlStr = `
    SELECT
      tag.Tag_ID as tagId,
      tag.Tag_Group_ID as tagGroupId,
      tag.Tag_Name as tagName,
      tag.Tag_Active_Type as tagActiveType,
      tag.State as state,
      tag.Active_End_Time as endDate,
      tag.Description as description,
      COUNT(tagMember.Member_ID) as tagCount
    FROM
      Tag tag
      LEFT JOIN Map_Tag_Member tagMember ON tag.Tag_ID = tagMember.Tag_ID AND tagMember.Is_Active = 1
    WHERE tag.Is_Active = 1
      AND tag.Tag_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [tagId]);

    return result?.[0];
  }

  /**
   * 取得多筆標籤詳細資料
   *
   * @param tagIds
   * @returns
   */
  async getTagDetails(tagIds: number[]): Promise<GetTagDetailInterfaceResp[]> {
    const _tagIds = this.internalConn.escape(tagIds);

    const sqlStr = `
    SELECT
      tag.Tag_ID as tagId,
      tag.Tag_Name as tagName,
      COUNT(tagMember.Member_ID) as tagCount
    FROM
      Tag tag
      LEFT JOIN Map_Tag_Member tagMember ON tag.Tag_ID = tagMember.Tag_ID AND tagMember.Is_Active = 1
    WHERE tag.Is_Active = 1
      AND tag.Tag_ID IN (${_tagIds})
    GROUP BY tag.Tag_ID
    `;

    const result = await this.internalConn.query(sqlStr);

    return result;
  }

  /**
   * 依標籤名稱取得標籤資料
   *
   * @param tagName
   * @returns
   */
  async getTagDetailByName(
    tagName: string
  ): Promise<GetTagDetailInterfaceResp> {
    const sqlStr = `
    SELECT
      Tag_ID as tagId
    FROM
      Tag
    WHERE Is_Active = 1
      AND Tag_Name = ?
    `;

    const result = await this.internalConn.query(sqlStr, [tagName]);

    return result?.[0];
  }

  /**
   * 新增標籤資料
   *
   * @param req
   * @returns
   */
  async insTagData(req: InsTagDataDto): Promise<Record<string, never>> {
    const addData = {
      Tag_ID: req?.tagId ?? null,
      Tag_Group_ID: req?.tagGroupId,
      Tag_Name: req?.tagName,
      Tag_Active_Type: req?.dateState,
      State: req?.state == TAG_STATE_TYPE_CODE[TAG_STATE_TYPE.DISABLE] ? 1 : 0,
      Active_Start_Time:
        req?.dateState == TAG_DATE_STATE_TYPE_CODE[TAG_DATE_STATE_TYPE.RANGE]
          ? moment().utc().format('YYYY-MM-DD')
          : null,
      Active_End_Time:
        req?.dateState == TAG_DATE_STATE_TYPE_CODE[TAG_DATE_STATE_TYPE.RANGE]
          ? req?.endDate
          : null,
      Description: req?.description,
      Create_ID: req?.iam?.authMemberId,
      Alter_ID: req?.iam?.authMemberId
    };

    const sqlStr = `
    INSERT INTO Tag SET ?
    ON DUPLICATE KEY UPDATE Tag_Group_ID = VALUES(Tag_Group_ID), Tag_Name = VALUES(Tag_Name),
    Tag_Active_Type = VALUES(Tag_Active_Type), State = VALUES(State), Active_Start_Time = VALUES(Active_Start_Time),
    Active_End_Time = VALUES(Active_End_Time), Description = VALUES(Description), Alter_ID = VALUES(Alter_ID)
    `;

    await this.internalConn.query(sqlStr, [addData]);

    return {};
  }

  /**
   * 停用標籤狀態
   *
   * @param tagId
   * @param authMemberId
   * @returns
   */
  async stopTagStatus(
    tagIds: number[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _tagIds = this.internalConn.escape(tagIds);

    const sqlStr = `
    UPDATE Tag SET
      State = 0,
      Alter_ID = ?
    WHERE Tag_ID IN (${_tagIds})
    `;

    const result = await this.internalConn.query(sqlStr, [authMemberId]);

    return result;
  }

  /**
   * 刪除標籤資料
   *
   * @param tagIds
   * @param authMemberId
   * @returns
   */
  async delTagData(
    tagIds: number[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _tagIds = this.internalConn.escape(tagIds);

    const sqlStr = `
    UPDATE Tag SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Tag_ID IN (${_tagIds})
    `;

    await this.internalConn.query(sqlStr, [authMemberId]);

    return {};
  }

  /**
   * 新增標籤上傳紀錄
   *
   * @param fileUrl
   * @param memberCount
   * @param authMemberId
   * @returns
   */
  async addTagUploadLog(
    action: string,
    fileUrl: string,
    memberCount: number,
    authMemberId: string
  ): Promise<number> {
    const addData = {
      Action: action,
      File_Url: fileUrl,
      Tag_Log_Member_Count: memberCount,
      Create_ID: authMemberId
    };

    const sqlStr = `
    INSERT INTO Tag_Upload_Log SET ?
    `;

    const result = await this.internalConn.query(sqlStr, [addData]);

    return result?.insertId;
  }

  /**
   * 新增上傳標籤 MAP
   *
   * @param tagUploadId
   * @param tagId
   * @param authMemberId
   * @returns
   */
  async insTagUploadMap(
    connection,
    tagUploadId: number,
    tagId: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const addData = {
      Tag_Upload_ID: tagUploadId,
      Tag_ID: tagId,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `
    INSERT INTO Map_Tag_Upload SET ?
    `;

    const result = await this.internalConn.transactionQuery(
      connection,
      sqlStr,
      [addData]
    );

    return {};
  }

  /**
   * 新增標籤會員
   *
   * @param tagId
   * @param memberId
   * @param authMemberId
   * @returns
   */
  async insTagMember(
    connection,
    tagId: number,
    memberId: string,
    authMemberId: string
  ) {
    const addData = {
      Tag_ID: tagId,
      Member_ID: memberId,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `
    INSERT INTO Map_Tag_Member SET ?
    ON DUPLICATE KEY UPDATE Is_Active = 1, Alter_ID = VALUES(Alter_ID)
    `;
    await this.internalConn.transactionQuery(connection, sqlStr, [addData]);

    return {};
  }

  /**
   * 刪除會員標籤
   *
   * @param memberIds
   * @param tagIds
   * @param authMemberId
   * @returns
   */
  async delTagMember(
    memberIds: string[],
    tagIds: number[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _memberIds = this.internalConn.escape(memberIds);
    const _tagIds = this.internalConn.escape(tagIds);

    let sqlStr = `
    UPDATE Map_Tag_Member SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE 1
      AND Tag_ID IN (${_tagIds})
    `;
    if (memberIds?.length > 0) {
      sqlStr += ` AND Member_ID IN (${_memberIds})`;
    }

    await this.internalConn.query(sqlStr, [authMemberId]);

    return {};
  }

  /**
   * 取得貼標列表
   *
   * @param req
   * @returns
   */
  async getTagMemberList(req: GetTagMemberListDto): Promise<TagMemberList[]> {
    const sqlStr = `
    SELECT
      tagUploadLog.ID as tagUploadLogId,
      GROUP_CONCAT(tag.Tag_Name SEPARATOR '、') as tagName,
      tagUploadLog.Tag_Log_Member_Count as tagMemberCount,
      tagUploadLog.File_Url as url,
      tagUploadLog.Create_Date as createTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = tagUploadLog.Create_ID), 'system') as createName
    FROM
      Tag_Upload_Log tagUploadLog
      LEFT JOIN Map_Tag_Upload mapTagUpload ON mapTagUpload.Tag_Upload_ID = tagUploadLog.ID AND mapTagUpload.Is_Active = 1
      INNER JOIN Tag tag ON mapTagUpload.Tag_ID = tag.Tag_ID AND tag.Is_Active = 1
    WHERE tagUploadLog.Action = ?
    GROUP BY tagUploadLog.ID
    ORDER BY tagUploadLog.Create_Date DESC
    LIMIT ?, ?
    `;

    const result = await this.internalConn.query(sqlStr, [
      req?.action,
      (req?.page - 1) * req?.perPage,
      req?.perPage
    ]);

    return result;
  }

  /**
   * 取得貼標列表總筆數
   *
   * @param req
   * @returns
   */
  async getTagMemberListCount(req: GetTagMemberListDto): Promise<number> {
    const sqlStr = `
    SELECT
      COUNT(DISTINCT tagUploadLog.ID) as tagUploadLogCount
    FROM
      Tag_Upload_Log tagUploadLog
      LEFT JOIN Map_Tag_Upload mapTagUpload ON mapTagUpload.Tag_Upload_ID = tagUploadLog.ID AND mapTagUpload.Is_Active = 1
      INNER JOIN Tag tag ON mapTagUpload.Tag_ID = tag.Tag_ID AND tag.Is_Active = 1
    WHERE tagUploadLog.Action = ?
    `;

    const result = await this.internalConn.query(sqlStr, [req?.action]);

    return result?.[0]?.tagUploadLogCount;
  }

  /**
   * 取得會員標籤
   *
   * @param memberId
   * @returns
   */
  async getMemberTag(memberId: string): Promise<GetMemberTagResp[]> {
    const sqlStr = `
    SELECT
      tag.Tag_ID as tagId,
      tag.Tag_Name as tagName
    FROM
      Map_Tag_Member tagMember
      INNER JOIN Tag tag ON tagMember.Tag_ID = tag.Tag_ID AND tag.Is_Active = 1
    WHERE tagMember.Is_Active = 1
      AND tagMember.Member_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [memberId]);

    return result;
  }
}
