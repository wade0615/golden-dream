import { Injectable } from '@nestjs/common';
import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import { COUPON_ISSUANCE_STATE_TYPE } from 'src/Definition/Enum/Coupon/coupon.type.enum';
import {
  FRONT_REWARD_CARD_RELEASE_STATUS_TYPE,
  REWARD_CARD_RELEASE_STATUS_TYPE,
  REWARD_CARD_STATE_TYPE
} from 'src/Definition/Enum/RewardCard/reward.card.type.enum';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { MemberRewardCardDetail } from './Dto/get.member.reward.card.detail.dto';
import { RewardCardGiftDetail } from './Dto/get.member.reward.card.gift.detail.dto';
import { RewardCardGift } from './Dto/get.member.reward.card.gift.list.dto';
import { MemberRewardCardList } from './Dto/get.member.reward.card.list.dto';
import {
  GetMemberRewardDetailDto,
  MemberRewardDetail
} from './Dto/get.member.reward.detail.dto';
import { RewardCardHistoryInfo } from './Dto/get.reward.card.history.dto';
import { RewardCardMenu } from './Dto/get.reward.card.menu.dto';
import {
  CouponDetail,
  RewardCardSettingDetail
} from './Dto/get.reward.card.setting.detail.dto';
import {
  GetRewardCardSettingListDto,
  RewardCardSettingList
} from './Dto/get.reward.card.setting.list.dto';
import { GetRewardDetailDto, RewardDetail } from './Dto/get.reward.detail.dto';
import {
  GetRewardSendListDto,
  RewardSendList
} from './Dto/get.reward.send.list.dto';
import { GetRewardCardSendMemberResp } from './Dto/get.reward.send.member.dto';
import {
  UpdCouponDetail,
  UpdRewardCardSettingDetailDto
} from './Dto/upd.reward.card.setting.detail.dto';
import { UpdRewardSendDetailDto } from './Dto/upd.reward.send.detail.dto';
import { GetMemberRewardCardStateResp } from './Interface/get.member.reward.card.interface';
import { GetRewardCardSendPointResp } from './Interface/get.reward.card.send.point.interface';
import { GetRewardDetailResp } from './Interface/get.reward.detail.interface';
import { RewardSendDetailResp } from './Interface/get.reward.send.detail.interface';
import { UpdRewardSendDetailReq } from './Interface/upd.reward.send.detail.interface';

import moment = require('moment-timezone');

@Injectable()
export class RewardCardRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得集點卡設定列表
   *
   * @param req
   * @returns
   */
  async getRewardCardSettingList(
    req: GetRewardCardSettingListDto
  ): Promise<RewardCardSettingList[]> {
    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');

    let sqlStr = `
    SELECT
      rewardCard.Reward_Card_ID as rewardCardId,
      rewardCard.Reward_Card_Name as rewardCardName,
      brand.Brand_Name as brandName,
      rewardCard.Thumbnail_Image as thumbnailImage,
      rewardCard.Release_Status as releaseStatus,
      rewardCard.On_Sold_Start_Date as startDate,
      rewardCard.On_Sold_End_Date as endDate,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = rewardCard.Create_ID), 'system') as createName,
      rewardCard.Create_Date as createTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = rewardCard.Alter_ID), 'system') as alterName,
      rewardCard.Alter_Date as alterTime
    FROM
      Reward_Card rewardCard
      JOIN Brand brand ON rewardCard.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
    WHERE rewardCard.Is_Active = 1
    `;
    const params = [];
    switch (req?.state) {
      case REWARD_CARD_STATE_TYPE.ING:
        sqlStr += ` AND rewardCard.On_Sold_Start_Date <= ? AND rewardCard.On_Sold_End_Date >= ?`;
        params.push(now, now);
        break;
      case REWARD_CARD_STATE_TYPE.END:
        sqlStr += ` AND rewardCard.On_Sold_End_Date < ?`;
        params.push(now);
        break;
      case REWARD_CARD_STATE_TYPE.NOT_START:
        sqlStr += ` AND rewardCard.On_Sold_Start_Date > ?`;
        params.push(now);
        break;
    }

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.REWARD_NAME:
          sqlStr += ` AND rewardCard.Reward_Card_Name = ?`;
          params.push(req?.search);
          break;
      }
    }

    if (req?.brandId) {
      sqlStr += ` AND rewardCard.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    if (req?.releaseState > 0) {
      switch (req?.releaseState) {
        case FRONT_REWARD_CARD_RELEASE_STATUS_TYPE[
          REWARD_CARD_RELEASE_STATUS_TYPE.PUBLISHED
        ]:
          sqlStr += ` AND rewardCard.Release_Status = ?`;
          params.push(REWARD_CARD_RELEASE_STATUS_TYPE.PUBLISHED);
          break;
        case FRONT_REWARD_CARD_RELEASE_STATUS_TYPE[
          REWARD_CARD_RELEASE_STATUS_TYPE.UNPUBLISHED
        ]:
          sqlStr += ` AND rewardCard.Release_Status = ?`;
          params.push(REWARD_CARD_RELEASE_STATUS_TYPE.UNPUBLISHED);
          break;
      }
    }

    sqlStr += ` ORDER BY rewardCard.Create_Date DESC`;
    sqlStr += ` LIMIT ?, ?`;
    params.push((req?.page - 1) * req?.perPage, req?.perPage);

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result;
  }

  /**
   * 取得集點卡設定列表總筆數
   *
   * @param req
   * @returns
   */
  async getRewardCardSettingListCount(
    req: GetRewardCardSettingListDto
  ): Promise<number> {
    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');

    let sqlStr = `
    SELECT
      COUNT(*) as rewardCardCount
    FROM
      Reward_Card rewardCard
      JOIN Brand brand ON rewardCard.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
    WHERE rewardCard.Is_Active = 1
    `;

    const params = [];
    switch (req?.state) {
      case REWARD_CARD_STATE_TYPE.ING:
        sqlStr += ` AND rewardCard.On_Sold_Start_Date <= ? AND rewardCard.On_Sold_End_Date >= ?`;
        params.push(now, now);
        break;
      case REWARD_CARD_STATE_TYPE.END:
        sqlStr += ` AND rewardCard.On_Sold_End_Date < ?`;
        params.push(now);
        break;
      case REWARD_CARD_STATE_TYPE.NOT_START:
        sqlStr += ` AND rewardCard.On_Sold_Start_Date > ?`;
        params.push(now);
        break;
    }

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.REWARD_NAME:
          sqlStr += ` AND rewardCard.Reward_Card_Name = ?`;
          params.push(req?.search);
          break;
      }
    }

    if (req?.brandId) {
      sqlStr += ` AND rewardCard.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    if (req?.releaseState > 0) {
      switch (req?.releaseState) {
        case FRONT_REWARD_CARD_RELEASE_STATUS_TYPE[
          REWARD_CARD_RELEASE_STATUS_TYPE.PUBLISHED
        ]:
          sqlStr += ` AND rewardCard.Release_Status = ?`;
          params.push(REWARD_CARD_RELEASE_STATUS_TYPE.PUBLISHED);
          break;
        case FRONT_REWARD_CARD_RELEASE_STATUS_TYPE[
          REWARD_CARD_RELEASE_STATUS_TYPE.UNPUBLISHED
        ]:
          sqlStr += ` AND rewardCard.Release_Status = ?`;
          params.push(REWARD_CARD_RELEASE_STATUS_TYPE.UNPUBLISHED);
          break;
      }
    }

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result?.[0]?.rewardCardCount;
  }

  /**
   * 取得集點卡詳情資料
   *
   * @param rewardCardId 集點卡編號
   * @returns
   */
  async getRewardCardSettingDetail(
    rewardCardId: string
  ): Promise<RewardCardSettingDetail> {
    const sqlStr = `
    SELECT
      Reward_Card_Name as rewardCardName,
      Release_Status as releaseStatus,
      Main_Image as mainImageUrl,
      Thumbnail_Image as thumbnailImageUrl,
      Brand_ID as brandId,
      Reward_Card_Category as rewardCardCategory,
      Reward_Card_Max_Point as maxPoint,
      Reward_Card_Rule_Amount as ruleAmount,
      Is_Auto_Exchange as isAutoExchange,
      On_Sold_Start_Date as startDate,
      On_Sold_End_Date as endDate,
      Usage_Description as content
    FROM
      Reward_Card
    WHERE Is_Active = 1
      AND Reward_Card_ID = ?
    `;

    const result =
      (await this.internalConn.query(sqlStr, [rewardCardId])) ?? [];

    return result?.[0];
  }

  /**
   * 依品牌編號取得指定日期集點卡資料
   *
   * @param brandId 品牌編號
   * @param startDate 起始時間
   * @param endDate 結束時間
   * @param rewardCardId 集點卡編號
   * @returns
   */
  async getRewardCardSettingDetailByDate(
    brandId: string,
    startDate: string,
    endDate: string,
    rewardCardId: string
  ): Promise<RewardCardSettingDetail> {
    const sqlStr = `
    SELECT
      Reward_Card_Name as rewardCardName,
      Release_Status as releaseStatus,
      Main_Image as mainImageUrl,
      Thumbnail_Image as thumbnailImageUrl,
      Brand_ID as brandId,
      Reward_Card_Category as rewardCardCategory,
      Reward_Card_Max_Point as maxPoint,
      Reward_Card_Rule_Amount as ruleAmount,
      Is_Auto_Exchange as isAutoExchange,
      On_Sold_Start_Date as startDate,
      On_Sold_End_Date as endDate,
      Usage_Description as content
    FROM
      Reward_Card
    WHERE Is_Active = 1
      AND Brand_ID = ?
      AND On_Sold_Start_Date <= ?
      AND On_Sold_End_Date >= ?
      AND Reward_Card_ID != ?
    `;

    const result =
      (await this.internalConn.query(sqlStr, [
        brandId,
        endDate,
        startDate,
        rewardCardId
      ])) ?? [];

    return result?.[0];
  }

  /**
   * 取得集點卡兌換券詳情資料
   *
   * @param rewardCardId 集點卡編號
   * @returns
   */
  async getRewardCardCouponDetail(
    rewardCardId: string
  ): Promise<CouponDetail[]> {
    const sqlStr = `
    SELECT
      rewardCardCoupon.Point as point,
      rewardCardCoupon.Coupon_ID as couponId,
      coupon.Coupon_Type as couponType,
      coupon.Coupon_Name as couponName,
      coupon.Release_Status as releaseStatus,
      coupon.Coupon_Rule as couponRule,
      coupon.On_Sold_Start_Date as startDate,
      coupon.On_Sold_End_Date as endDate,
      coupon.Redemption_Start_Date as redemptionStartDate,
      coupon.Redemption_End_Date as redemptionEndDate,
      coupon.Earliest_Pickup_Date as earliestPickupDate,
      coupon.Pickup_Deadline as pickupDeadline
    FROM
      Reward_Card_Coupon rewardCardCoupon
      JOIN Coupon coupon ON rewardCardCoupon.Coupon_ID = coupon.Coupon_ID AND coupon.Is_Active = 1
    WHERE rewardCardCoupon.Is_Active = 1
      AND rewardCardCoupon.Reward_Card_ID = ?
    `;

    const result =
      (await this.internalConn.query(sqlStr, [rewardCardId])) ?? [];

    return result;
  }

  /**
   * 取得集點卡 ID 最大值
   *
   * @returns
   */
  async getMaxRewardCardId(): Promise<string> {
    const sqlStr = `
    SELECT MAX(Reward_Card_ID) as maxRewardCardId FROM Reward_Card LIMIT 1
    `;

    const result = await this.internalConn.query(sqlStr);

    return result?.[0]?.maxRewardCardId;
  }

  /**
   * 修改集點卡詳情資料
   *
   * @param connection DB 連線
   * @param req
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updRewardCardSettingDetail(
    connection,
    req: UpdRewardCardSettingDetailDto,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const addData = {
      Reward_Card_ID: req?.rewardCardId,
      Reward_Card_Name: req?.rewardCardName,
      Main_Image: req?.mainImageUrl,
      Thumbnail_Image: req?.thumbnailImageUrl,
      Release_Status: req?.releaseStatus,
      Brand_ID: req?.brandId,
      Reward_Card_Category: req?.rewardCardCategory,
      Reward_Card_Max_Point: req?.maxPoint,
      Reward_Card_Rule_Amount: req?.ruleAmount,
      Expiration_Rule: req?.expirationRule,
      Is_Auto_Exchange: req?.isAutoExchange,
      On_Sold_Start_Date: req?.startDate,
      On_Sold_End_Date: req?.endDate,
      Usage_Description: req?.content,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `
    INSERT INTO Reward_Card SET ?
    ON DUPLICATE KEY UPDATE Reward_Card_Name = VALUES(Reward_Card_Name), Main_Image = VALUES(Main_Image),
    Thumbnail_Image = VALUES(Thumbnail_Image), Release_Status = VALUES(Release_Status), Brand_ID = VALUES(Brand_ID),
    Reward_Card_Category = VALUES(Reward_Card_Category), Reward_Card_Max_Point = VALUES(Reward_Card_Max_Point),
    Reward_Card_Rule_Amount = VALUES(Reward_Card_Rule_Amount), Is_Auto_Exchange = VALUES(Is_Auto_Exchange),
    On_Sold_Start_Date = VALUES(On_Sold_Start_Date), On_Sold_End_Date = VALUES(On_Sold_End_Date), Usage_Description = VALUES(Usage_Description),
    Alter_ID = VALUES(Alter_ID), Alter_Date = CURRENT_TIMESTAMP
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [addData]);

    return {};
  }

  /**
   * 初始化集點卡 Coupon 關聯表
   *
   * @param connection DB 連線
   * @param rewardCardId 集點卡編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initRewardCardCouponDetail(
    connection,
    rewardCardId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Reward_Card_Coupon SET
      Is_Active = 0,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Reward_Card_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      rewardCardId
    ]);

    return {};
  }

  /**
   * 修改集點卡 Coupon 關聯表
   *
   * @param connection DB 連線
   * @param rewardCardId 集點卡編號
   * @param couponDetails
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updRewardCardCouponDetail(
    connection,
    rewardCardId: string,
    couponDetails: UpdCouponDetail[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Reward_Card_Coupon
    (Reward_Card_ID, Coupon_ID, Point, Create_ID, Alter_ID)
    VALUES
    `;
    let i = 0;
    const params = [];
    for (const couponDetail of couponDetails) {
      if (i >= 1) {
        sqlStr += `,`;
      }

      sqlStr += `(?, ?, ?, ?, ?)`;
      params.push(
        rewardCardId,
        couponDetail?.couponId,
        couponDetail?.point,
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
   * 軟刪除集點卡詳細資料
   *
   * @param connection DB 連線
   * @param rewardCardId 集點卡編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delRewardCardSettingDetail(
    connection,
    rewardCardId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Reward_Card SET
      Is_Active = 0,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Reward_Card_ID = ?
    `;
    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      rewardCardId
    ]);

    return {};
  }

  /**
   * 軟刪除集點卡關聯
   *
   * @param connection DB 連線
   * @param risId 發送編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delRewardIssuanceMap(
    connection,
    risId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Reward_Issuance_Map SET
      Is_Active = 0,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Ris_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      risId
    ]);

    return {};
  }

  /**
   * 軟刪除集點卡會員關聯
   *
   * @param connection DB 連線
   * @param risId 發送編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delRewardIssuanceMember(
    connection,
    risId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Reward_Issuance_Member SET
      Is_Active = 0,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Ris_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      risId
    ]);

    return {};
  }

  /**
   * 取得會員集點列表
   *
   * @param brandIds 品牌編號(複數)
   * @param page 頁數
   * @param perPage 一頁筆數
   * @returns
   */
  async getMemberRewardCardList(
    brandIds: string[],
    page: number,
    perPage: number
  ): Promise<MemberRewardCardList[]> {
    const _brandIds = this.internalConn.escape(brandIds);
    const _start = this.internalConn.escape((page - 1) * perPage);
    const _end = this.internalConn.escape(perPage);

    const sqlStr = `
    SELECT
      Reward_Card_ID as rewardCardId,
      Reward_Card_Name as rewardCardName,
      Brand_ID as brandId,
      Main_Image as mainImageUrl,
      Thumbnail_Image as thumbnailImageUrl,
      Usage_Description as content,
      On_Sold_Start_Date as startDate,
      On_Sold_End_Date as endDate,
      Reward_Card_Max_Point as maxPoint
    FROM
      Reward_Card
    WHERE Is_Active = 1
      AND Release_Status = 1
      AND Brand_ID IN (${_brandIds})
      AND On_Sold_Start_Date <= NOW()
      AND On_Sold_End_Date >= NOW()
    ORDER BY Reward_Card_ID DESC
    LIMIT ${_start}, ${_end}
    `;

    const result = await this.internalConn.query(sqlStr);

    return result;
  }

  /**
   * 取得會員集點總筆數
   *
   * @param brandIds 品牌編號(複數)
   * @returns
   */
  async getMemberRewardCardListCount(brandIds: string[]): Promise<number> {
    const _brandIds = this.internalConn.escape(brandIds);

    const sqlStr = `
    SELECT
      COUNT(*) as rewardCardCount
    FROM
      Reward_Card
    WHERE Is_Active = 1
      AND Release_Status = 1
      AND Brand_ID IN (${_brandIds})
      AND On_Sold_Start_Date <= NOW()
      AND On_Sold_End_Date >= NOW()
    `;

    const result = await this.internalConn.query(sqlStr);

    return result?.[0]?.rewardCardCount;
  }

  /**
   * 集點可兌換獎品列表
   *
   * @param rewardCardId 集點卡編號
   * @returns
   */
  async getMemberRewardCardDetail(
    rewardCardId: string
  ): Promise<MemberRewardCardDetail> {
    const sqlStr = `
    SELECT
      Reward_Card_ID as rewardCardId,
      Reward_Card_Name as rewardCardName,
      Brand_ID as brandId,
      Main_Image as mainImageUrl,
      Thumbnail_Image as thumbnailImageUrl,
      Usage_Description as content,
      On_Sold_Start_Date as startDate,
      On_Sold_End_Date as endDate,
      Reward_Card_Max_Point as maxPoint
    FROM
      Reward_Card
    WHERE Is_Active = 1
      AND Reward_Card_ID = ?
    `;

    const result =
      (await this.internalConn.query(sqlStr, [rewardCardId])) ?? [];

    return result?.[0];
  }

  /**
   * 取得集點卡兌換券列表
   *
   * @param rewardCardId 集點卡編號
   * @returns
   */
  async getRewardCardGiftList(rewardCardId: string): Promise<RewardCardGift[]> {
    const sqlStr = `
    SELECT
      rewardCardCoupon.ID as id,
      rewardCard.Brand_ID as brandId,
      coupon.Coupon_Name as couponName,
      coupon.Main_Image as mainImageUrl,
      coupon.Thumbnail_Image as thumbnailImageUrl,
      coupon.Usage_Description as content,
      rewardCardCoupon.Point as points,
      coupon.On_Sold_Start_Date as startDate,
      coupon.On_Sold_End_Date as endDate,
      coupon.Redemption_Start_Date as redemptionStartDate,
      coupon.Redemption_End_Date as redemptionEndDate,
      coupon.Earliest_Pickup_Date as earliestPickupDate
    FROM
      Reward_Card rewardCard
      JOIN Reward_Card_Coupon rewardCardCoupon ON rewardCard.Reward_Card_ID = rewardCardCoupon.Reward_Card_ID AND rewardCardCoupon.Is_Active = 1
      JOIN Coupon coupon ON rewardCardCoupon.Coupon_ID = coupon.Coupon_ID AND coupon.Is_Active = 1
    WHERE rewardCard.Is_Active = 1
      AND rewardCard.Reward_Card_ID = ?
      AND coupon.Release_Status = 1
    `;

    const result =
      (await this.internalConn.query(sqlStr, [rewardCardId])) ?? [];

    return result;
  }

  /**
   * 取得集點卡獎品詳細資料
   *
   * @param id 集點卡綁定的兌換券流水號
   * @returns
   */
  async getRewardCardGiftDetail(id: string): Promise<RewardCardGiftDetail> {
    const sqlStr = `
    SELECT
      rewardCard.Reward_Card_ID as rewardCardId,
      coupon.Coupon_ID as couponId,
      coupon.Coupon_Name as couponName,
      coupon.Coupon_Type as couponType,
      rewardCard.Brand_ID as brandId,
      coupon.Main_Image as mainImageUrl,
      coupon.Thumbnail_Image as thumbnailImageUrl,
      coupon.Usage_Description as content,
      rewardCardCoupon.Point as points,
      rewardCard.Expiration_Rule as expirationRule,
      coupon.On_Sold_Start_Date as startDate,
      coupon.On_Sold_End_Date as endDate,
      coupon.Redemption_Start_Date as redemptionStartDate,
      coupon.Redemption_End_Date as redemptionEndDate,
      coupon.Earliest_Pickup_Date as earliestPickupDate
    FROM
      Reward_Card_Coupon rewardCardCoupon
      JOIN Reward_Card rewardCard ON rewardCardCoupon.Reward_Card_ID = rewardCard.Reward_Card_ID AND rewardCard.Is_Active = 1
      JOIN Coupon coupon ON rewardCardCoupon.Coupon_ID = coupon.Coupon_ID AND coupon.Is_Active = 1
    WHERE rewardCardCoupon.Is_Active = 1
      AND rewardCardCoupon.ID = ?
    `;

    const result = (await this.internalConn.query(sqlStr, [id])) ?? [];

    return result?.[0];
  }

  /**
   * 取得集點卡歷程
   *
   * @param rewardCardId 集點卡編號
   * @param memberId 會員編號
   * @param startDate 開始時間
   * @param endDate 結束時間
   * @param page 頁數
   * @param perPage 一頁筆數
   * @returns
   */
  async getRewardCardHistory(
    rewardCardId: string,
    memberId: string,
    startDate: string,
    endDate: string,
    page: number,
    perPage: number
  ): Promise<RewardCardHistoryInfo[]> {
    const sqlStr = `
    SELECT
      rewardCardDetail.ID as id,
      rewardCardDetail.Coupon_ID as couponId,
      rewardCard.Brand_ID as brandId,
      rewardCardDetail.Store_ID as storeId,
      rewardCardDetail.Transaction_ID as transactionId,
      rewardCardDetail.Transaction_Type as transactionType,
      rewardCardDetail.Transaction_Date as transactionDate,
      rewardCardDetail.Transaction_Amount as transactionAmount,
      rewardCardDetail.Point as point,
      coupon.Coupon_Name as couponName
    FROM
      Reward_Card rewardCard
      JOIN Reward_Card_Detail rewardCardDetail ON rewardCard.Reward_Card_ID = rewardCardDetail.Reward_Card_ID AND rewardCardDetail.Is_Active = 1
      LEFT JOIN Coupon coupon ON rewardCardDetail.Coupon_ID = coupon.Coupon_ID AND coupon.Is_Active = 1
    WHERE rewardCard.Is_Active = 1
      AND rewardCard.Reward_Card_ID = ?
      AND rewardCardDetail.Member_ID = ?
      AND rewardCardDetail.Transaction_Type > 0
      AND rewardCardDetail.Transaction_Date >= ?
      AND rewardCardDetail.Transaction_Date <= ?
    ORDER BY rewardCardDetail.ID DESC
    LIMIT ?, ?
    `;

    const params = [];
    params.push(
      rewardCardId,
      memberId,
      startDate,
      endDate,
      (page - 1) * perPage,
      perPage
    );

    const result = (await this.internalConn.query(sqlStr, params)) ?? [];

    return result;
  }

  /**
   * 取得集點卡歷程總筆數
   *
   * @param rewardCardId 集點卡編號
   * @param memberId 會員編號
   * @param startDate 開始時間
   * @param endDate 結束時間
   * @returns
   */
  async getRewardCardHistoryCount(
    rewardCardId: string,
    memberId: string,
    startDate: string,
    endDate: string
  ): Promise<number> {
    const sqlStr = `
    SELECT
      COUNT(*) as rewardCardHistoryCount
    FROM
      Reward_Card rewardCard
      JOIN Reward_Card_Detail rewardCardDetail ON rewardCard.Reward_Card_ID = rewardCardDetail.Reward_Card_ID AND rewardCardDetail.Is_Active = 1
      LEFT JOIN Coupon coupon ON rewardCardDetail.Coupon_ID = coupon.Coupon_ID AND coupon.Is_Active = 1
    WHERE rewardCard.Is_Active = 1
      AND rewardCard.Reward_Card_ID = ?
      AND rewardCardDetail.Member_ID = ?
      AND rewardCardDetail.Transaction_Type > 0
      AND rewardCardDetail.Transaction_Date >= ?
      AND rewardCardDetail.Transaction_Date <= ?
    `;
    const params = [rewardCardId, memberId, startDate, endDate];

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.rewardCardHistoryCount;
  }

  /**
   * 取得集點卡發放列表
   *
   * @param req
   * @returns
   */
  async getRewardCardSendList(
    req: GetRewardSendListDto
  ): Promise<RewardSendList[]> {
    let sqlStr = `
    SELECT
      rewardIssuance.Ris_ID  as risId,
      rewardIssuance.Ris_Name as risName,
      rewardIssuance.Ris_Type as risType,
      rewardIssuance.Ris_Date as risDate,
      rewardIssuance.Create_Date as createTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = rewardIssuance.Create_ID), '') as createName,
      rewardIssuance.Alter_Date as alterTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = rewardIssuance.Alter_ID), '') as alterName,
      rewardIssuance.Relation_ID as relationId
    FROM
      Reward_Issuance rewardIssuance
    WHERE rewardIssuance.Is_Active = 1
    `;

    const params = [];
    switch (req?.state) {
      case COUPON_ISSUANCE_STATE_TYPE.NOT_START:
        sqlStr += ` AND rewardIssuance.Ris_Date > NOW()`;
        break;
      case COUPON_ISSUANCE_STATE_TYPE.END:
        sqlStr += ` AND rewardIssuance.Ris_Date < NOW()`;
        break;
    }

    sqlStr += ` ORDER BY rewardIssuance.Create_Date DESC`;
    sqlStr += ` LIMIT ?, ?`;
    params.push((req?.page - 1) * req?.perPage, req?.perPage);

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 取得集點卡發放列表總數量
   *
   * @param req
   * @returns
   */
  async getRewardCardSendListCount(req: GetRewardSendListDto): Promise<number> {
    let sqlStr = `
    SELECT
      COUNT(*) as rewardCardSendListCount
    FROM
      Reward_Issuance
    WHERE Is_Active = 1
    `;

    const params = [];
    switch (req?.state) {
      case COUPON_ISSUANCE_STATE_TYPE.NOT_START:
        sqlStr += ` AND Ris_Date > NOW()`;
        break;
      case COUPON_ISSUANCE_STATE_TYPE.END:
        sqlStr += ` AND Ris_Date < NOW()`;
        break;
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.rewardCardSendListCount;
  }

  /**
   * 取得集點卡發送點數
   *
   * @param risIds 發放編號(複數)
   * @returns
   */
  async getRewardCardSendPoint(
    risIds: string[]
  ): Promise<GetRewardCardSendPointResp[]> {
    const _risIds = this.internalConn.escape(risIds);

    const sqlStr = `
    SELECT
      rewardIssuanceMap.Ris_ID as risId,
      SUM(rewardDetail.Point) as totalPoint
    FROM
      Reward_Issuance_Map rewardIssuanceMap
      JOIN Reward_Card_Detail rewardDetail ON rewardIssuanceMap.Ris_ID = rewardDetail.Ris_ID AND rewardDetail.Is_Active = 1
    WHERE rewardIssuanceMap.Is_Active = 1
      AND rewardIssuanceMap.Ris_ID IN (${_risIds})
    GROUP BY rewardIssuanceMap.Ris_ID
    `;

    const result = await this.internalConn.query(sqlStr);

    return result;
  }

  /**
   * 取得集點卡發放詳細資料
   *
   * @param risId 發放編號
   * @returns
   */
  async getRewardCardSendDetail(risId: string): Promise<RewardSendDetailResp> {
    const sqlStr = `
    SELECT
      rewardIssuance.Ris_Name as risName,
      rewardIssuance.Ris_Date as risDate,
      rewardIssuance.Ris_Type as risType,
      rewardIssuance.Ris_Status as risStatus,
      rewardIssuance.Consume_Date as consumeDate,
      rewardIssuance.Relation_ID as relationId,
      rewardIssuanceMap.Reward_Card_ID as rewardCardId,
      rewardIssuance.Store_ID as storeId,
      rewardIssuance.Remark as remark,
      files.Url as excelUrl
    FROM
      Reward_Issuance rewardIssuance
      JOIN Reward_Issuance_Map rewardIssuanceMap ON rewardIssuance.Ris_ID = rewardIssuanceMap.Ris_ID AND rewardIssuanceMap.Is_Active = 1
      LEFT JOIN Files files ON rewardIssuance.Relation_ID = files.Relation_ID AND files.Is_Active = 1
    WHERE rewardIssuance.Is_Active = 1
      AND rewardIssuance.Ris_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [risId]);

    return result?.[0];
  }

  /**
   * 依發送 ID 取得集點明細
   *
   * @param risId 發放編號
   * @returns
   */
  async getRewardDetailByRisId(risId: string): Promise<GetRewardDetailResp[]> {
    const sqlStr = `
    SELECT
      Point as point
    FROM Reward_Card_Detail
    WHERE Is_Active = 1
      AND Ris_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [risId]);

    return result;
  }

  /**
   * 取得集點卡會員關聯
   *
   * @param risId 發放編號
   * @returns
   */
  async getRewardCardSendMember(
    risId: string
  ): Promise<GetRewardCardSendMemberResp[]> {
    const sqlStr = `
    SELECT
      Member_ID as memberId
    FROM Reward_Issuance_Member
    WHERE Is_Active = 1
      AND Ris_ID = ?
    `;

    const result = (await this.internalConn.query(sqlStr, [risId])) ?? [];

    return result;
  }

  /**
   * 新增集點卡發放列表
   *
   * @param connection DB 連線
   * @param req
   * @param relationId 檔案編號
   * @param authMemberId 後台人員ID
   * @returns
   */
  async insRewardIssuance(
    connection,
    req: UpdRewardSendDetailDto,
    relationId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const addData = {
      Ris_ID: req?.risId,
      Ris_Name: req?.risName,
      Ris_Type: req?.risType,
      Ris_Status: req?.risStatus,
      Ris_Date: req?.risDate
        ? req?.risDate
        : moment().utc().add(1, 'day').format('YYYY-MM-DD'),
      Consume_Date: req?.consumeDate,
      Relation_ID: relationId,
      Store_ID: req?.storeId ? req?.storeId : null,
      Remark: req?.remark,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `
    INSERT INTO Reward_Issuance SET ?
    ON DUPLICATE KEY UPDATE Ris_Name = VALUES(Ris_Name), Ris_Type = VALUES(Ris_Type),
    Ris_Status = VALUES(Ris_Status), Ris_Date = VALUES(Ris_Date), Consume_Date = VALUES(Consume_Date),
    Relation_ID = VALUES(Relation_ID), Store_ID = VALUES(Store_ID), Reward_Point = VALUES(Reward_Point),
    Remark = VALUES(Remark), Alter_ID = VALUES(Alter_ID), Alter_Date = CURRENT_TIMESTAMP
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [addData]);

    return {};
  }

  /**
   * 新增集點卡發放關聯
   *
   * @param connection DB 連線
   * @param rewardCardId 集點卡
   * @param risId 發送編號
   * @returns
   */
  async insRewardIssuanceMap(
    connection,
    rewardCardId: string,
    risId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const addData = {
      Reward_Card_ID: rewardCardId,
      Ris_ID: risId,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `
    INSERT INTO Reward_Issuance_Map SET ?
    ON DUPLICATE KEY UPDATE Is_Active = 1, Alter_ID = VALUES(Alter_ID),
    Alter_Date = CURRENT_TIMESTAMP
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [addData]);

    return {};
  }

  /**
   * 初始化集點卡發放關聯
   *
   * @param connection DB 連線
   * @param risId 發送編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initRewardIssuanceMap(
    connection,
    risId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Reward_Issuance_Map SET
      Is_Active = 0,
      Alter_ID = ?,
      Alter_Date = CURRENT_TIMESTAMP
    WHERE Ris_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      risId
    ]);

    return {};
  }

  /**
   * 新增集點卡發放會員關聯
   *
   * @param connection DB 連線
   * @param rewardCardId 集點卡編號
   * @param risId 發送編號
   * @param memberId 會員編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insRewardIssuanceMember(
    connection,
    rewardCardId: string,
    risId: string,
    memberId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const addData = {
      Reward_Card_ID: rewardCardId,
      Ris_ID: risId,
      Member_ID: memberId,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `
    INSERT INTO Reward_Issuance_Member SET ?
    ON DUPLICATE KEY UPDATE Is_Active = 1, Alter_ID = VALUES(Alter_ID), Alter_Date = CURRENT_TIMESTAMP
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [addData]);

    return {};
  }

  /**
   * 初始化集點卡發放會員關聯
   *
   * @param connection DB 連線
   * @param risId 發送編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initRewardIssuanceMember(
    connection,
    risId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Reward_Issuance_Member SET
      Is_Active = 0,
      Alter_ID = ?,
      Alter_Date = CURRENT_TIMESTAMP
    WHERE Ris_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      risId
    ]);

    return {};
  }

  /**
   * 新增集點明細
   *
   * @param connection DB 連線
   * @param req
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insRewardDetail(
    connection,
    req: UpdRewardSendDetailReq,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const addData = {
      Member_ID: req?.memberId,
      Reward_Card_ID: req?.rewardCardId,
      Ris_ID: req?.risId,
      Coupon_ID: req?.couponId,
      Transaction_ID: req?.transactionId,
      Transaction_Type: req?.transactionType,
      Transaction_Date: req?.transactionDate,
      Point: req?.rewardPoint,
      Last_Point: req?.lastPoint,
      Create_ID: authMemberId,
      Alter_ID: authMemberId
    };

    const sqlStr = `
    INSERT INTO Reward_Card_Detail SET ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [addData]);

    return {};
  }

  /**
   * 初始化集點明細資料
   *
   * @param connection DB 連線
   * @param risId 發送編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async initRewardDetail(
    connection,
    risId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Reward_Card_Detail SET
      Is_Active = 0,
      Alter_ID = ?,
      Alter_Date = CURRENT_TIMESTAMP
    WHERE Ris_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      risId
    ]);

    return {};
  }

  /**
   * 取得集點卡發放 ID 最大值
   *
   * @returns
   */
  async getMaxRisId(): Promise<String> {
    const sqlStr = `
    SELECT MAX(Ris_ID) as maxRisId FROM Reward_Issuance LIMIT 1
    `;

    const result = await this.internalConn.query(sqlStr);

    return result?.[0]?.maxRisId;
  }

  /**
   * 取得集點交易編號 ID 最大值
   *
   * @returns
   */
  async getMaxRewardTransactionId(): Promise<string> {
    const sqlStr = `
    SELECT MAX(Transaction_ID) as maxTransactionId FROM Reward_Card_Detail LIMIT 1
    `;

    const result = await this.internalConn.query(sqlStr);

    return result?.[0]?.maxTransactionId;
  }

  /**
   * 刪除集點卡發送詳情
   *
   * @param connection DB 連線
   * @param risId 發送編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delRewardCardSendDetail(
    connection,
    risId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Reward_Issuance SET
      Is_Active = 0,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Ris_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      authMemberId,
      risId
    ]);

    return {};
  }

  /**
   * 取得集點卡下拉式選單
   *
   * @returns
   */
  async getRewardCardMenu(): Promise<RewardCardMenu[]> {
    const sqlStr = `
    SELECT
      Reward_Card_ID as rewardCardId,
      Reward_Card_Name as rewardCardName,
      Brand_ID as brandId,
      On_Sold_End_Date as endDate
    FROM Reward_Card
    WHERE Is_Active = 1
      AND On_Sold_Start_Date <= NOW()
      AND On_Sold_End_Date >= NOW()
    `;

    const result = await this.internalConn.query(sqlStr);

    return result;
  }

  /**
   * 取得集點明細
   *
   * @param req
   * @returns
   */
  async getRewardDetail(req: GetRewardDetailDto): Promise<RewardDetail[]> {
    let sqlStr = `
    SELECT DISTINCT
      rewardDetail.ID as id,
      brand.Brand_Name as brandName,
      rewardCard.Reward_Card_Name as rewardCardName,
      rewardDetail.Transaction_ID as transactionId,
      rewardDetail.Transaction_Type as transactionType,
      rewardDetail.Point as point,
      rewardCard.Reward_Card_Max_Point as maxPoint,
      rewardDetail.Last_Point as lastPoint,
      member.Member_CardID as memberCardId,
      member.Member_Name as memberName,
      member.Mobile as mobile,
      member.Mobile_Country_Code as mobileCountryCode,
      memberBalance.Create_Date as sendCardDate,
      rewardDetail.Alter_Date as alterDate,
      rewardDetail.Reward_End_Date as expirationDate,
      rewardCard.On_Sold_End_Date as endDate
    FROM
      Reward_Card_Detail rewardDetail
      JOIN Reward_Card rewardCard ON rewardDetail.Reward_Card_ID = rewardCard.Reward_Card_ID AND rewardCard.Is_Active = 1
      JOIN Reward_Member_Balance memberBalance ON rewardDetail.Reward_Card_ID = memberBalance.Reward_Card_ID AND rewardDetail.Member_ID = memberBalance.Member_ID
      JOIN IEat_Member member ON rewardDetail.Member_ID = member.Member_ID AND member.Is_Active = 1
      JOIN Brand brand ON rewardCard.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
    WHERE rewardDetail.Is_Active = 1
    `;

    const params = [];
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MOBILE:
          sqlStr += ` AND member.Mobile = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.MEMBER_CARD:
          sqlStr += ` AND member.Member_CardID = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.REWARD_NAME:
          sqlStr += ` AND rewardCard.Reward_Card_Name = ?`;
          params.push(req?.search);
          break;
      }
    }

    if (req?.brandId) {
      sqlStr += ` AND rewardCard.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    if (req?.sendCardStartDate && req?.sendCardEndDate) {
      sqlStr += ` AND memberBalance.Create_Date >= ? AND memberBalance.Create_Date <= ?`;
      params.push(req?.sendCardStartDate, req?.sendCardEndDate);
    }

    if (req?.alterStartDate && req?.alterEndDate) {
      sqlStr += ` AND rewardDetail.Alter_Date >= ? AND rewardDetail.Alter_Date <= ?`;
      params.push(req?.alterStartDate, req?.alterEndDate);
    }

    sqlStr += ` ORDER BY rewardDetail.ID DESC`;
    sqlStr += ` LIMIT ?, ?`;
    params.push((req?.page - 1) * req?.perPage, req?.perPage);

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 取得集點明細總筆數
   *
   * @param req
   * @returns
   */
  async getRewardDetailCount(req: GetRewardDetailDto): Promise<number> {
    let sqlStr = `
    SELECT
      COUNT(DISTINCT rewardDetail.ID) as rewardDetailCount
    FROM
      Reward_Card_Detail rewardDetail
      JOIN Reward_Card rewardCard ON rewardDetail.Reward_Card_ID = rewardCard.Reward_Card_ID AND rewardCard.Is_Active = 1
      JOIN Reward_Member_Balance memberBalance ON rewardDetail.Reward_Card_ID = memberBalance.Reward_Card_ID AND rewardDetail.Member_ID = memberBalance.Member_ID
      JOIN IEat_Member member ON rewardDetail.Member_ID = member.Member_ID AND member.Is_Active = 1
      JOIN Brand brand ON rewardCard.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
    WHERE rewardDetail.Is_Active = 1
    `;

    const params = [];
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MOBILE:
          sqlStr += ` AND member.Mobile = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.MEMBER_CARD:
          sqlStr += ` AND member.Member_CardID = ?`;
          params.push(req?.search);
          break;
        case SEARCH_ACTION_TYPES.REWARD_NAME:
          sqlStr += ` AND rewardCard.Reward_Card_Name = ?`;
          params.push(req?.search);
          break;
      }
    }

    if (req?.brandId) {
      sqlStr += ` AND rewardCard.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    if (req?.sendCardStartDate && req?.sendCardEndDate) {
      sqlStr += ` AND memberBalance.Create_Date >= ? AND memberBalance.Create_Date <= ?`;
      params.push(req?.sendCardStartDate, req?.sendCardEndDate);
    }

    if (req?.alterStartDate && req?.alterEndDate) {
      sqlStr += ` AND rewardDetail.Alter_Date >= ? AND rewardDetail.Alter_Date <= ?`;
      params.push(req?.alterStartDate, req?.alterEndDate);
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.rewardDetailCount;
  }

  /**
   * 取得會員集點明細
   *
   * @param req
   * @returns
   */
  async getMemberRewardDetail(
    req: GetMemberRewardDetailDto
  ): Promise<MemberRewardDetail[]> {
    let sqlStr = `
    SELECT DISTINCT
      brand.Brand_Name as brandName,
      rewardCard.Reward_Card_Name as rewardCardName,
      rewardDetail.Transaction_ID as transactionId,
      rewardDetail.Transaction_Type as transactionType,
      rewardDetail.Point as point,
      rewardCard.Reward_Card_Max_Point as maxPoint,
      rewardDetail.Last_Point as lastPoint,
      memberBalance.Create_Date as sendCardDate,
      rewardDetail.Alter_Date as alterDate,
      rewardDetail.Reward_End_Date as expirationDate
    FROM
      Reward_Card_Detail rewardDetail
      JOIN Reward_Card rewardCard ON rewardDetail.Reward_Card_ID = rewardCard.Reward_Card_ID AND rewardCard.Is_Active = 1
      JOIN Reward_Member_Balance memberBalance ON rewardDetail.Reward_Card_ID = memberBalance.Reward_Card_ID
      JOIN Brand brand ON rewardCard.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
    WHERE rewardDetail.Is_Active = 1
      AND rewardDetail.Member_ID = ?
    `;

    const params = [];
    params.push(req?.memberId);

    if (req?.brandId) {
      sqlStr += ` AND rewardCard.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    if (req?.startDate && req?.endDate) {
      sqlStr += ` AND rewardDetail.Transaction_Date >= ? && rewardDetail.Transaction_Date <= ?`;
      params.push(req?.startDate, req?.endDate);
    }

    sqlStr += ` ORDER BY rewardDetail.ID ASC`;
    sqlStr += ` LIMIT ?, ?`;
    params.push((req?.page - 1) * req?.perPage, req?.perPage);

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 取得會員集點明細總筆數
   *
   * @param req
   * @returns
   */
  async getMemberRewardDetailCount(
    req: GetMemberRewardDetailDto
  ): Promise<number> {
    let sqlStr = `
    SELECT
      COUNT(DISTINCT rewardDetail.ID) as rewardDetailCount
    FROM
      Reward_Card_Detail rewardDetail
      JOIN Reward_Card rewardCard ON rewardDetail.Reward_Card_ID = rewardCard.Reward_Card_ID AND rewardCard.Is_Active = 1
      JOIN Reward_Member_Balance memberBalance ON rewardDetail.Reward_Card_ID = memberBalance.Reward_Card_ID
      JOIN Brand brand ON rewardCard.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
    WHERE rewardDetail.Is_Active = 1
      AND rewardDetail.Member_ID = ?
    `;

    const params = [];
    params.push(req?.memberId);

    if (req?.brandId) {
      sqlStr += ` AND rewardCard.Brand_ID = ?`;
      params.push(req?.brandId);
    }

    if (req?.startDate && req?.endDate) {
      sqlStr += ` AND rewardDetail.Transaction_Date >= ? && rewardDetail.Transaction_Date <= ?`;
      params.push(req?.startDate, req?.endDate);
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result?.[0]?.rewardDetailCount;
  }

  /**
   * 取得會員集點狀態
   *
   * @param memberId 會員編號
   * @returns
   */
  async getMemberRewardCardState(
    memberId: string
  ): Promise<GetMemberRewardCardStateResp[]> {
    const sqlStr = `
    SELECT
      rewardMemberBalance.Reward_Point as point,
      rewardCard.Reward_Card_Max_Point as maxPoint,
      rewardMemberBalance.Expiration_Date as expirationDate,
      rewardCard.On_Sold_End_Date as endDate
    FROM
      Reward_Member_Balance rewardMemberBalance
      JOIN Reward_Card rewardCard ON rewardMemberBalance.Reward_Card_ID = rewardCard.Reward_Card_ID AND rewardCard.Is_Active = 1
    WHERE rewardMemberBalance.Member_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [memberId]);

    return result;
  }

  /**
   * 取得會員集點卡剩餘點數
   *
   * @param rewardCardId 集點卡編號
   * @param memberId 會員編號
   * @returns
   */
  async getRewardMemberBalance(
    rewardCardId: string,
    memberId: string
  ): Promise<number> {
    // 取得過期時間未到達 或 未設置過期時間 或 點數為負數(負數點數會繼承)
    const sqlStr = `
    SELECT
      Reward_Point as point
    FROM
      Reward_Member_Balance
    WHERE Reward_Card_ID = ?
      AND Member_ID = ?
      AND (Expiration_Date > NOW() OR Reward_Point < 0 OR Expiration_Date IS NULL)
    `;

    const result =
      (await this.internalConn.query(sqlStr, [rewardCardId, memberId])) ?? [];

    return result?.[0]?.point ?? 0;
  }

  /**
   * 更新會員集點卡點數
   *
   * @param connection DB 連線
   * @param rewardPoint 集點點數
   * @param rewardCardId 集點卡編號
   * @param memberId 會員編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updRewardMemberBalance(
    connection,
    rewardPoint: number,
    rewardCardId: string,
    memberId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Reward_Member_Balance SET
      Reward_Point = Reward_Point + ?,
      Alter_ID = ?
    WHERE Reward_Card_ID = ?
      AND Member_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      rewardPoint,
      authMemberId,
      rewardCardId,
      memberId
    ]);

    return {};
  }
}
