import { Injectable } from '@nestjs/common';
import { MenuIdCommon } from 'src/Definition/Dto';
import { GetChannelCountByBrandsResp } from 'src/Models/V1/Channel/Interface/get.channel.count.interface';
import { InsChannelDetailReq } from 'src/Models/V1/Channel/Interface/ins.channel.detail.interface';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { GetChannelDetailResp } from './Interface/get.channel.detail.interface';
import { ChannelListResp } from './Interface/get.channel.list.interface';
import { GetChannelCountTotalDataResp } from './Interface/get.channel.total.data.interface';
import { GetMemberChannelLogResp } from './Interface/get.member.channel.log.interface';
import { InsChannelLogReq } from './Interface/ins.channel.log.interface';

@Injectable()
export class ChannelRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得渠道列表
   *
   * @returns
   */
  async getChannelList(): Promise<ChannelListResp[]> {
    const sqlStr = `
    SELECT
      channel.Channel_ID as channelId,
      brand.Brand_ID as brandId,
      channel.Channel_Name as channelName,
      channel.Point_Calculation as pointCalculation,
      brand.Brand_Name as brandName
    FROM
      Channel channel
        LEFT JOIN
          Channel_Detail channelDetail ON channel.Channel_ID = channelDetail.Channel_ID AND channelDetail.Is_Active = 1
        LEFT JOIN
          Brand brand ON brand.Brand_ID = channelDetail.Brand_ID
    WHERE channel.Is_Active = 1
    ORDER BY channel.Sort_Order, brand.Sort_Order ASC
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得渠道全部資料
   *
   * @returns
   */
  async getChannelTotalData(): Promise<GetChannelCountTotalDataResp[]> {
    const sqlStr = `
    SELECT
      Channel_ID as channelId,
      Channel_Name as channelName
    FROM
      Channel
    WHERE Is_Active = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得各品牌的渠道數量
   *
   * @param brandId 品牌編號
   * @returns
   */
  async getChannelCountByBrands(
    brandId?: string
  ): Promise<GetChannelCountByBrandsResp[]> {
    const _brandId = this.internalConn.escape(brandId);

    let sqlStr = `
    SELECT
      Brand_ID as brandId,
      COUNT(Channel_ID) as count
    FROM
      Channel_Detail
    WHERE Is_Active = 1
    `;

    if (brandId) {
      sqlStr += ` AND Brand_ID = ${_brandId}`;
    }

    sqlStr += ` GROUP BY Brand_ID`;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 修改渠道順序
   *
   * @param connection DB 連線
   * @param channelId 渠道編號
   * @param rank 順序
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updChannelSort(
    connection,
    channelId: string,
    rank: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Channel SET
      Sort_Order = ?,
      Alter_ID = ?
    WHERE Channel_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      rank,
      authMemberId,
      channelId
    ]);

    return {};
  }

  /**
   * 修改渠道資料
   *
   * @param connection DB 連線
   * @param channelId 渠道編號
   * @param isPointCalculation 是否計算積點會籍
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updChannelDetail(
    connection,
    channelId: string,
    isPointCalculation: boolean,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Channel SET
      Point_Calculation = ?,
      Alter_ID = ?
    WHERE Channel_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      isPointCalculation,
      authMemberId,
      channelId
    ]);

    return {};
  }

  /**
   * 新增渠道詳細資料
   *
   * @param connection DB 連線
   * @param req
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insChannelDetail(
    connection,
    req: InsChannelDetailReq[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _authMemberId = this.internalConn.escape(authMemberId);

    let sqlStr = `
    INSERT INTO Channel_Detail
    (Channel_ID, Brand_ID, Is_Active, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    for (const detail of req) {
      const _brandId = this.internalConn.escape(detail.brandId);
      const _channelId = this.internalConn.escape(detail.channelId);
      const _isActive = this.internalConn.escape(detail.isActive);

      if (i >= 1) {
        sqlStr += `,`;
      }

      sqlStr += `(${_channelId}, ${_brandId}, ${_isActive}, ${_authMemberId}, ${_authMemberId})`;
      i++;
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Is_Active = VALUES(Is_Active), Alter_Date = CURRENT_TIMESTAMP, Alter_ID = VALUES(Alter_ID)`;

    await this.internalConn.transactionQuery(connection, sqlStr, []);

    return {};
  }

  /**
   * 依照渠道密碼取得渠道資料
   *
   * @param channelPwd 渠道密碼
   * @returns
   */
  async getChannelDetailByPwd(
    channelPwd: string
  ): Promise<GetChannelDetailResp> {
    const sqlStr = `
    SELECT
      Channel_ID as channelId
    FROM Channel
    WHERE Is_Active = 1
      AND Channel_Pwd = ?
    `;

    const result = await this.internalConn.query(sqlStr, [channelPwd]);

    return result?.[0];
  }

  /**
   * 取得渠道詳細資料
   *
   * @param channelId 渠道編號
   * @returns
   */
  async getChannelDetail(channelId: string): Promise<GetChannelDetailResp> {
    const sqlStr = `
    SELECT
      Channel_ID as channelId,
      Channel_Name as channelName
    FROM Channel
    WHERE Is_Active = 1
      AND Channel_ID = ?
    `;
    const result = await this.internalConn.query(sqlStr, [channelId]);

    return result?.[0];
  }

  /**
   * 新增渠道互動Log
   *
   * @param req
   * @param memberId
   * @returns
   */
  async insChannelLog(req: InsChannelLogReq[]): Promise<Record<string, never>> {
    let sqlStr = `
      INSERT INTO IEat_Member_Channel_Action_Log
      (Member_ID, Channel_ID, Channel_Action, Create_ID, Alter_ID)
      VALUES
    `;

    let i = 0;
    for (const detail of req) {
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
   * 取得會員渠道紀錄
   *
   * @param memberId 會員編號
   * @returns
   */
  async getMemberChannelLog(
    memberId: string
  ): Promise<GetMemberChannelLogResp[]> {
    const sqlStr = `
    SELECT
      log.Channel_Action as channelAction,
      channel.Channel_Name as channelName
    FROM
      IEat_Member_Channel_Action_Log log
      JOIN Channel channel ON channel.Channel_ID = log.Channel_ID AND channel.Is_Active = 1
    WHERE log.Is_Active = 1
      AND log.Member_ID = ?
    `;

    const result = (await this.internalConn.query(sqlStr, [memberId])) ?? [];

    return result;
  }

  /**
   * 取得渠道下拉式選單
   *
   * @returns
   */
  async getChannelMenu(): Promise<MenuIdCommon[]> {
    const sqlStr = `
    SELECT
      channel.Channel_ID as id,
      channel.Channel_Name as name
    FROM
      Channel channel
    WHERE channel.Is_Active = 1
    ORDER BY channel.Sort_Order ASC
    `;

    const result = (await this.internalConn.query(sqlStr)) ?? [];

    return result;
  }
}
