import { Injectable } from '@nestjs/common';
import { ENUM_MEMBER_SHIP_SETTING_STATUS_CODE } from 'src/Definition/Enum/MemberShip/member.ship.setting.status.enum';
import { ENUM_POINT_TYPE } from 'src/Definition/Enum/Point/point.type.enum';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { AddMemberShipDto } from './Dto/add.member.ship.dto';
import {
  AddMemberShipSettingDto,
  GiftDetails
} from './Dto/add.member.ship.setting.dto';
import {
  GetBasicSettingFromDBResp,
  GetMemberSettingParameterDto,
  GetMemberShipListResp
} from './Dto/get.member.setting.parameter.dto';
import { GetBasicMemberShipSettingResp } from './Interface/get.basic.member.ship.setting.interface';
import { GetCopyMemberShipCheckFieldResp } from './Interface/get.copy.member.ship.check.field.interface';
import { GetMemberShipBranchDetailResp } from './Interface/get.member.ship.branch.detail.interface';
import { GetMemberShipBranchGiftResp } from './Interface/get.member.ship.branch.gift.interface';
import { GetMemberShipGiftResp } from './Interface/get.member.ship.gift.interface';
import { GetMemberShipSettingInfoFromDBResp } from './Interface/get.member.ship.setting.info.interface';
import { GetMemberShipSettingListFromDBResp } from './Interface/get.member.ship.setting.list.interface';

import moment = require('moment-timezone');

/**
 *
 * @class
 */
@Injectable()
export class MemberShipRepository {
  constructor(private internalConn: MysqlProvider) {}
  private readonly escape = this.internalConn.escape;

  /**
   * 取得最新的編號
   * @param column 欄位
   * @param table 表
   * @param start
   * @param end
   * @returns
   */
  async getLatestId(
    column: string,
    table: string,
    start: number,
    end: number,
    where?: string
  ): Promise<string> {
    let queryStr = /* sql */ `
    SELECT SUBSTR(${column},${start},${end}) id
    FROM ${table}`;

    if (where) queryStr += ` WHERE ${where}`;

    queryStr += ` ORDER BY Create_Date DESC`;

    if (where) queryStr += `, Member_Ship_Branch_ID DESC`;

    queryStr += ` LIMIT 1`;

    const result = (await this.internalConn.query(queryStr)) ?? [];

    return result?.[0]?.id ?? null;
  }

  /**
   * 取得基本設定詳細資訊
   */
  async getMemberShipSettingList(): Promise<
    GetMemberShipSettingListFromDBResp[]
  > {
    const queryStr = /* sql */ 
    // `
    //   SELECT Member_Ship_ID settingId,
    //     Member_Ship_Name settingName,
    //     Effective_Start_Date effectiveStarDate,
    //     Member_Ship_Status settingStatus,
    //     Create_Date createDate,
    //     Create_ID createName,
    //     Alter_Date alterDate,
    //     Alter_ID alterName
    //   FROM
    //     IEat_Member_Ship
    //   WHERE Is_Active = 1
    //   ORDER BY  Member_Ship_Status DESC, Create_Date DESC
    //   -- 生效中的永遠在第一個之後用日期最新的在前面
    // `;

    `
      SELECT
      Member_Ship_ID settingId,
      Member_Ship_Name settingName,
      Effective_Start_Date effectiveStarDate,
      Member_Ship_Status settingStatus,
      Create_Date createDate,
      (
      select
        Auth_Name
      from
        Auth_Member am
      WHERE
        am.Auth_Member_ID = ims.Create_ID ) as createName,
      Alter_Date alterDate,
        (
      select
        Auth_Name
      from
        Auth_Member am
      WHERE
        am.Auth_Member_ID = ims.Alter_ID ) as alterName
    FROM
      IEat_Member_Ship ims
    WHERE
      Is_Active = 1
    ORDER BY
      Member_Ship_Status DESC,
      Create_Date DESC
    `

    const result = (await this.internalConn.query(queryStr)) ?? [];

    return result;
  }

  /**
   * 取得待生效、生效中的起始日
   */
  async getEffectiveDate(): Promise<string[]> {
    const queryStr = /* sql */ `
      SELECT
        date_format(Effective_Start_Date, '%Y/%m/%d') effectiveStarDate
      FROM
        IEat_Member_Ship
      WHERE Is_Active = 1
        AND (Member_Ship_Status = ${ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.PENDING} OR Member_Ship_Status = ${ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE})
    `;

    const result =
      (await this.internalConn.query(queryStr))?.map(
        (x) => x?.effectiveStarDate
      ) ?? [];

    return result;
  }

  /**
   * 取得會籍版本設定名稱
   * @param settingId 會籍通用設定編號
   */
  async getSettingName(settingId: string): Promise<string[]> {
    let queryStr = /* sql */ `
      SELECT
        Member_Ship_Name settingName
      FROM
        IEat_Member_Ship
      WHERE Is_Active = 1
    `;

    if (settingId)
      queryStr += ` AND Member_Ship_ID != ${this.escape(settingId)}`;

    const result =
      (await this.internalConn.query(queryStr))?.map((x) => x?.settingName) ??
      [];

    return result;
  }

  /**
   * 新增會籍版本
   * @param settingId 會籍版本編號
   * @param req
   * @returns
   */
  async addMemberShipSetting(
    connection,
    settingId: string,
    req: AddMemberShipSettingDto
  ): Promise<Record<string, never>> {
    const _settingId = this.escape(settingId);
    const _memberShipName = this.escape(req?.settingName);
    const _effectiveStartDate = this.escape(req?.startDate);
    const _effectiveStartDateCount = this.escape(req?.startDateCount);
    const _effectiveStartDateYear = this.escape(req?.startDateYear);
    const _effectiveEndDate = this.escape(req?.endDate);
    const _consumptionUpgrade = this.escape(req?.consumptionUpgrade);
    const _consumptionDue = this.escape(req?.consumptionDue);
    const _upgradeDay = this.escape(req?.upgradeDay);
    const _upgradeNum = this.escape(req?.upgradeNum);
    const _memberShipStatus = this.escape(
      !req?.isRelease
        ? ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.DRAFT
        : ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.PENDING
    );
    const _authMemberId = this.escape(req?.iam?.authMemberId);

    const queryStr = /* sql */ `
      INSERT INTO IEat_Member_Ship
      (Member_Ship_ID, Member_Ship_Name, Effective_Start_Date, Effective_Start_Date_Count, Effective_Start_Date_Year, Effective_End_Date, Consumption_Upgrade, Consumption_Due, Upgrade_Day, Upgrade_Num, Member_Ship_Status, Create_ID, Alter_ID)
      VALUES(${_settingId}, ${_memberShipName}, ${_effectiveStartDate}, ${_effectiveStartDateCount}, ${_effectiveStartDateYear}, ${_effectiveEndDate}, ${_consumptionUpgrade}, ${_consumptionDue}, ${_upgradeDay}, ${_upgradeNum}, ${_memberShipStatus}, ${_authMemberId}, ${_authMemberId})
      ON DUPLICATE KEY UPDATE
      Member_Ship_ID = ${_settingId}, Member_Ship_Name = ${_memberShipName}, Effective_Start_Date = ${_effectiveStartDate}, Effective_Start_Date_Count = ${_effectiveStartDateCount}, Effective_Start_Date_Year = ${_effectiveStartDateYear}, Effective_End_Date = ${_effectiveEndDate}, Consumption_Upgrade = ${_consumptionUpgrade}, Consumption_Due = ${_consumptionDue}, Upgrade_Day = ${_upgradeDay}, Upgrade_Num = ${_upgradeNum}, Member_Ship_Status = ${_memberShipStatus}, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};
     `;

    await this.internalConn.transactionQuery(connection, queryStr);

    return {};
  }

  /**
   * 取得會員消費納入會籍計算時間
   * @returns
   */
  async getBasicSetting(): Promise<GetBasicSettingFromDBResp[]> {
    const queryStr = /* sql */ `
      SELECT
        c.Channel_Name channelName,
        pmcd.Full_Date fullDate
      FROM
        Channel c
      LEFT JOIN Point_Management_Channel_D pmcd ON c.Channel_ID = pmcd.Channel_ID
      WHERE c.Is_Active = 1 AND c.Point_Calculation = 1
      ORDER BY c.Sort_Order
    `;

    const result = (await this.internalConn.query(queryStr)) ?? [];

    return result;
  }

  /**
   * 複製會籍設定
   * @param settingId 要複製的編號
   * @param newSettingId 新的編號
   */
  async copyMemberShipSetting(
    settingId: string,
    newSettingId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _settingId = this.escape(settingId);
    const _newSettingId = this.escape(newSettingId);
    const _authMemberId = this.escape(authMemberId);

    const queryStr = /* sql */ `
      SET @name = (SELECT Member_Ship_Name FROM IEat_Member_Ship WHERE Member_Ship_ID = ${_settingId});
      SET @number = (SELECT COUNT(1) FROM IEat_Member_Ship WHERE Member_Ship_Name LIKE CONCAT(@name,'%') AND Is_Active = 1);
      SET @copyNumber= IF(@number=1,'',@number-1);

      -- 會籍設定主表
      INSERT INTO IEat_Member_Ship
      (Member_Ship_ID, Member_Ship_Name, Effective_Start_Date, Effective_Start_Date_Count, Effective_Start_Date_Year, Effective_End_Date, Consumption_Upgrade, Consumption_Due, Upgrade_Day, Upgrade_Num, Member_Ship_Status, Is_Active, Create_Date, Create_ID, Alter_Date, Alter_ID, Is_Copy)
      SELECT ${_newSettingId}, CONCAT(@name,'-複製',@copyNumber), Effective_Start_Date, Effective_Start_Date_Count, Effective_Start_Date_Year, Effective_End_Date, Consumption_Upgrade, Consumption_Due, Upgrade_Day, Upgrade_Num, 0, Is_Active, CURRENT_TIMESTAMP, ${_authMemberId}, CURRENT_TIMESTAMP, ${_authMemberId}, 1
      FROM IEat_Member_Ship
      WHERE Member_Ship_ID = ${_settingId};

      -- 單項會籍
      INSERT INTO IEat_Member_Ship_Branch
      (Member_Ship_Branch_ID, Member_Ship_ID, Member_Ship_Name, Next_Ship_ID, Purchased_Count, Purchased_Times, Expires_Change, Is_Active, Create_Date, Create_ID, Alter_Date, Alter_ID)
      SELECT CONCAT(${_newSettingId},SUBSTR(Member_Ship_Branch_ID,5,6)), ${_newSettingId}, Member_Ship_Name, CONCAT(${_newSettingId},SUBSTR(Next_Ship_ID,5,6)), Purchased_Count, Purchased_Times, Expires_Change, Is_Active, CURRENT_TIMESTAMP, ${_authMemberId}, CURRENT_TIMESTAMP, ${_authMemberId}
      FROM IEat_Member_Ship_Branch
      WHERE Member_Ship_ID = ${_settingId};

      -- 會籍積點
      INSERT INTO IEat_Member_Ship_Branch_Point
      (Member_Ship_Branch_ID, Point_Type, Status, Point_Ratio_Type, Purchased_Sum, Purchased_Every, Purchased_Point, Active_Status, Active_Day, Is_Active, Create_Date, Create_ID, Alter_Date, Alter_ID)
      SELECT CONCAT(${_newSettingId},SUBSTR(Member_Ship_Branch_ID,5,6)), Point_Type, Status, Point_Ratio_Type, Purchased_Sum, Purchased_Every, Purchased_Point, Active_Status, Active_Day, Is_Active, CURRENT_TIMESTAMP, ${_authMemberId}, CURRENT_TIMESTAMP, ${_authMemberId}
      FROM IEat_Member_Ship_Branch_Point
      WHERE Member_Ship_Branch_ID LIKE CONCAT(${_settingId},'%');
    `;

    await this.internalConn.query(queryStr);

    return {};
  }

  /**
   * 取得複製會籍需檢核的欄位值
   * @param settingId
   * @param memberShipId
   * @returns
   */
  async getCopyMemberShipCheckField(
    settingId: string,
    memberShipId: string
  ): Promise<GetCopyMemberShipCheckFieldResp> {
    let queryStr = /* sql */ `
SELECT  ims.Is_Copy isCopy,
        ims.Effective_End_Date endDate, -- 會籍到期日
        ims.Effective_Start_Date_Year startDateYear ${
          memberShipId ? ',' : ''
        } -- 會籍續等/升等期限
`;

    if (memberShipId) {
      queryStr += /* sql */ `
imsb.Next_Ship_ID nextMemberShip, -- 下一階層會籍代碼
imsb.Purchased_Count purchasedCount, -- 會籍資格-消費滿__次
imsb.Purchased_Times purchasedTimes, -- 會籍資格-消費滿__元
imsb.Expires_Change expiresChange -- 會員到期異動方式
`;
    }

    queryStr += /* sql */ ` FROM IEat_Member_Ship ims`;

    if (memberShipId) {
      queryStr += /* sql */ ` INNER JOIN IEat_Member_Ship_Branch imsb ON imsb.Member_Ship_ID = ims.Member_Ship_ID `;
    }

    queryStr += /* sql */ ` WHERE ims.Member_Ship_ID = ?`;

    if (memberShipId) {
      queryStr += /* sql */ ` AND imsb.Member_Ship_Branch_ID = ? `;
    }

    const result =
      (await this.internalConn.query(queryStr, [settingId, memberShipId])) ??
      [];

    return result?.[0];
  }

  /**
   * 取得會籍版本設定狀態
   */
  async getMemberShipSettingStatus(settingId: string): Promise<number> {
    const queryStr = /* sql */ `
      SELECT
        Member_Ship_Status memberShipStatus
      FROM
        IEat_Member_Ship
      WHERE Is_Active = 1
        AND Member_Ship_ID = ?
    `;

    const result = (await this.internalConn.query(queryStr, [settingId])) ?? [];

    return result?.[0]?.memberShipStatus;
  }

  /**
   * 刪除會籍版本設定
   */
  async delMemberShipSetting(
    settingId: string
  ): Promise<Record<string, never>> {
    const queryStr = /* sql */ `
      UPDATE IEat_Member_Ship
      SET Is_Active = 0
      WHERE Member_Ship_ID = ?
    `;

    await this.internalConn.query(queryStr, [settingId]);

    return {};
  }

  /**
   * 取得會籍版本有幾個會籍
   */
  async getMemberShipCount(settingId: string): Promise<number> {
    const queryStr = /* sql */ `
      SELECT
        count(1) settingCount
      FROM
        IEat_Member_Ship_Branch imsb
      WHERE Member_Ship_ID = ?
      `;

    const result = (await this.internalConn.query(queryStr, [settingId])) ?? [];

    return result?.[0]?.settingCount;
  }

  /**
   * 新增會籍版本
   * @param memberShipId 會籍編號
   * @param req
   * @returns
   */
  async addMemberShip(
    memberShipId: string,
    req: AddMemberShipDto
  ): Promise<Record<string, never>> {
    const _memberShipStatus = this.escape(
      !req?.isRelease
        ? ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.DRAFT
        : ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.PENDING
    );
    const _settingId = this.escape(req?.settingId);
    const _memberShipId = this.escape(memberShipId);
    const _memberShipName = this.escape(req?.memberShipName);
    const _nextMemberShip = this.escape(
      req?.nextMemberShip?.length ? req?.nextMemberShip : null
    );
    const _purchasedCount = this.escape(req?.purchasedCount);
    const _purchasedTimes = this.escape(req?.purchasedTimes);
    const _expiresChange = this.escape(req?.expiresChange);
    const _settingBasic = this.escape(ENUM_POINT_TYPE.SETTING_BASIC);
    const _settingBirthday = this.escape(ENUM_POINT_TYPE.SETTING_BIRTHDAY);
    const settingBasic = {
      _activeStatus: this.escape(req?.basicSetting?.activeStatus),
      _activeDay: this.escape(req?.basicSetting?.activeDay),
      _pointType_ratio: this.escape(req?.basicSetting?.setting?.[0]?.pointType),
      _status_ratio: this.escape(req?.basicSetting?.setting?.[0]?.status),
      _purchasedSum_ratio: this.escape(
        req?.basicSetting?.setting?.[0]?.purchasedSum
      ),
      _purchasedEvery_ratio: this.escape(
        req?.basicSetting?.setting?.[0]?.purchasedEvery
      ),
      _purchasedPoint_ratio: this.escape(
        req?.basicSetting?.setting?.[0]?.purchasedPoint
      ),
      _pointType_fix: this.escape(req?.basicSetting?.setting?.[1]?.pointType),
      _status_fix: this.escape(req?.basicSetting?.setting?.[1]?.status),
      _purchasedSum_fix: this.escape(
        req?.basicSetting?.setting?.[1]?.purchasedSum
      ),
      _purchasedEvery_fix: this.escape(
        req?.basicSetting?.setting?.[1]?.purchasedEvery
      ),
      _purchasedPoint_fix: this.escape(
        req?.basicSetting?.setting?.[1]?.purchasedPoint
      )
    };
    const settingBirthday = {
      _activeStatus: this.escape(req?.birthdaySetting?.activeStatus),
      _activeDay: this.escape(req?.birthdaySetting?.activeDay),
      _pointType_ratio: this.escape(
        req?.birthdaySetting?.setting?.[0]?.pointType
      ),
      _status_ratio: this.escape(req?.basicSetting?.setting?.[0]?.status),
      _purchasedSum_ratio: this.escape(
        req?.birthdaySetting?.setting?.[0]?.purchasedSum
      ),
      _purchasedEvery_ratio: this.escape(
        req?.birthdaySetting?.setting?.[0]?.purchasedEvery
      ),
      _purchasedPoint_ratio: this.escape(
        req?.birthdaySetting?.setting?.[0]?.purchasedPoint
      ),
      _pointType_fix: this.escape(
        req?.birthdaySetting?.setting?.[1]?.pointType
      ),
      _status_fix: this.escape(req?.birthdaySetting?.setting?.[1]?.status),
      _purchasedSum_fix: this.escape(
        req?.birthdaySetting?.setting?.[1]?.purchasedSum
      ),
      _purchasedEvery_fix: this.escape(
        req?.birthdaySetting?.setting?.[1]?.purchasedEvery
      ),
      _purchasedPoint_fix: this.escape(
        req?.birthdaySetting?.setting?.[1]?.purchasedPoint
      )
    };
    const _authMemberId = this.escape(req?.iam?.authMemberId);

    const queryStr = /* sql */ `
      -- 編輯會籍狀態
      UPDATE IEat_Member_Ship SET Member_Ship_Status = ${_memberShipStatus} WHERE Member_Ship_ID = ${_settingId};
      -- 單項會籍表
      INSERT INTO IEat_Member_Ship_Branch
      (Member_Ship_Branch_ID, Member_Ship_ID, Member_Ship_Name, Next_Ship_ID, Purchased_Count, Purchased_Times, Expires_Change, Create_ID, Alter_ID)
      VALUES(${_memberShipId}, ${_settingId}, ${_memberShipName}, ${_nextMemberShip}, ${_purchasedCount}, ${_purchasedTimes}, ${_expiresChange}, ${_authMemberId}, ${_authMemberId})
      ON DUPLICATE KEY UPDATE
      Member_Ship_Branch_ID = ${_memberShipId}, Member_Ship_Name = ${_memberShipName}, Next_Ship_ID = ${_nextMemberShip}, Purchased_Count = ${_purchasedCount}, Purchased_Times = ${_purchasedTimes}, expires_Change = ${_expiresChange}, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};

      -- 積點全刪重新新增
      DELETE FROM IEat_Member_Ship_Branch_Point WHERE Member_Ship_Branch_ID = ${_memberShipId};

      INSERT INTO IEat_Member_Ship_Branch_Point
      (Member_Ship_Branch_ID, Point_Type, Status, Point_Ratio_Type, Purchased_Sum, Purchased_Every, Purchased_Point, Active_Status, Active_Day, Create_ID, Alter_ID)
      VALUES
      -- 積點基本設定
      (${_memberShipId},
      ${_settingBasic},
      ${settingBasic._status_ratio},
      ${settingBasic._pointType_ratio},
      ${settingBasic._purchasedSum_ratio},
      ${settingBasic._purchasedEvery_ratio},
      ${settingBasic._purchasedPoint_ratio},
      ${settingBasic._activeStatus},
      ${settingBasic._activeDay},
      ${_authMemberId},
      ${_authMemberId}),
      (${_memberShipId},
      ${_settingBasic},
      ${settingBasic._status_fix},
      ${settingBasic._pointType_fix},
      ${settingBasic._purchasedSum_fix},
      ${settingBasic._purchasedEvery_fix},
      ${settingBasic._purchasedPoint_fix},
      ${settingBasic._activeStatus},
      ${settingBasic._activeDay},
      ${_authMemberId},
      ${_authMemberId}),
      -- 生日當月積點回饋
      (${_memberShipId},
      ${_settingBirthday},
      ${settingBirthday._status_ratio},
      ${settingBirthday._pointType_ratio},
      ${settingBirthday._purchasedSum_ratio},
      ${settingBirthday._purchasedEvery_ratio},
      ${settingBirthday._purchasedPoint_ratio},
      ${settingBirthday._activeStatus},
      ${settingBirthday._activeDay},
      ${_authMemberId},
      ${_authMemberId}),
      (${_memberShipId},
      ${_settingBirthday},
      ${settingBirthday._status_fix},
      ${settingBirthday._pointType_fix},
      ${settingBirthday._purchasedSum_fix},
      ${settingBirthday._purchasedEvery_fix},
      ${settingBirthday._purchasedPoint_fix},
      ${settingBirthday._activeStatus},
      ${settingBirthday._activeDay},
      ${_authMemberId},
      ${_authMemberId});;
    `;

    await this.internalConn.query(queryStr);

    return {};
  }

  /**
   * 發布會籍版本
   */
  async releaseMemberShipSetting(
    settingId: string
  ): Promise<Record<string, never>> {
    const queryStr = /* sql */ `
      UPDATE IEat_Member_Ship
      SET Member_Ship_Status = ${ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.PENDING} -- 待生效
      WHERE Member_Ship_ID = ?
    `;

    await this.internalConn.query(queryStr, [settingId]);

    return {};
  }

  /**
   * 取得會籍設定詳細資料
   * @param settingId
   */
  async getMemberShipSettingInfo(
    settingId: string
  ): Promise<GetMemberShipSettingInfoFromDBResp[]> {
    const queryStr = /* sql */ `
    SELECT
      ims.Member_Ship_ID settingId,
      ims.Member_Ship_Name settingName,
      DATE_FORMAT(ims.Effective_Start_Date, '%Y/%m/%d') startDate, -- 會籍預定生效日
      ims.Effective_Start_Date_Count startDateCount, -- 會籍啟始日-計算
      ims.Effective_Start_Date_Year startDateYear, -- 會籍啟始日續等/升等期限
      ims.Effective_End_Date endDate, -- 會籍到期日
      ims.Consumption_Upgrade consumptionUpgrade, -- 消費計算-升等
      ims.Consumption_Due consumptionDue, -- 消費計算-到期
      ims.Upgrade_Day upgradeDay, -- 續會/升等禮_日
      ims.Upgrade_Num upgradeNum, -- 續會/升等禮_次數
      imsb.Member_Ship_Branch_ID memberShipId, -- 會籍代碼
      imsb.Member_Ship_Name memberShipName, -- 會籍名稱
      imsb.Next_Ship_ID nextShipId, -- 下一階層會籍代碼
      imsb.Purchased_Count purchasedCount, -- 會籍資格-消費滿__次
      imsb.Purchased_Times purchasedTimes, -- 會籍資格-消費滿__元
      imsb.Expires_Change expiresChange, -- 會員到期異動方式
      imsbp.Point_Type pointType, -- 積點設定選項
      imsbp.Point_Ratio_Type pointRatioType, -- 選取項目
      imsbp.Status status, -- 選取狀態
      imsbp.Purchased_Sum purchasedSum, -- 滿金額
      imsbp.Purchased_Every purchasedEvery, -- 每___金額
      imsbp.Purchased_Point purchasedPoint, -- 滿額點
      imsbp.Active_Status activeStatus, -- 指定狀態
      imsbp.Active_Day activeDay, -- 天
      ims.Is_Copy isCopy -- 天
    FROM
      IEat_Member_Ship ims
    LEFT JOIN IEat_Member_Ship_Branch imsb ON ims.Member_Ship_ID = imsb.Member_Ship_ID
    LEFT JOIN IEat_Member_Ship_Branch_Point imsbp ON imsbp.Member_Ship_Branch_ID = imsb.Member_Ship_Branch_ID
    WHERE ims.Member_Ship_ID = ?`;

    const result = (await this.internalConn.query(queryStr, [settingId])) ?? [];

    return result;
  }

  /**
   * 取得會籍列表
   */
  async geMemberShipList(
    req: GetMemberSettingParameterDto
  ): Promise<GetMemberShipListResp[]> {
    const queryStr = /* sql */ `
    SELECT
        Member_Ship_Branch_ID memberShipId,
        Member_Ship_Name memberShipName,
        Next_Ship_ID nextMemberShip
    FROM IEat_Member_Ship_Branch
    WHERE Member_Ship_ID = ?
    `;

    const result =
      (await this.internalConn.query(queryStr, [req?.settingId])) ?? [];

    return result;
  }

  /**
   * 取得初階會籍設定
   */
  async getBasicMemberShipSetting(): Promise<GetBasicMemberShipSettingResp> {
    const queryStr = /* sql */ `
    SELECT  ims.Member_Ship_ID settingId,
      imsb.Member_Ship_Branch_ID memberShipId,
      imsb.Member_Ship_Name memberShipName,
      ims.Effective_Start_Date_Count memberShipCount, -- 會籍啟始日-計算
      ims.Effective_Start_Date_Year memberShipYear, -- 會籍續等升/等期限
      ims.Effective_End_Date endDate -- 會籍到期日
    FROM
      IEat_Member_Ship ims
    INNER JOIN IEat_Member_Ship_Branch imsb ON imsb.Member_Ship_ID = ims.Member_Ship_ID
    WHERE ims.Member_Ship_Status = ${ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE}
      AND ims.Is_Active = 1
    ORDER BY imsb.Create_Date LIMIT 1`;

    const result = (await this.internalConn.query(queryStr)) ?? [];

    return result?.[0];
  }

  /**
   * 依會籍分支編號取得會籍分支設定名稱
   *
   * @param branchId
   * @returns
   */
  async getMemberShipBranchById(
    branchId: string
  ): Promise<GetMemberShipBranchDetailResp> {
    const sqlStr = `
    SELECT
      Member_Ship_Name as memberShipName,
      Next_Ship_ID as nextShipId,
      Purchased_Count as purchasedCount,
      Purchased_Times as purchasedTimes
    FROM
      IEat_Member_Ship_Branch
    WHERE Is_Active = 1
      AND Member_Ship_Branch_ID = ?
    `;

    const result = (await this.internalConn.query(sqlStr, [branchId])) ?? [];

    return result?.[0];
  }

  /**
   * 依多個會籍分支編號取得會籍分支設定名稱
   *
   * @param branchIds [會籍分支編號,會籍分支編號]
   * @returns
   */
  async getMemberShipBranchByIds(
    branchIds: string[]
  ): Promise<GetMemberShipBranchDetailResp[]> {
    if (!branchIds?.length) {
      return [] as GetMemberShipBranchDetailResp[];
    }

    const _branchIds = this.escape(branchIds);

    const sqlStr = `
    SELECT
      Member_Ship_Branch_ID as memberShipBranchId,
      Member_Ship_Name as memberShipName,
      Next_Ship_ID as nextShipId,
      Purchased_Count as purchasedCount,
      Purchased_Times as purchasedTimes
    FROM
      IEat_Member_Ship_Branch
    WHERE Is_Active = 1
      AND Member_Ship_Branch_ID IN (${_branchIds})
    `;

    const result = (await this.internalConn.query(sqlStr)) ?? [];

    return result;
  }

  /**
   * 取得會籍註冊禮
   *
   * @param memberShipId
   * @returns
   */
  async getMemberShipGift(
    memberShipId: string
  ): Promise<GetMemberShipGiftResp[]> {
    const sqlStr = `
    SELECT
      coupon.Coupon_ID as couponId,
      coupon.Coupon_Name as couponName,
      c.Channel_ID as channelId,
      c.Channel_Name as channelName
    FROM
      Channel c
      LEFT JOIN IEat_Member_Ship_NGift memberShipGift ON c.Channel_ID = memberShipGift.Channel_ID
      	AND memberShipGift.Is_Active = 1
        AND memberShipGift.Member_Ship_ID = ?
      LEFT JOIN Coupon coupon ON memberShipGift.Coupon_ID = coupon.Coupon_ID AND coupon.Is_Active = 1
    WHERE c.Is_Active = 1
    ORDER BY c.Sort_Order ASC
    `;

    const result = await this.internalConn.query(sqlStr, [memberShipId]);

    return result;
  }

  /**
   * 取得會籍續會禮與升等禮
   *
   * @param branchIds
   * @returns
   */
  async getMemberShipBranchGifts(
    branchIds: string[]
  ): Promise<GetMemberShipBranchGiftResp[]> {
    const _branchIds = this.escape(branchIds);
    const sqlStr = `
    SELECT
      memberShipBranchGift.Member_Ship_Branch_ID as memberShipBranchId,
      memberShipBranchGift.Gift_Type as giftType,
      coupon.Coupon_ID as couponId,
      coupon.Coupon_Name as couponName
    FROM
      IEat_Member_Ship_Branch_Gift memberShipBranchGift
      JOIN Coupon coupon ON memberShipBranchGift.Coupon_ID = coupon.Coupon_ID AND coupon.Is_Active = 1
    WHERE memberShipBranchGift.Is_Active = 1
      AND memberShipBranchGift.Member_Ship_Branch_ID IN (${_branchIds})
    `;

    const result = await this.internalConn.query(sqlStr);

    return result;
  }
  /**
   * 初始化會籍註冊禮
   *
   * @param connection
   * @param memberShipId
   * @param authMemberId
   * @returns
   */
  async initMemberShipGift(
    connection,
    memberShipId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE IEat_Member_Ship_NGift SET
      Is_Active = 0,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Member_Ship_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      memberShipId
    ]);

    return {};
  }

  /**
   * 新增會籍版本設定入會禮
   *
   * @param connection
   * @param memberShipId
   * @param gift
   * @returns
   */
  async addMemberShipGift(
    connection,
    memberShipId: string,
    gift: GiftDetails[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO IEat_Member_Ship_NGift
    (Member_Ship_ID, Channel_ID, Coupon_ID, Create_ID, Alter_ID)
    VALUES
    `;
    let i = 0;
    const params = [];
    for (const detail of gift) {
      for (const couponId of detail?.couponIds) {
        if (i >= 1) {
          sqlStr += `,`;
        }

        sqlStr += `(?, ?, ?, ?, ?)`;
        params.push(
          memberShipId,
          detail?.channelId,
          couponId,
          authMemberId,
          authMemberId
        );
        i++;
      }
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Is_Active = 1, Alter_ID = VALUES(Alter_ID), Alter_Date = CURRENT_TIMESTAMP`;

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 初始化會籍升等禮與續會禮
   *
   * @param connection
   * @param memberShipId
   * @param authMemberId
   * @returns
   */
  async initMemberShipBranchGift(
    connection,
    memberShipId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE IEat_Member_Ship_Branch_Gift SET
      Is_Active = 0,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Member_Ship_Branch_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      memberShipId
    ]);

    return {};
  }

  /**
   * 新增會籍升等禮與續會禮
   *
   * @param connection
   * @param memberShipId
   * @param renewalCouponIds
   * @param upgradeCouponIds
   * @returns
   */
  async addMemberShipBranchGift(
    connection,
    memberShipId: string,
    renewalCouponIds: string[],
    upgradeCouponIds: string[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO IEat_Member_Ship_Branch_Gift
    (Member_Ship_Branch_ID, Gift_Type, Coupon_ID, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    const params = [];
    for (const couponId of renewalCouponIds) {
      if (i >= 1) {
        sqlStr += `,`;
      }

      sqlStr += `(?, ?, ?, ?, ?)`;
      params.push(
        memberShipId,
        'renewal',
        couponId,
        authMemberId,
        authMemberId
      );
      i++;
    }

    for (const couponId of upgradeCouponIds) {
      if (i >= 1) {
        sqlStr += `,`;
      }

      sqlStr += `(?, ?, ?, ?, ?)`;
      params.push(
        memberShipId,
        'upgrade',
        couponId,
        authMemberId,
        authMemberId
      );
      i++;
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Is_Active = 1, Alter_ID = VALUES(Alter_ID), Alter_Date = CURRENT_TIMESTAMP`;

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 取得兌換券交易編號 ID 最大值
   * @returns
   */
  async getMaxOrderId(): Promise<string> {
    const queryStr = /* sql */ `
      SELECT MAX(Order_ID) orderId FROM Order_Main LIMIT 1
      `;

    const result = (await this.internalConn.query(queryStr)) ?? [];

    return result?.[0]?.orderId;
  }

  /**
   *
   * @param req
   */
  async insertOrderBatchDemo(orderId: string, data) {
    const _authMemberId = this.escape('system');

    const queryStr = /* sql */ `
INSERT INTO Order_Main
(Order_ID, Order_Channel_ID, Transaction_ID, Transaction_Type, Transaction_Date, Completion_Date, Member_ID, Member_CardID, Brand_ID, Store_ID, Create_ID, Alter_ID)
VALUES (?,'Ch0000', ?, 1, ?, ?, ?, ?, 'CX', 'S2212290073', ${_authMemberId}, ${_authMemberId});
INSERT INTO Order_Detail
(Order_ID, Meal_Date, Meal_Method, Number_of_People, Has_Children, Delivery_Method, Payment_Method, Original_Amount, Paid_Amount, Create_ID, Alter_ID)
VALUES(?, ?, 1, 3, 0, "", "", ?, ?, ${_authMemberId}, ${_authMemberId});
`;

    await this.internalConn.query(queryStr, [
      orderId,
      data?.transactionId,
      data?.tradeDate,
      data?.tradeDate,
      data?.memberId,
      data?.cardId,
      orderId,
      data?.tradeDate,
      data?.amount,
      data?.amount
    ]);
  }

  async getOrderMainBatchDemo(page: number, perPage: number) {
    const queryStr = `
    SELECT
      orderMain.Member_ID as memberId,
      orderMain.Transaction_Date as tradeDate,
      'POS' as source,
      orderMain.Order_Channel_ID as channelId,
      'POS' as orderType,
      orderDetail.Paid_Amount as amount,
      orderMain.Transaction_ID as transactionId,
      orderMain.Brand_ID as brandId,
      (SELECT Brand_Name FROM Brand WHERE Brand_ID = orderMain.Brand_ID) as brandName,
      orderMain.Store_ID as storeId,
      (SELECT Store_Name FROM Store WHERE Brand_ID = orderMain.Brand_ID AND Store_ID = orderMain.Store_ID) as storeName
    FROM
      Order_Main orderMain
      INNER JOIN Order_Detail orderDetail ON orderMain.Order_ID = orderDetail.Order_ID AND orderDetail.Is_Active = 1
    WHERE 1
      AND orderMain.Is_Active = 1
    LIMIT ?, ?
    `;

    const result = await this.internalConn.query(queryStr, [
      (page - 1) * perPage,
      perPage
    ]);

    return result;
  }

  async getReturnMainBatchDemo(page: number, perPage: number) {
    const queryStr = `
    SELECT
      orderMain.Member_ID as memberId,
      returnMain.Transaction_Date as tradeDate,
      'POS' as source,
      returnMain.Order_Channel_ID as channelId,
      'POS' as orderType,
      returnMain.Paid_Amount as amount,
      returnMain.Transaction_ID as transactionId,
      returnMain.Brand_ID as brandId,
      (SELECT Brand_Name FROM Brand WHERE Brand_ID = returnMain.Brand_ID) as brandName,
      returnMain.Store_ID as storeId,
      (SELECT Store_Name FROM Store WHERE Brand_ID = returnMain.Brand_ID AND Store_ID = returnMain.Store_ID) as storeName
    FROM
      Return_Main returnMain
      INNER JOIN Order_Main orderMain ON returnMain.Transaction_ID = orderMain.Transaction_ID AND orderMain.Is_Active = 1
    WHERE 1
      AND returnMain.Is_Active = 1
    LIMIT ?, ?
    `;

    const result = await this.internalConn.query(queryStr, [
      (page - 1) * perPage,
      perPage
    ]);

    return result;
  }

  /**
   *
   * @param req
   */
  async insertReturnBatchDemo(data) {
    const _authMemberId = this.escape('system');

    const queryStr = /* sql */ `
INSERT INTO Return_Main
(Order_Channel_ID, Transaction_ID, Transaction_Type, Transaction_Date, Completion_Date, Member_CardID, Brand_ID, Store_ID, Original_Amount, Paid_Amount, Create_ID, Alter_ID)
VALUES('Ch0001', ?, 2, ?, ?, ?, 'CX', 'S2212290073', ?, ?, ${_authMemberId}, ${_authMemberId});
;
  `;

    await this.internalConn.query(queryStr, [
      data?.transactionId,
      data?.tradeDate,
      data?.tradeDate,
      data?.cardId,
      data?.amount,
      data?.amount
    ]);
  }
}
