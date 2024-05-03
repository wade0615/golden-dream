import { Injectable } from '@nestjs/common';
import {
  CLUSTER_EVENT_STATUS,
  CLUSTER_LIST_TYPE,
  CLUSTER_STATE_TYPE
} from 'src/Definition/Enum/Cluster/cluster.list.type.enum';
import { CLUSTER_MEMBER_TYPE } from 'src/Definition/Enum/Cluster/cluster.member.type.enum';
import {
  CLUSTER_EXPORT_STATUS_TYPE,
  CLUSTER_SETTING_CONDITIONAL_TYPE,
  CLUSTER_SETTING_CONDITIONAL_TYPE_STR,
  CLUSTER_SETTING_MAIN_TYPE
} from 'src/Definition/Enum/Cluster/cluster.setting.type.enum';
import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import { COUPON_EXCHANGE_TYPE } from 'src/Definition/Enum/Coupon/coupon.type.enum';
import { MEMBER_COUPON_STATUS } from 'src/Definition/Enum/Coupon/member.coupon.status.enum';
import { ENUM_POINT_TYPE_LOG } from 'src/Definition/Enum/Coupon/point.type.log.enum';
import { LOG_ACTION } from 'src/Definition/Enum/Log/log.channel.action.enum';
import { REWARD_CARD_TYPE } from 'src/Definition/Enum/RewardCard/reward.card.type.enum';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import {
  ClusterDownloadList,
  GetClusterDownloadListDto
} from './Dto/get.cluster.download.list.dto';
import { NotifyGroupData } from './Dto/get.cluster.setting.detail.dto';
import {
  ClusterSettingList,
  GetClusterSettingListDto
} from './Dto/get.cluster.setting.list.dto';
import { UpdClusterCommonSettingDto } from './Dto/upd.cluster.common.setting.dto';
import { UpdClusterSettingDto } from './Dto/upd.cluster.setting.dto';
import { ClusterTempData } from './Interface/cluster.temp.data.interface';
import { GetClusterCommonSetting } from './Interface/get.cluster.common.setting.interface';
import { GetClusterManagementData } from './Interface/get.cluster.data.interface';
import { GetClusterDetail } from './Interface/get.cluster.detail.interface';
import { GetClusterExport } from './Interface/get.cluster.export.interface';
import { GetClusterSettingDetail } from './Interface/get.cluster.setting.detail.interface';
import { InsClusterSettingResp } from './Interface/ins.cluster.setting.interface';
import moment = require('moment-timezone');

@Injectable()
export class ClusterRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得分群共用設定
   *
   * @returns
   */
  async getClusterCommonSetting(): Promise<GetClusterCommonSetting[]> {
    const sqlStr = `
    SELECT
      Members_Type as membersType,
      Consumer as consumer,
      Not_Consumer as notConsumer
    FROM
      Cluster_Management
    WHERE Is_Active = 1
    `;

    const result = (await this.internalConn.query(sqlStr)) ?? [];

    return result;
  }

  /**
   * 修改分群通用設定
   *
   * @param connection DB 連線
   * @param req
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updClusterCommonSetting(
    connection,
    req: UpdClusterCommonSettingDto,
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Cluster_Management
    (Members_Type, Consumer, Not_Consumer, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    const params = [];
    for (const setting of req?.clusterCommonSetting) {
      if (i > 0) {
        sqlStr += ',';
      }
      sqlStr += `(?, ?, ?, ?, ?)`;

      params.push(
        setting?.membersType,
        setting?.consumer ?? 0,
        setting?.notConsumer ?? 0,
        authMemberId,
        authMemberId
      );
      i++;
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Consumer = VALUES(Consumer), Not_Consumer = VALUES(Not_Consumer)`;
    sqlStr += `, Alter_ID = VALUES(Alter_ID)`;

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 取得分群設定列表
   *
   * @param req
   * @returns
   */
  async getClusterSettingList(
    req: GetClusterSettingListDto
  ): Promise<ClusterSettingList[]> {
    let sqlStr = `
    SELECT
      cluster.Cluster_ID as clusterId,
      cluster.Cluster_Name as clusterName,
      cluster.People_Count as peopleCount,
      cluster.Export_Status as exportStatus,
      cluster.Export_Start_Date as exportStartDate,
      cluster.Export_End_Date as exportEndDate,
      cluster.Month_Every as monthEvery,
      cluster.Export_Data_Type as dataType,
      cluster.Create_Date as createTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = cluster.Create_ID), 'system') as createName,
      cluster.Alter_Date as alterTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = cluster.Alter_ID), 'system') as alterName
    FROM
      Cluster cluster
    WHERE cluster.Is_Active = 1
    `;
    const params = [];
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.CLUSTER_ID:
          sqlStr += ` AND cluster.Cluster_ID = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.CLUSTER_NAME:
          sqlStr += ` AND cluster.Cluster_Name = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.CLUSTER_DESCRIPTION:
          sqlStr += ` AND cluster.Cluster_Description = ?`;
          params.push(req?.search);
          break;
      }
    }

    switch (req?.state) {
      case CLUSTER_STATE_TYPE.ING:
        sqlStr += ` AND cluster.Export_Start_Date < NOW()`;
        sqlStr += ` AND cluster.Export_End_Date > NOW()`;
        break;
      case CLUSTER_STATE_TYPE.END:
        sqlStr += ` AND cluster.Cluster_Status = ?`;

        params.push(CLUSTER_STATE_TYPE.END);
        break;
      case CLUSTER_STATE_TYPE.PENDING:
        sqlStr += ` AND cluster.Export_Start_Date > NOW()`;
        break;
    }

    switch (req?.action) {
      case CLUSTER_LIST_TYPE.SINGLE:
        sqlStr += ` AND cluster.Export_Status IN (?, ?)`;
        params.push(
          CLUSTER_EXPORT_STATUS_TYPE.IMMEDIATE,
          CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_DATE
        );
        break;
      case CLUSTER_LIST_TYPE.REGULAR:
        sqlStr += ` AND cluster.Export_Status IN (?, ?, ?, ?)`;
        params.push(
          CLUSTER_EXPORT_STATUS_TYPE.EVERY_HALF_MONTH,
          CLUSTER_EXPORT_STATUS_TYPE.EVERY_MONTH,
          CLUSTER_EXPORT_STATUS_TYPE.EVERY_QUARTER,
          CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_RANGE_DATE
        );
        break;
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 取得分群設定列表總筆數
   *
   * @param req
   * @returns
   */
  async getClusterSettingListCount(
    req: GetClusterSettingListDto
  ): Promise<number> {
    let sqlStr = `
    SELECT
      COUNT(Cluster_ID) as clusterIdCount
    FROM
      Cluster
    WHERE Is_Active = 1
    `;
    const params = [];
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.CLUSTER_ID:
          sqlStr += ` AND Cluster_ID = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.CLUSTER_NAME:
          sqlStr += ` AND Cluster_Name = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.CLUSTER_DESCRIPTION:
          sqlStr += ` AND Cluster_Description = ?`;
          params.push(req?.search);
          break;
      }
    }

    switch (req?.state) {
      case CLUSTER_STATE_TYPE.ING:
        sqlStr += ` AND Export_Start_Date < NOW()`;
        sqlStr += ` AND Export_End_Date > NOW()`;
        break;
      case CLUSTER_STATE_TYPE.END:
        sqlStr += ` AND Cluster_Status = ?`;

        params.push(CLUSTER_STATE_TYPE.END);
        break;
      case CLUSTER_STATE_TYPE.PENDING:
        sqlStr += ` AND Export_Start_Date > NOW()`;
        break;
    }

    switch (req?.action) {
      case CLUSTER_LIST_TYPE.SINGLE:
        sqlStr += ` AND Export_Status IN (?, ?)`;
        params.push(
          CLUSTER_EXPORT_STATUS_TYPE.IMMEDIATE,
          CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_DATE
        );
        break;
      case CLUSTER_LIST_TYPE.REGULAR:
        sqlStr += ` AND Export_Status IN (?, ?, ?, ?)`;
        params.push(
          CLUSTER_EXPORT_STATUS_TYPE.EVERY_HALF_MONTH,
          CLUSTER_EXPORT_STATUS_TYPE.EVERY_MONTH,
          CLUSTER_EXPORT_STATUS_TYPE.EVERY_QUARTER,
          CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_RANGE_DATE
        );
        break;
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.clusterIdCount;
  }

  /**
   * 取得分群主表詳情
   *
   * @param clusterId 分群編號
   * @returns
   */
  async getClusterDetail(clusterId: string): Promise<GetClusterDetail> {
    const sqlStr = `
    SELECT
      Cluster_Name as clusterName,
      Cluster_Description as clusterDescription,
      Export_Status as exportStatus,
      Export_Start_Date as exportStartDate,
      Export_End_Date as exportEndDate,
      Month_Every as monthEvery,
      Export_Data_Type as exportDataType,
      People_Count as peopleCount
    FROM
      Cluster
    WHERE Is_Active = 1
      AND Cluster_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [clusterId]);

    return result?.[0];
  }

  /**
   * 取得分群設定詳情
   *
   * @param clusterId 分群編號
   * @returns
   */
  async getClusterSettingDetail(
    clusterId: string
  ): Promise<GetClusterSettingDetail[]> {
    const sqlStr = `
    SELECT
      Cluster_Main_Type as clusterMainType,
      Cluster_Conditional as clusterConditional,
      Cluster_Setting_Type as clusterSettingType,
      Cluster_Setting as clusterSetting
    FROM
      Cluster_Setting
    WHERE Is_Active = 1
      AND Cluster_ID = ?
    ORDER BY ID ASC
    `;

    const result = await this.internalConn.query(sqlStr, [clusterId]);

    return result;
  }

  /**
   * 取得分群匯出關聯
   *
   * @param clusterId 分群編號
   * @returns
   */
  async getClusterExport(clusterId: string): Promise<GetClusterExport[]> {
    const sqlStr = `
    SELECT
      Cluster_Params_Key as clusterParamsKey
    FROM
      Cluster_Export
    WHERE Is_Active = 1
      AND Cluster_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [clusterId]);

    return result;
  }

  /**
   * 取得分群匯出通知分類
   *
   * @param clusterId 分群編號
   * @returns
   */
  async getClusterExportNotify(clusterId: string): Promise<NotifyGroupData[]> {
    const sqlStr = `
    SELECT
      notifyGroup.ID as seq,
      notifyGroup.Group_Name as name
    FROM
      Cluster_Export_Notify clusterExportNotify
      JOIN Notify_Group notifyGroup ON clusterExportNotify.Notify_Group_Seq = notifyGroup.ID AND notifyGroup.Is_Active = 1
    WHERE clusterExportNotify.Is_Active = 1
      AND clusterExportNotify.Cluster_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [clusterId]);

    return result;
  }

  /**
   * 新增分群設定主表
   *
   * @param connection DB 連線
   * @param req
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insClusterData(
    connection,
    req: UpdClusterSettingDto,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const addData = {
      Cluster_ID: req?.clusterId,
      Cluster_Name: req?.clusterName,
      Cluster_Description: req?.clusterDescription,
      Export_Status: req?.exportStatus,
      Export_Start_Date: req?.exportStartDate ? req?.exportStartDate : null,
      Export_End_Date: req?.exportEndDate ? req?.exportEndDate : null,
      Month_Every: req?.monthEvery ? req?.monthEvery : 0,
      Export_Data_Type: req?.exportDataType ? req?.exportDataType : null,
      People_Count: req?.peopleCount,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `
    INSERT INTO Cluster SET ?
    ON DUPLICATE KEY UPDATE Cluster_Name = VALUES(Cluster_Name), Cluster_Description = VALUES(Cluster_Description),
    Export_Status = VALUES(Export_Status), Export_Start_Date = VALUES(Export_Start_Date), Export_End_Date = VALUES(Export_End_Date),
    Month_Every = VALUES(Month_Every), Export_Data_Type = VALUES(Export_Data_Type), Alter_ID = VALUES(Alter_ID),
    People_Count = VALUES(People_Count)
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [addData]);

    return {};
  }

  /**
   * 初始化匯出設定關聯表
   *
   * @param connection DB 連線
   * @param clusterId 分群編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initClusterExport(
    connection,
    clusterId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Cluster_Export SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Cluster_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      clusterId
    ]);

    return {};
  }

  /**
   * 新增匯出設定關聯表
   *
   * @param connection DB 連線
   * @param clusterId 分群編號
   * @param exportParamsKey 匯出的參數
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insClusterExport(
    connection,
    clusterId: string,
    exportParamsKey: string[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Cluster_Export
    (Cluster_ID, Cluster_Params_Key, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    const params = [];
    for (const paramsKey of exportParamsKey) {
      if (i > 0) {
        sqlStr += ',';
      }
      sqlStr += `(?, ?, ?, ?)`;

      params.push(clusterId, paramsKey, authMemberId, authMemberId);
      i++;
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Is_Active = 1, Alter_ID = VALUES(Alter_ID)`;

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 初始化匯出通知群組關聯表
   *
   * @param connection DB 連線
   * @param clusterId 分群編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initClusterExportNotify(
    connection,
    clusterId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Cluster_Export_Notify SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Cluster_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      clusterId
    ]);

    return {};
  }

  /**
   * 新增匯出通知群組關聯表
   *
   * @param connection DB 連線
   * @param clusterId 分群編號
   * @param notifyGroupIds 通知分類編號(複數)
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insClusterExportNotify(
    connection,
    clusterId: string,
    notifyGroupIds: string[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Cluster_Export_Notify
    (Cluster_ID, Notify_Group_Seq, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    const params = [];
    for (const groupId of notifyGroupIds) {
      if (i > 0) {
        sqlStr += ',';
      }
      sqlStr += `(?, ?, ?, ?)`;

      params.push(clusterId, groupId, authMemberId, authMemberId);
      i++;
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Is_Active = 1, Alter_ID = VALUES(Alter_ID)`;

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 初始化參數設定關聯表
   *
   * @param connection DB 連線
   * @param clusterId 分群編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initClusterSetting(
    connection,
    clusterId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Cluster_Setting SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Cluster_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      clusterId
    ]);

    return {};
  }

  /**
   * 新增參數設定關聯表
   *
   * @param connection DB 連線
   * @param clusterSetting
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insClusterSetting(
    connection,
    clusterSetting: InsClusterSettingResp[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Cluster_Setting
    (Cluster_ID, Cluster_Main_Type, Cluster_Conditional, Cluster_Setting_Type, Cluster_Setting, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    const params = [];
    for (const setting of clusterSetting) {
      if (i > 0) {
        sqlStr += ',';
      }
      sqlStr += `(?, ?, ?, ?, ?, ?, ?)`;

      params.push(
        setting?.clusterId,
        setting?.clusterMainType,
        setting?.clusterConditional,
        setting?.clusterSettingType,
        JSON.stringify(setting?.clusterSetting),
        authMemberId,
        authMemberId
      );
      i++;
    }

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 取得分群ID 最大值
   *
   * @returns
   */
  async getMaxClusterId(): Promise<string> {
    const sqlStr = `
    SELECT MAX(Cluster_ID) as maxClusterId FROM Cluster LIMIT 1
    `;

    const result = await this.internalConn.query(sqlStr);

    return result?.[0]?.maxClusterId;
  }

  /**
   * 設定分群設定 Sql - 基本資料
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async getMemberClusterSql(
    tableName: string,
    setting,
    exclude: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT DISTINCT
        member.Member_ID as memberId
      FROM
        IEat_Member member
        LEFT JOIN IEat_Member_Channel_Action_Log channelLog ON member.Member_ID = channelLog.Member_ID AND channelLog.Is_Active = 1
        LEFT JOIN IEat_Member_Special_Type specialType ON member.Member_Special_Type = specialType.ID AND specialType.Is_Active = 1
        LEFT JOIN Channel c ON c.Channel_ID = channelLog.Channel_ID AND c.Is_Active = 1
    `;
    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = member.Member_ID`;
    }

    sqlStr += ` WHERE member.Is_Active = 1`;

    let i = 0;
    for (const data of setting) {
      let conditional =
        i == 0
          ? ' AND ('
          : CLUSTER_SETTING_CONDITIONAL_TYPE_STR[data?.conditional] ?? '';
      conditional += ` ${exclude ?? ''}`;
      switch (data?.type) {
        case CLUSTER_SETTING_MAIN_TYPE.GENDER:
          sqlStr += ` ${conditional} member.Gender IN (${this.internalConn.escape(
            data?.data?.ids
          )})`;
          break;
        case CLUSTER_SETTING_MAIN_TYPE.AGE:
          const minDate = moment()
            .subtract(data?.data?.min, 'years')
            .format('YYYY-MM-DD');
          const maxDate = moment()
            .subtract(data?.data?.max, 'years')
            .format('YYYY-MM-DD');

          sqlStr +=
            data?.data?.conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
              ? ` ${conditional} member.Birthday BETWEEN ${this.internalConn.escape(
                  minDate
                )} AND ${this.internalConn.escape(maxDate)}`
              : ` ${conditional} member.Birthday ${
                  CLUSTER_SETTING_CONDITIONAL_TYPE_STR[data?.data?.conditional]
                } ${this.internalConn.escape(minDate)}`;
          break;
        case CLUSTER_SETTING_MAIN_TYPE.BIRTHDAY_MONTH:
          sqlStr += ` ${conditional} MONTH(member.Birthday) IN (${this.internalConn.escape(
            data?.data?.ids
          )})`;
          break;
        case CLUSTER_SETTING_MAIN_TYPE.ADDRESS:
          const zipCode = data?.data?.cityZip?.map((x) => x.zipCode);
          sqlStr += ` ${conditional} member.Zip_Code IN (${this.internalConn.escape(
            zipCode
          )})`;
          break;
        case CLUSTER_SETTING_MAIN_TYPE.REGISTRATION_DATE:
          switch (data?.data?.conditional) {
            case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
              sqlStr += ` ${conditional} member.Create_Date BETWEEN ${this.internalConn.escape(
                data?.data?.start
              )} AND ${this.internalConn.escape(data?.data?.end)}`;
              break;
            case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
              sqlStr += ` ${conditional} member.Create_Date <= NOW()`;
              break;
            default:
              sqlStr += ` ${conditional} DATEDIFF(NOW(), member.Create_Date) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[data?.data?.conditional]
              } ${this.internalConn.escape(data?.data?.within)}`;
          }
          break;
        case CLUSTER_SETTING_MAIN_TYPE.REGISTRATION_CHANNEL:
          sqlStr += ` ${conditional} (channelLog.Channel_Action = 1 AND channelLog.Channel_ID IN (${this.internalConn.escape(
            data?.data?.ids
          )}))`;
          break;
        case CLUSTER_SETTING_MAIN_TYPE.OPEN_CHANNEL:
          sqlStr += ` ${conditional} (channelLog.Channel_Action = 2 AND channelLog.Channel_ID IN (${this.internalConn.escape(
            data?.data?.ids
          )}))`;
          break;
        case CLUSTER_SETTING_MAIN_TYPE.UN_OPEN_CHANNEL:
          sqlStr += ` ${conditional} (channelLog.Channel_Action = 2 AND channelLog.Channel_ID NOT IN (${this.internalConn.escape(
            data?.data?.ids
          )}))`;
          break;
        case CLUSTER_SETTING_MAIN_TYPE.SPECIAL_MEMBER_TYPE:
          sqlStr += ` ${conditional} (specialType.Special_Type_Status = 1 AND member.Member_Special_Type IN (${this.internalConn.escape(
            data?.data?.ids
          )}))`;
          break;
      }
      i++;
    }
    sqlStr += `)`; // AND ( ... )

    clusterTempData?.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 Sql - 會籍
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async setMemberShipClusterSql(
    tableName: string,
    setting,
    exclude: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT DISTINCT
        shipLog.Member_ID as memberId
      FROM
        IEat_Member_Ship_Branch shipBranch
        JOIN IEat_Member_Ship_Log shipLog ON shipBranch.Member_Ship_Branch_ID = shipLog.Branch_ID AND shipLog.Is_Active = 1
        JOIN IEat_Member member ON shipLog.Member_ID = member.Member_ID AND member.Is_Active = 1
    `;
    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = member.Member_ID`;
    }

    sqlStr += ` WHERE shipBranch.Is_Active = 1`;

    const conditional = setting?.data?.conditional;
    switch (setting?.type) {
      case CLUSTER_SETTING_MAIN_TYPE.MEMBER_SHIP:
        sqlStr += ` AND shipLog.ID IN (SELECT MAX(ID) FROM IEat_Member_Ship_Log GROUP BY Member_ID)`;
        sqlStr += ` AND ${exclude} shipLog.Branch_ID IN (${this.internalConn.escape(
          setting?.data?.ids
        )})`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.MEMBER_SHIP_UPGRADE_DATE:
        sqlStr += ` AND shipLog.ID IN (SELECT MAX(ID) FROM IEat_Member_Ship_Log WHERE Action_Type = 2 GROUP BY Member_ID)`;
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND shipLog.Start_Date BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND shipLog.Start_Date <= NOW()`;
            break;
          default:
            sqlStr += ` AND DATEDIFF(NOW(), shipLog.Start_Date) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }
        break;
      case CLUSTER_SETTING_MAIN_TYPE.MEMBER_SHIP_EXPIRED_DATE:
        sqlStr += ` AND shipLog.ID IN (SELECT MAX(ID) FROM IEat_Member_Ship_Log GROUP BY Member_ID)`;
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND shipLog.End_Date BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND shipLog.End_Date <= NOW()`;
            break;
          default:
            sqlStr += ` AND DATEDIFF(NOW(), shipLog.End_Date) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }
        break;
      case CLUSTER_SETTING_MAIN_TYPE.UPGRADE_DIFF_AMOUNT:
        sqlStr += ` AND shipLog.ID IN (SELECT MAX(ID) FROM IEat_Member_Ship_Log GROUP BY Member_ID)`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` AND shipBranch.Purchased_Times - shipLog.Total_Amount BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` AND shipBranch.Purchased_Times - shipLog.Total_Amount ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.UPGRADE_DIFF_COUNT:
        sqlStr += ` AND shipLog.ID IN (SELECT MAX(ID) FROM IEat_Member_Ship_Log GROUP BY Member_ID)`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` AND shipBranch.Purchased_Count - shipLog.Total_Count BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` AND shipBranch.Purchased_Count - shipLog.Total_Count ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
    }

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 Sql - 會員積點歷程
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async setMemberPointClusterSql(
    tableName: string,
    setting,
    exclude: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT DISTINCT
        memberPoint.Member_ID as memberId
      FROM
        Member_Point memberPoint
        JOIN IEat_Member member ON memberPoint.Member_ID = member.Member_ID AND member.Is_Active = 1
    `;

    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = member.Member_ID`;
    }

    sqlStr += ` WHERE 1`;

    const conditional = setting?.data?.conditional;
    switch (setting?.type) {
      case CLUSTER_SETTING_MAIN_TYPE.LAST_POINT:
        sqlStr += ` AND memberPoint.Expired_Date > NOW()`;
        sqlStr += ` GROUP BY memberPoint.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} SUM(memberPoint.Point) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} SUM(memberPoint.Point) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)} `;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.POINT_EXPIRED_DATE:
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND ${exclude} memberPoint.Expired_Date BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND ${exclude} memberPoint.Expired_Date <= NOW()`;
            break;
          default:
            sqlStr += ` AND ${exclude} DATEDIFF(NOW(), memberPoint.Expired_Date) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }
        sqlStr += ` GROUP BY memberPoint.Member_ID`;
        break;
    }

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 Sql - 會員積點歷程
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param orderTableNames
   * @param clusterTempData
   * @returns
   */
  async setMemberPointLogClusterSql(
    tableName: string,
    setting,
    exclude: string,
    orderTableNames: string[],
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    const unionClauses = orderTableNames
      .map(
        (orderTableName) => `
          SELECT
            orders.Mobile_Country_Code as mobileCountryCode,
            orders.Mobile as mobile,
            orders.ID as id,
            orders.Member_ID as memberId,
            orders.Order_ID as orderId,
            orders.Point_Type as pointType,
            orders.Point as point,
            orders.Create_Date as createDate,
            pointRules.Reward_Name as pointRewardName
          FROM
            ${orderTableName} orders
            JOIN Point_Reward_Rules pointRules ON orders.Order_ID = pointRules.Point_Reward_ID AND pointRules.Is_Active = 1
          `
      )
      .join('\nUNION ALL\n');

    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} AS (
      SELECT
        COUNT(combinedLog.id) as pointUseCount,
        combinedLog.mobileCountryCode,
        combinedLog.mobile,
        combinedLog.memberId,
        combinedLog.orderId,
        SUM(combinedLog.point) as usePoint,
        GROUP_CONCAT(DISTINCT combinedLog.orderId ORDER BY orderId ASC SEPARATOR ';') as pointRewardId,
        GROUP_CONCAT(DISTINCT combinedLog.pointRewardName ORDER BY pointRewardName ASC SEPARATOR ';') as pointRewardName
      FROM (
        ${unionClauses}
      ) combinedLog
    `;
    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = combinedLog.memberId`;
    }

    sqlStr += ` WHERE 1`;

    const conditional = setting?.data?.conditional;
    switch (setting?.type) {
      case CLUSTER_SETTING_MAIN_TYPE.POINT_ACTIVITY:
        sqlStr += ` GROUP BY combinedLog.memberId`;
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` HAVING ${exclude} combinedLog.orderId IN (${this.internalConn.escape(
            setting?.data?.ids
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`pointRewardId LIKE '%${id}%'`);
          }
          sqlStr += ` HAVING ${exclude} (${tmpSql.join(' AND ')})`;
        }

        break;
      case CLUSTER_SETTING_MAIN_TYPE.USED_POINT:
        sqlStr += ` GROUP BY combinedLog.memberId`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} SUM(combinedLog.point) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} SUM(combinedLog.point) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)} `;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.USED_POINT_DATE:
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND ${exclude} (combinedLog.createDate BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND ${exclude} (combinedLog.createDate <= NOW()`;
            break;
          default:
            sqlStr += ` AND ${exclude} (DATEDIFF(NOW(), combinedLog.createDate) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }

        sqlStr += ` AND combinedLog.pointType IN ('${ENUM_POINT_TYPE_LOG.DISCOUNT}', '${ENUM_POINT_TYPE_LOG.COMMODITY}'))`;
        sqlStr += ` GROUP BY combinedLog.memberId`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.POINT_USE:
        sqlStr += ` AND DATEDIFF(NOW(), combinedLog.createDate) <= ${this.internalConn.escape(
          setting?.data?.within
        )}`;
        sqlStr += ` AND combinedLog.pointType IN (${this.internalConn.escape(
          ENUM_POINT_TYPE_LOG.DISCOUNT
        )}, ${this.internalConn.escape(ENUM_POINT_TYPE_LOG.COMMODITY)})`;
        sqlStr += ` GROUP BY combinedLog.memberId`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(combinedLog.id) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(combinedLog.id) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
    }

    sqlStr += `)`;

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 sql - 活躍度
   *
   * @param tableName
   * @param common
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async setMemberManagementClusterSql(
    tableName: string,
    common: GetClusterManagementData,
    exclude: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT DISTINCT
        member.Member_ID as memberId
      FROM
        IEat_Member member
        LEFT JOIN Order_Main orderMain ON member.Member_ID = orderMain.Member_ID AND orderMain.Is_Active = 1
    `;
    if (common.memberType == CLUSTER_MEMBER_TYPE.LOST) {
      sqlStr += ` AND ${exclude} DATEDIFF(NOW(), orderMain.Transaction_Date) >= ${common.consumer}`;
    }

    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = member.Member_ID`;
    }

    sqlStr += ` WHERE member.Is_Active = 1`;

    switch (common.memberType) {
      case CLUSTER_MEMBER_TYPE.MAIN:
        sqlStr += ` AND ${exclude} DATEDIFF(NOW(), orderMain.Transaction_Date) <= ${common.consumer}`;
        break;
      case CLUSTER_MEMBER_TYPE.DROWSY:
      case CLUSTER_MEMBER_TYPE.SLEEPY:
        sqlStr += ` AND ${exclude} DATEDIFF(NOW(), orderMain.Transaction_Date) BETWEEN ${
          common.consumer + 1
        } AND ${common.notConsumer}`;
        break;
    }

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 Sql - 標籤
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async setMemberTagClusterSql(
    tableName: string,
    setting,
    exclude: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT DISTINCT
        memberTag.Member_ID as memberId
      FROM
        Tag tag
        LEFT JOIN Map_Tag_Member memberTag ON tag.Tag_ID = memberTag.Tag_ID AND memberTag.Is_Active = 1
        JOIN IEat_Member member ON memberTag.Member_ID = member.Member_ID AND member.Is_Active = 1
    `;
    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = member.Member_ID`;
    }

    sqlStr += ` WHERE tag.Is_Active = 1`;

    const conditional = setting?.data?.conditional;
    switch (setting?.type) {
      case CLUSTER_SETTING_MAIN_TYPE.MEMBER_TAG:
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` AND ${exclude} memberTag.Tag_ID IN (${this.internalConn.escape(
            setting?.data?.ids
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`memberTag.Tag_ID LIKE '%${id}%'`);
          }
          sqlStr += ` AND ${exclude} (${tmpSql.join(' AND ')})`;
        }

        sqlStr += ` GROUP BY memberTag.Member_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.USE_TAG_DATE:
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND ${exclude} memberTag.Create_Date BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND ${exclude} memberTag.Create_Date <= NOW()`;
            break;
          default:
            sqlStr += ` AND ${exclude} DATEDIFF(NOW(), memberTag.Create_Date) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }
        break;
    }

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 Sql - 訂位
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async setBookingDetailClusterSql(
    tableName: string,
    setting,
    exclude: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT DISTINCT
        members.Member_ID as memberId
      FROM
        Booking_Detail bookingDetail
        JOIN IEat_Member members ON members.Member_CardID = bookingDetail.Member_Card_ID AND members.Is_Active = 1
        JOIN Brand brand ON brand.Brand_Name = bookingDetail.Brand_Name AND brand.Is_Active = 1
        JOIN Store store ON store.Store_Name = bookingDetail.Store_Name AND store.Is_Active = 1
    `;
    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = member.Member_ID`;
    }
    sqlStr += ` WHERE bookingDetail.Is_Active = 1`;

    const conditional = setting?.data?.conditional;
    switch (setting?.type) {
      case CLUSTER_SETTING_MAIN_TYPE.BOOKING_BRAND:
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` AND ${exclude} brand.Brand_ID IN (${this.internalConn.escape(
            setting?.data?.ids
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`brand.Brand_ID LIKE '%${id}%'`);
          }
          sqlStr += ` AND ${exclude} (${tmpSql.join(' AND ')})`;
        }

        sqlStr += ` GROUP BY members.Member_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.BOOKING_STORE:
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` AND ${exclude} store.Store_ID IN (${this.internalConn.escape(
            setting?.data?.ids
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`store.Store_ID LIKE '%${id}%'`);
          }
          sqlStr += ` AND ${exclude} (${tmpSql.join(' AND ')})`;
        }

        sqlStr += ` GROUP BY members.Member_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.BOOKING_PEOPLE:
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` AND ${exclude} bookingDetail.Booking_People_Adult BETWEEN ${this.internalConn.escape(
                setting?.data?.adult?.min
              )} AND ${this.internalConn.escape(setting?.data?.adult?.max)}`
            : ` AND ${exclude} bookingDetail.Booking_People_Adult ${
                setting?.data?.adult?.conditional
              } ${this.internalConn.escape(setting?.data?.adult?.min)}`;

        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` AND ${exclude} bookingDetail.Booking_People_Child BETWEEN ${this.internalConn.escape(
                setting?.data?.child?.min
              )} AND ${this.internalConn.escape(setting?.data?.child?.max)}`
            : ` AND ${exclude} bookingDetail.Booking_People_Child ${
                setting?.data?.child?.conditional
              } ${this.internalConn.escape(setting?.data?.child?.min)}`;

        sqlStr += ` GROUP BY members.Member_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.BOOKING_COUNT:
        sqlStr += ` GROUP BY members.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(bookingDetail.Booking_ID) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(bookingDetail.Booking_ID) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.NOT_CHECK_IN_COUNT:
        sqlStr += ` AND bookingDetail.Status = 1`;
        sqlStr += ` GROUP BY members.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(bookingDetail.Booking_ID) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(bookingDetail.Booking_ID) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.MEAL_DATE:
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND ${exclude} bookingDetail.Meal_Date BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND ${exclude} bookingDetail.Meal_Date <= NOW()`;
            break;
          default:
            sqlStr += ` AND ${exclude} DATEDIFF(NOW(), bookingDetail.Meal_Date) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }
        break;
    }

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 Sql - 兌換券
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async setMemberCouponClusterSql(
    tableName: string,
    setting,
    exclude: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT DISTINCT
        couponDetail.Exchange_Member_ID as memberId
      FROM
        Coupon_Detail couponDetail
        JOIN Coupon coupon ON couponDetail.Coupon_ID = coupon.Coupon_ID AND coupon.Is_Active = 1
        JOIN IEat_Member member ON couponDetail.Exchange_Member_ID = member.Member_ID AND member.Is_Active = 1
    `;
    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = member.Member_ID`;
    }

    sqlStr += ` WHERE couponDetail.Is_Active = 1`;

    const conditional = setting?.data?.conditional;
    switch (setting?.type) {
      case CLUSTER_SETTING_MAIN_TYPE.RECEIVED_DISCOUNT_COUNT:
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` AND couponDetail.Coupon_ID ${exclude} IN (${this.internalConn.escape(
            setting?.data?.ids
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`couponDetail.Coupon_ID LIKE '%${id}%'`);
          }
          sqlStr += ` AND ${exclude} (${tmpSql.join(' AND ')})`;
        }

        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID, coupon.Coupon_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.VALID_DISCOUNT_COUNT:
        sqlStr += ` AND coupon.Coupon_Type = ${this.internalConn.escape(
          COUPON_EXCHANGE_TYPE.DISCOUNT
        )}`;
        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID, coupon.Coupon_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(couponDetail.ID) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(couponDetail.ID) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_EXPIRATION_DATE:
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND ${exclude} (couponDetail.Coupon_End_Date BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND ${exclude} (couponDetail.Coupon_End_Date <= NOW()`;
            break;
          default:
            sqlStr += ` AND ${exclude} (DATEDIFF(NOW(), couponDetail.Coupon_End_Date) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }
        sqlStr += ` AND coupon.Coupon_Type = ${this.internalConn.escape(
          COUPON_EXCHANGE_TYPE.DISCOUNT
        )})`;
        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID, coupon.Coupon_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_DISCOUNT_COUPON:
      case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_COMMODITY_COUPON:
        sqlStr += ` AND (couponDetail.Coupon_ID ${exclude} IN (${this.internalConn.escape(
          setting?.data?.ids
        )})`;
        sqlStr += ` AND couponDetail.Transaction_Type = ${this.internalConn.escape(
          MEMBER_COUPON_STATUS.VERIFIED
        )})`;
        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_DISCOUNT_COUPON_COUNT:
        sqlStr += ` AND couponDetail.Transaction_Type = ${this.internalConn.escape(
          MEMBER_COUPON_STATUS.VERIFIED
        )}`;
        sqlStr += ` AND coupon.Coupon_Type = ${this.internalConn.escape(
          COUPON_EXCHANGE_TYPE.DISCOUNT
        )}`;
        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID, coupon.Coupon_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(couponDetail.ID) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(couponDetail.ID) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_DISCOUNT_COUPON_DATE:
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND ${exclude} couponDetail.Writeoff_Date BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND ${exclude} couponDetail.Writeoff_Date <= NOW()`;
            break;
          default:
            sqlStr += ` AND ${exclude} DATEDIFF(NOW(), couponDetail.Writeoff_Date) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }
        sqlStr += ` AND coupon.Coupon_Type = ${this.internalConn.escape(
          COUPON_EXCHANGE_TYPE.DISCOUNT
        )}`;
        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID, coupon.Coupon_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.COMMODITY_COUPON:
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` AND couponDetail.Coupon_ID ${exclude} IN (${this.internalConn.escape(
            setting?.data?.ids
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`couponDetail.Coupon_ID LIKE '%${id}%'`);
          }
          sqlStr += ` AND ${exclude} (${tmpSql.join(' AND ')})`;
        }
        sqlStr += ` AND couponDetail.Transaction_Type = ${this.internalConn.escape(
          MEMBER_COUPON_STATUS.RECEIVED
        )}`;
        sqlStr += ` AND couponDetail.Coupon_End_Date > NOW()`;
        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID, coupon.Coupon_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.COMMODITY_COUPON_EXPIRED_DATE:
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND ${exclude} (couponDetail.Coupon_End_Date BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND ${exclude} (couponDetail.Coupon_End_Date <= NOW()`;
            break;
          default:
            sqlStr += ` AND ${exclude} (DATEDIFF(NOW(), couponDetail.Coupon_End_Date) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }
        sqlStr += ` AND couponDetail.Transaction_Type = ${this.internalConn.escape(
          MEMBER_COUPON_STATUS.RECEIVED
        )}`;
        sqlStr += ` AND coupon.Coupon_Type = ${this.internalConn.escape(
          COUPON_EXCHANGE_TYPE.COMMODITY
        )})`;
        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID, coupon.Coupon_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_STORE:
        sqlStr += ` AND (couponDetail.Writeoff_Store_ID ${exclude} IN (${this.internalConn.escape(
          setting?.data?.ids
        )})`;
        sqlStr += ` AND coupon.Coupon_Type = ${this.internalConn.escape(
          COUPON_EXCHANGE_TYPE.COMMODITY
        )})`;
        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID, coupon.Coupon_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_COMMODITY_COUPON_DATE:
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND ${exclude} (couponDetail.Writeoff_Date BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND ${exclude} (couponDetail.Writeoff_Date <= NOW()`;
            break;
          default:
            sqlStr += ` AND ${exclude} (DATEDIFF(NOW(), couponDetail.Writeoff_Date) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }
        sqlStr += ` AND coupon.Coupon_Type = ${this.internalConn.escape(
          COUPON_EXCHANGE_TYPE.COMMODITY
        )})`;
        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID, coupon.Coupon_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.NOT_WRITE_OFF_COMMODITY_COUPON:
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` AND couponDetail.Coupon_ID ${exclude} IN (${this.internalConn.escape(
            setting?.data?.ids
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`couponDetail.Coupon_ID LIKE '%${id}%'`);
          }
          sqlStr += ` AND ${exclude} (${tmpSql.join(' AND ')})`;
        }

        sqlStr += ` AND couponDetail.Transaction_Type = ${this.internalConn.escape(
          MEMBER_COUPON_STATUS.RECEIVED
        )}`;
        sqlStr += ` AND couponDetail.Coupon_End_Date <= NOW()`;
        sqlStr += ` AND coupon.Coupon_Type = ${this.internalConn.escape(
          COUPON_EXCHANGE_TYPE.COMMODITY
        )}`;
        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID, coupon.Coupon_ID`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_WRITE_OFF:
        sqlStr += ` AND DATEDIFF(NOW(), couponDetail.Create_Date) <= ${this.internalConn.escape(
          setting?.data?.within
        )}`;
        sqlStr += ` AND coupon.Coupon_Type = ${this.internalConn.escape(
          COUPON_EXCHANGE_TYPE.DISCOUNT
        )}`;
        sqlStr += ` AND couponDetail.Transaction_Type = ${this.internalConn.escape(
          MEMBER_COUPON_STATUS.VERIFIED
        )}`;
        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID, coupon.Coupon_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(couponDetail.ID) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(couponDetail.ID) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.COMMODITY_WRITE_OFF:
        sqlStr += ` AND DATEDIFF(NOW(), couponDetail.Create_Date) <= ${this.internalConn.escape(
          setting?.data?.within
        )}`;
        sqlStr += ` AND coupon.Coupon_Type = ${this.internalConn.escape(
          COUPON_EXCHANGE_TYPE.COMMODITY
        )}`;
        sqlStr += ` AND couponDetail.Transaction_Type = ${this.internalConn.escape(
          MEMBER_COUPON_STATUS.VERIFIED
        )}`;
        sqlStr += ` GROUP BY couponDetail.Exchange_Member_ID, coupon.Coupon_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(couponDetail.ID) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(couponDetail.ID) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
    }

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 Sql - 集點卡
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async setRewardBalanceClusterSql(
    tableName: string,
    setting,
    exclude: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT DISTINCT
        rewardBalance.Member_ID as memberId
      FROM
        Reward_Card rewardCard
        JOIN Reward_Member_Balance rewardBalance ON rewardCard.Reward_Card_ID = rewardBalance.Reward_Card_ID
        JOIN IEat_Member member ON rewardBalance.Member_ID = member.Member_ID AND member.Is_Active = 1
    `;
    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = member.Member_ID`;
    }

    sqlStr += ` WHERE rewardCard.Is_Active = 1`;

    const conditional = setting?.data?.conditional;
    switch (setting?.type) {
      case CLUSTER_SETTING_MAIN_TYPE.REWARD_CARD:
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` AND rewardBalance.Reward_Card_ID ${exclude} IN (${this.internalConn.escape(
            setting?.data?.ids
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`rewardBalance.Reward_Card_ID LIKE '%${id}%'`);
          }
          sqlStr += ` AND ${exclude} (${tmpSql.join(' AND ')})`;
        }

        break;
      case CLUSTER_SETTING_MAIN_TYPE.REWARD_CARD_DIFF_POINT:
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` AND ${exclude} rewardCard.Reward_Card_Max_Point - rewardBalance.Reward_Point BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` AND ${exclude} rewardCard.Reward_Card_Max_Point - rewardBalance.Reward_Point ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        sqlStr += ` AND rewardCard.Reward_Card_Max_Point > rewardBalance.Reward_Point`;
        break;
    }

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 Sql - 集點卡歷程
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async setRewardDetailClusterSql(
    tableName: string,
    setting,
    exclude: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT DISTINCT
        rewardDetail.Member_ID as memberId
      FROM
        Reward_Card_Detail rewardDetail
        JOIN Reward_Card rewardCard ON rewardDetail.Reward_Card_ID = rewardCard.Reward_Card_ID AND rewardCard.Is_Active = 1
        JOIN IEat_Member member ON rewardDetail.Member_ID = member.Member_ID AND member.Is_Active = 1
    `;
    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = member.Member_ID`;
    }

    sqlStr += ` WHERE rewardDetail.Is_Active = 1`;

    const conditional = setting?.data?.conditional;
    switch (setting?.type) {
      case CLUSTER_SETTING_MAIN_TYPE.RECEIVED_REWARD_CARD:
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` AND rewardDetail.Reward_Card_ID ${exclude} IN (${this.internalConn.escape(
            setting?.data?.ids
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`rewardDetail.Reward_Card_ID LIKE '%${id}%'`);
          }
          sqlStr += ` AND ${exclude} (${tmpSql.join(' AND ')})`;
        }
        break;
      case CLUSTER_SETTING_MAIN_TYPE.RECEIVED_REWARD_CARD_POINT:
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` AND ${exclude} (rewardDetail.Point BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` AND ${exclude} rewardDetail.Point ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        sqlStr += ` AND rewardDetail.Transaction_Type = ${this.internalConn.escape(
          REWARD_CARD_TYPE.COUPON
        )})`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.REDEEMED_REWARD_CARD_DATE:
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND ${exclude} rewardDetail.Create_Date BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND ${exclude} rewardDetail.Create_Date <= NOW()`;
            break;
          default:
            sqlStr += ` AND ${exclude} DATEDIFF(NOW(), rewardDetail.Create_Date) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }

        sqlStr += ` AND rewardDetail.Transaction_Type = ${this.internalConn.escape(
          REWARD_CARD_TYPE.COUPON
        )}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.REWARD_CARD_REDEEM:
        sqlStr += ` AND DATEDIFF(NOW(), rewardDetail.Create_Date) <= ${this.internalConn.escape(
          setting?.data?.within
        )}`;
        sqlStr += ` AND rewardDetail.Transaction_Type = ${this.internalConn.escape(
          REWARD_CARD_TYPE.COUPON
        )}`;
        sqlStr += ` GROUP BY rewardDetail.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(rewardDetail.ID) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(rewardDetail.ID) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
    }

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 Sql - 會員互動
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async setMemberLogClusterSql(
    tableName: string,
    setting,
    exclude,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT DISTINCT
        channelLog.Member_ID as memberId
      FROM
        IEat_Member_Channel_Action_Log channelLog
        JOIN Channel c ON channelLog.Channel_ID = c.Channel_ID AND c.Is_Active = 1
        JOIN IEat_Member member ON channelLog.Member_ID = member.Member_ID AND member.Is_Active = 1
    `;

    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = member.Member_ID`;
    }

    sqlStr += ` WHERE channelLog.Is_Active = 1`;

    const conditional = setting?.data?.conditional;
    switch (setting?.type) {
      case CLUSTER_SETTING_MAIN_TYPE.MEMBER_SIGN_IN:
        sqlStr += ` AND DATEDIFF(NOW(), channelLog.Create_Date) <= ${this.internalConn.escape(
          setting?.data?.within
        )}`;
        sqlStr += ` AND channelLog.Channel_Action = ${this.internalConn.escape(
          LOG_ACTION.SIGN_IN
        )}`;
        sqlStr += ` GROUP BY channelLog.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(DISTINCT DATE_FORMAT(channelLog.Create_Date, '%Y-%m-%d')) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(DISTINCT DATE_FORMAT(channelLog.Create_Date, '%Y-%m-%d')) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.SIGN_IN_CHANNEL:
        sqlStr += ` AND channelLog.Channel_ID ${exclude} IN (${this.internalConn.escape(
          setting?.data?.ids
        )})`;
        sqlStr += ` AND channelLog.Channel_Action = ${this.internalConn.escape(
          LOG_ACTION.SIGN_IN
        )}`;
        break;
    }

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 Sql - 會員推薦人數
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async setMemberReferrerClusterSql(
    tableName: string,
    setting,
    exclude: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT
        (SELECT Member_ID FROM IEat_Member WHERE Referrer_Code = member.Referrer_Member) as memberId
      FROM
        IEat_Member member
    `;
    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = member.Member_ID`;
    }

    sqlStr += `
    WHERE member.Is_Active = 1
      AND (member.Referrer_Member IS NOT NULL && member.Referrer_Member != '')
    `;

    const conditional = setting?.data?.conditional;
    switch (setting?.type) {
      case CLUSTER_SETTING_MAIN_TYPE.REFERRER_PEOPLE:
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(1) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING  ${exclude} COUNT(1) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
    }

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 Sql - 銷售訂單
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async setMemberOrderClusterSql(
    tableName: string,
    setting,
    exclude: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT
        orderMain.Member_ID as memberId
      FROM
        Order_Main orderMain
        JOIN Order_Detail orderDetail ON orderMain.Order_ID = orderDetail.Order_ID AND orderDetail.Is_Active = 1
        LEFT JOIN Order_Detail_Product orderProduct ON orderMain.Transaction_ID = orderProduct.Transaction_ID AND orderProduct.Is_Active = 1
        JOIN Channel c ON orderMain.Order_Channel_ID = c.Channel_ID AND c.Is_Active = 1
        JOIN Brand brand ON orderMain.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
        JOIN Store store ON orderMain.Store_ID = store.Store_ID AND store.Is_Active = 1
        JOIN Payment_Setting paymentSetting ON orderDetail.Payment_Method = paymentSetting.ID AND paymentSetting.Is_Active = 1
    `;
    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = orderMain.Member_ID`;
    }

    sqlStr += ` WHERE orderMain.Is_Active = 1`;

    const conditional = setting?.data?.conditional;
    switch (setting?.type) {
      case CLUSTER_SETTING_MAIN_TYPE.ORDER_CHANNEL:
        sqlStr += ` AND orderMain.Order_Channel_ID ${exclude} IN (${this.internalConn.escape(
          setting?.data?.ids
        )})`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.ORDER_BRAND:
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` AND orderMain.Brand_ID ${exclude} IN (${this.internalConn.escape(
            setting?.data?.ids
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`orderMain.Brand_ID LIKE '%${id}%'`);
          }
          sqlStr += ` AND ${exclude} (${tmpSql.join(' AND ')})`;
        }
        break;
      case CLUSTER_SETTING_MAIN_TYPE.ORDER_STORE:
        sqlStr += ` AND orderMain.Store_ID ${exclude} IN (${this.internalConn.escape(
          setting?.data?.ids
        )})`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.ORDER_DATE:
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND ${exclude} orderMain.Transaction_Date BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND ${exclude} orderMain.Transaction_Date <= NOW()`;
            break;
          default:
            sqlStr += ` AND ${exclude} DATEDIFF(NOW(), orderMain.Transaction_Date) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }
        break;
      case CLUSTER_SETTING_MAIN_TYPE.ORDER_PEOPLE:
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` AND ${exclude} orderDetail.Number_of_People BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` AND ${exclude} orderDetail.Number_of_People ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;

        switch (setting?.data?.containsChild) {
          case 'YES':
            sqlStr += ` AND orderDetail.Has_Children = 1`;
            break;
          case 'NO':
            sqlStr += ` AND orderDetail.Has_Children = 0`;
            break;
        }
        break;
      case CLUSTER_SETTING_MAIN_TYPE.ORDER_MEAL_DATE:
        sqlStr += ` AND orderMain.Meal_Period_ID ${exclude} IN (${this.internalConn.escape(
          setting?.data?.ids
        )}) `;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.ORDER_COMMODITY:
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` AND orderProduct.Product_ID ${exclude} IN (${this.internalConn.escape(
            setting?.data?.ids
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`orderProduct.Product_ID LIKE '%${id}%'`);
          }
          sqlStr += ` AND ${exclude} (${tmpSql.join(' AND ')})`;
        }
        break;
      case CLUSTER_SETTING_MAIN_TYPE.ORDER_COUNT:
        sqlStr += ` GROUP BY orderMain.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(orderMain.Order_ID) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(orderMain.Order_ID) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.ORDER_ORIGINAL_AMOUNT:
        sqlStr += ` GROUP BY orderMain.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} SUM(orderDetail.Original_Amount) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} SUM(orderDetail.Original_Amount) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.ORDER_PAID_AMOUNT:
        sqlStr += ` GROUP BY orderMain.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} SUM(orderDetail.Paid_Amount) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} SUM(orderDetail.Paid_Amount) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_COUNT:
        sqlStr += ` AND orderDetail.Discount_Amount > 0`;
        sqlStr += ` GROUP BY orderMain.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(1) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(1) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_AMOUNT:
        sqlStr += ` AND orderDetail.Discount_Amount > 0`;
        sqlStr += ` GROUP BY orderMain.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} SUM(orderDetail.Discount_Amount) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} SUM(orderDetail.Discount_Amount) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_POINT_COUNT:
        sqlStr += ` AND orderDetail.Point_Deduction > 0`;
        sqlStr += ` GROUP BY orderMain.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(1) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(1) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_POINT:
        sqlStr += ` AND orderDetail.Point_Deduction > 0`;
        sqlStr += ` GROUP BY orderMain.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} SUM(orderDetail.Point_Deduction) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} SUM(orderDetail.Point_Deduction) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.DELIVERY:
        const zipCode = setting?.data?.cityZip?.map((x) => x.zipCode);
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` AND orderDetail.Delivery_District ${exclude} IN (${this.internalConn.escape(
            zipCode
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`orderDetail.Delivery_District LIKE '%${id}%'`);
          }
          sqlStr += ` AND ${exclude} (${tmpSql.join(' AND ')})`;
        }
        break;
      case CLUSTER_SETTING_MAIN_TYPE.PAYMENT:
        if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.OR) {
          sqlStr += ` AND orderDetail.Payment_Method ${exclude} IN (${this.internalConn.escape(
            setting?.data?.ids
          )})`;
        } else {
          const tmpSql = [];
          for (const id of setting?.data?.ids) {
            tmpSql.push(`orderDetail.Payment_Method LIKE '%${id}%'`);
          }
          sqlStr += ` AND ${exclude} (${tmpSql.join(' AND ')})`;
        }
        break;
    }

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 設定分群設定 Sql - 退貨訂單
   *
   * @param tableName
   * @param setting
   * @param exclude
   * @param clusterTempData
   * @returns
   */
  async setMemberOrderReturnClusterSql(
    tableName: string,
    setting,
    exclude: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    let sqlStr = `
    CREATE TEMPORARY TABLE ${tableName} (
      memberId VARCHAR(20) NOT NULL
    );

    INSERT INTO ${tableName} (memberId)
      SELECT DISTINCT
        orderMain.Member_ID as memberId
      FROM
        Return_Main returnMain
        JOIN Order_Main orderMain ON returnMain.Transaction_ID = orderMain.Transaction_ID AND orderMain.Is_Active = 1
    `;
    if (clusterTempData?.positiveTempTables?.length > 0) {
      const unionClauses = clusterTempData?.positiveTempTables
        .map((tableName) => `SELECT memberId FROM ${tableName}`)
        .join('\nUNION ALL\n');

      sqlStr += ` INNER JOIN (${unionClauses}) clusterTemp ON clusterTemp.memberId = orderMain.Member_ID`;
    }

    sqlStr += ` WHERE returnMain.Is_Active = 1`;

    const conditional = setting?.data?.conditional;
    switch (setting?.type) {
      case CLUSTER_SETTING_MAIN_TYPE.CANCEL_RETURN_DATE:
        switch (conditional) {
          case CLUSTER_SETTING_CONDITIONAL_TYPE.SPECIFY:
            sqlStr += ` AND ${exclude} returnMain.Transaction_Date BETWEEN ${this.internalConn.escape(
              setting?.data?.start
            )} AND ${this.internalConn.escape(setting?.data?.end)}`;
            break;
          case CLUSTER_SETTING_CONDITIONAL_TYPE.EXPORT:
            sqlStr += ` AND ${exclude} returnMain.Transaction_Date <= NOW()`;
            break;
          default:
            sqlStr += ` AND ${exclude} DATEDIFF(NOW(), returnMain.Transaction_Date) ${
              CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
            } ${this.internalConn.escape(setting?.data?.within)}`;
        }
        break;
      case CLUSTER_SETTING_MAIN_TYPE.CANCEL_RETURN_COUNT:
        sqlStr += ` GROUP BY orderMain.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} COUNT(returnMain.ID) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} COUNT(returnMain.ID) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
      case CLUSTER_SETTING_MAIN_TYPE.CANCEL_RETURN_AMOUNT:
        sqlStr += ` GROUP BY orderMain.Member_ID`;
        sqlStr +=
          conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.BETWEEN
            ? ` HAVING ${exclude} SUM(returnMain.Paid_Amount) BETWEEN ${this.internalConn.escape(
                setting?.data?.min
              )} AND ${this.internalConn.escape(setting?.data?.max)}`
            : ` HAVING ${exclude} SUM(returnMain.Paid_Amount) ${
                CLUSTER_SETTING_CONDITIONAL_TYPE_STR[conditional]
              } ${this.internalConn.escape(setting?.data?.min)}`;
        break;
    }

    clusterTempData.clusterSql.push(sqlStr);

    return clusterTempData;
  }

  /**
   * 取得暫存分群觸及會員筆數
   *
   * @param clusterTempData
   * @returns
   */
  async getTempClusterMemberIdCount(clusterTempData: ClusterTempData): Promise<{
    memberIdCount: number;
    memberSendEmailCount: string;
    memberSendSmsCount: string;
  }> {
    // 如果超過一個表，需使用 UNION ALL
    const unionClauses =
      clusterTempData?.positiveTempTables?.length > 1
        ? `(${clusterTempData?.positiveTempTables
            .map((tableName) => `SELECT memberId FROM ${tableName}`)
            .join('\nUNION ALL\n')})`
        : clusterTempData?.positiveTempTables?.[0];

    let sqlStr = `
      SELECT
        COUNT(DISTINCT temp.memberId) as memberIdCount,
        SUM(CASE WHEN im.Email IS NOT NULL THEN 1 ELSE 0 END) memberSendEmailCount,
        SUM(CASE WHEN im.Mobile IS NOT NULL THEN 1 ELSE 0 END) memberSendSmsCount
      FROM ${unionClauses} temp
      INNER JOIN IEat_Member im ON im.Member_ID = temp.memberId
    `;
    for (const table of clusterTempData.tempClusterDetailJoinTables) {
      if (!clusterTempData?.positiveTempTables.includes(table)) {
        sqlStr += ` INNER JOIN ${table} ON ${table}.memberId = temp.memberId`;
      }
    }
    sqlStr += `;`;

    clusterTempData.clusterSql.push(sqlStr);

    const result = await this.internalConn.query(
      clusterTempData.clusterSql.join(';')
    );

    let memberCount;
    result?.map((x) => {
      if (x?.[0]) {
        memberCount = x?.[0];
      }
    });

    return memberCount;
  }

  /**
   * 取得分群下載列表
   *
   * @param req
   * @returns
   */
  async getClusterDownloadList(
    req: GetClusterDownloadListDto
  ): Promise<ClusterDownloadList[]> {
    const _search = this.internalConn.escape(req?.search);
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);

    let sqlStr = `
    SELECT
      exportCsvLog.ID as exportId,
      cluster.Cluster_ID as clusterId,
      cluster.Cluster_Name as clusterName,
      clusterEvent.People_Count as peopleCount,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = clusterEvent.Create_ID), 'system') as exportName,
      clusterEvent.Create_Date as exportDate,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = cluster.Create_ID), 'system') as createName,
      cluster.Create_Date as createDate,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = cluster.Alter_ID), 'system') as alterName,
      cluster.Alter_Date as alterDate,
      exportCsvLog.File_Url as csvUrl
    FROM
      Cluster_Event clusterEvent
      JOIN Cluster cluster ON cluster.Cluster_ID = clusterEvent.Cluster_ID AND cluster.Is_Active = 1
      JOIN Export_Csv_Log exportCsvLog ON exportCsvLog.ID = clusterEvent.Export_Csv_Log_ID
    WHERE clusterEvent.Event_Status = ?
      AND exportCsvLog.File_Url IS NOT NULL
    `;

    const params = [];
    params.push(CLUSTER_EVENT_STATUS.END);
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.CLUSTER_ID:
          sqlStr += ` AND cluster.Cluster_ID = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.CLUSTER_NAME:
          sqlStr += ` AND cluster.Cluster_Name = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.CLUSTER_DESCRIPTION:
          sqlStr += ` AND cluster.Cluster_Description = ${_search}`;
          break;
      }
    }

    if (req?.state) {
      switch (req?.state) {
        case CLUSTER_LIST_TYPE.SINGLE:
          sqlStr += ` AND cluster.Export_Status IN (?, ?)`;
          params.push(
            CLUSTER_EXPORT_STATUS_TYPE.IMMEDIATE,
            CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_DATE
          );
          break;
        case CLUSTER_LIST_TYPE.REGULAR:
          sqlStr += ` AND cluster.Export_Status IN (?, ?, ?, ?)`;
          params.push(
            CLUSTER_EXPORT_STATUS_TYPE.EVERY_HALF_MONTH,
            CLUSTER_EXPORT_STATUS_TYPE.EVERY_MONTH,
            CLUSTER_EXPORT_STATUS_TYPE.EVERY_QUARTER,
            CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_RANGE_DATE
          );
          break;
      }
    }

    sqlStr += ` ORDER BY clusterEvent.ID DESC`;
    sqlStr += ` LIMIT ${_start}, ${_limit}`;

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result;
  }

  /**
   * 取得分群下載列表總筆數
   *
   * @param req
   * @returns
   */
  async getClusterDownloadListCount(
    req: GetClusterDownloadListDto
  ): Promise<number> {
    const _search = this.internalConn.escape(req?.search);

    let sqlStr = `
    SELECT
      COUNT(clusterEvent.ID) as clusterCount
    FROM
      Cluster_Event clusterEvent
      JOIN Cluster cluster ON cluster.Cluster_ID = clusterEvent.Cluster_ID AND cluster.Is_Active = 1
      JOIN Export_Csv_Log exportCsvLog ON exportCsvLog.ID = clusterEvent.Export_Csv_Log_ID
    WHERE clusterEvent.Event_Status = ?
      AND exportCsvLog.File_Url IS NOT NULL
    `;

    const params = [];
    params.push(CLUSTER_EVENT_STATUS.END);
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.CLUSTER_ID:
          sqlStr += ` AND cluster.Cluster_ID = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.CLUSTER_NAME:
          sqlStr += ` AND cluster.Cluster_Name = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.CLUSTER_DESCRIPTION:
          sqlStr += ` AND cluster.Cluster_Description = ${_search}`;
          break;
      }
    }

    if (req?.state) {
      switch (req?.state) {
        case CLUSTER_LIST_TYPE.SINGLE:
          sqlStr += ` AND cluster.Export_Status IN (?, ?)`;
          params.push(
            CLUSTER_EXPORT_STATUS_TYPE.IMMEDIATE,
            CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_DATE
          );
          break;
        case CLUSTER_LIST_TYPE.REGULAR:
          sqlStr += ` AND cluster.Export_Status IN (?, ?, ?, ?)`;
          params.push(
            CLUSTER_EXPORT_STATUS_TYPE.EVERY_HALF_MONTH,
            CLUSTER_EXPORT_STATUS_TYPE.EVERY_MONTH,
            CLUSTER_EXPORT_STATUS_TYPE.EVERY_QUARTER,
            CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_RANGE_DATE
          );
          break;
      }
    }

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result?.[0]?.clusterCount;
  }

  /**
   * 停用分群設定
   *
   * @param clusterId
   * @param authMemberId
   * @returns
   */
  async stopClusterSetting(
    clusterId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Cluster SET
      Cluster_Status = ?,
      Export_End_Date = NOW(),
      Alter_ID = ?
    WHERE Cluster_ID = ?
    `;

    await this.internalConn.query(sqlStr, [
      CLUSTER_EVENT_STATUS.END,
      authMemberId,
      clusterId
    ]);

    return {};
  }

  /**
   * 刪除分群設定
   *
   * @param connection
   * @param clusterId
   * @param authMemberId
   * @returns
   */
  async delClusterSetting(
    connection,
    clusterId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Cluster_Setting SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Cluster_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      clusterId
    ]);

    return {};
  }

  /**
   * 刪除分群資料
   *
   * @param connection
   * @param clusterId
   * @param authMemberId
   * @returns
   */
  async delClusterData(
    connection,
    clusterId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Cluster SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Cluster_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      clusterId
    ]);

    return {};
  }

  /**
   * 刪除分群匯出參數
   *
   * @param connection
   * @param clusterId
   * @param authMemberId
   * @returns
   */
  async delClusterExport(
    connection,
    clusterId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Cluster_Export SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Cluster_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      clusterId
    ]);

    return {};
  }

  /**
   * 刪除分群匯出通知分類
   *
   * @param connection
   * @param clusterId
   * @param authMemberId
   * @returns
   */
  async delClusterExportNotify(
    connection,
    clusterId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Cluster_Export_Notify SET
      Is_Active = 0,
      Alter_ID = ?
    WHERE Cluster_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      clusterId
    ]);

    return {};
  }
}
