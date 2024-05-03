import { Injectable } from '@nestjs/common';
import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import { ENUM_ADJUST_MEMBER_TYPE } from 'src/Definition/Enum/Point/adjust.member.type.enum';
import { ENUM_REWARD_STATUS } from 'src/Definition/Enum/Point/reward.status.enum';
import { ENUM_REWARD_TYPE } from 'src/Definition/Enum/Point/reward.type.enum';
import { ENUM_BELONG_TO } from 'src/Definition/Enum/belong.to.enum';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { removeFirstZero } from 'src/Utils/tools';
import { AddConsSettingtDto } from './Dto/add.cons.setting.dto';
import { AddPointAdjustDto } from './Dto/add.point.adjust.dto';
import { AddRewardSettingtDto } from './Dto/add.reward.setting.dto';
import { GetPointSendingListDto } from './Dto/get.point.sending.list.dto';
import { GetProductListDto } from './Dto/get.product.list.dto';
import { GetStoreListDto } from './Dto/get.store.list.dto';
import { UpdateBasicSettingDto } from './Dto/update.basic.setting.dto';
import { GetBasicSettingResp } from './Interface/get.basic.setting.interface';
import { GetConsSettingInfoResp } from './Interface/get.cons.setting.info.from.db.interface';
import { GetPointAdjustInfoResp } from './Interface/get.point.adjust.info.from.db.interface';
import { GetPointAdjustListResp } from './Interface/get.point.adjust.list.from.db.interface';
import { GetPointSendingInfoResp } from './Interface/get.point.sending.info.interface';
import { GetProductInfoResp } from './Interface/get.product.info.interface';
import { GetRewardSettingInfoResp } from './Interface/get.reward.setting.info.interface';
import { GetStoreFilterOptionsFromDBResp } from './Interface/get.store.filter.options.form.db';
import { GetStoreInfoResp } from './Interface/get.store.info.interface';

/**
 *
 * @class
 */
@Injectable()
export class PointRepository {
  constructor(private internalConn: MysqlProvider) {}
  private readonly escape = this.internalConn.escape;

  /**
   * 取得最新的編號
   * @param today 今日日期
   * @returns
   */
  async getPointLatestId(today: string): Promise<string> {
    const _today = this.escape(`R${today}%`);

    let queryStr = /* sql */ `
SELECT SUBSTR(Point_Reward_ID,8) id
FROM Point_Reward_Rules
WHERE Point_Reward_ID LIKE ${_today}
ORDER BY Create_Date DESC LIMIT 1`;

    const result = (await this.internalConn.query(queryStr)) ?? [];

    return result?.[0]?.id ?? null;
  }

  /**
   * 取得積點調整最新的編號
   * @param today 今日日期
   * @returns
   */
  async getAdjustLatestId(today: string): Promise<string> {
    const _today = this.escape(`Ad${today}%`);

    let queryStr = /* sql */ `
  SELECT SUBSTR(Adjust_ID,9) id
  FROM Point_Reward_Adjust
  WHERE Adjust_ID LIKE ${_today}
  ORDER BY Adjust_ID DESC LIMIT 1`;

    const result = (await this.internalConn.query(queryStr)) ?? [];

    return result?.[0]?.id ?? null;
  }

  /**
   * 取得基本設定詳細資訊
   */
  async getBasicSetting(): Promise<GetBasicSettingResp[]> {
    const queryStr = /* sql */ `
      SELECT
        pm.Point_ID pointId,
        pm.Point_Name pointName,
        pm.Point_Ratio pointRatio,
        pm.Expiry_Day expiryDay,
        pm.Expiry_Month expiryMonth,
        pm.Expiry_Date expiryDate,
        c.Channel_ID channelId,
        c.Channel_Name channelName,
        pmcd.Full_Date fullDate
      FROM
        Channel c
      LEFT JOIN Point_Management_Channel_D pmcd ON c.Channel_ID = pmcd.Channel_ID
      LEFT JOIN Point_Management pm ON pmcd.Point_ID = pm.Point_ID
      WHERE c.Is_Active = 1 AND c.Point_Calculation = 1
      ORDER BY c.Sort_Order
    `;

    const result = await this.internalConn.query(queryStr);

    return result;
  }

  /**
   * 編輯基本設定
   */
  async updateBasicSetting(
    req: UpdateBasicSettingDto,
    changedFields: {
      field: string[];
      fieldName: string[];
      newValue: string[];
    }
  ): Promise<Record<string, never>> {
    const _pointId = this.escape(
      req?.pointId?.length ? req?.pointId : 'P0000001'
    );
    const _pointName = this.escape(req?.pointName);
    const _pointRatio = this.escape(req?.pointRatio);
    const _expiryYear = this.escape(req?.expiryYear * 365);
    const _expiryMonth = this.escape(req?.expiryMonth);
    const _expiryDate = this.escape(req?.expiryDate);
    const _authMemberId = this.escape(req?.iam?.authMemberId);
    const _field = this.escape(changedFields?.field?.join(','));
    const _fieldName = this.escape(changedFields?.fieldName?.join(','));
    const _newValue = this.escape(changedFields?.newValue?.join(','));

    let queryStr = /* sql */ `
-- 基本設定表
INSERT INTO Point_Management
(Point_ID, Point_Name, Point_Ratio, Expiry_Day, Expiry_Month, Expiry_Date, Create_ID, Alter_ID)
VALUES(${_pointId}, ${_pointName}, ${_pointRatio}, ${_expiryYear}, ${_expiryMonth}, ${_expiryDate}, ${_authMemberId}, ${_authMemberId})
ON DUPLICATE KEY UPDATE
Point_Name = ${_pointName}, Point_Ratio = ${_pointRatio},
Expiry_Day = ${_expiryYear}, Expiry_Month = ${_expiryMonth}, Expiry_Date = ${_expiryDate}, Alter_ID = ${_authMemberId}, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};

-- 刪除渠道關聯表
DELETE FROM Point_Management_Channel_D WHERE Point_ID = ${_pointId};
    `;

    queryStr += /* sql */ `
-- 重新新增渠道關聯表
INSERT INTO Point_Management_Channel_D
(Point_ID, Channel_ID, Full_Date, Create_ID, Alter_ID)
VALUES
    `;

    req?.channel?.forEach((channel, idx) => {
      const _channelId = this.escape(channel?.channelId);
      const _fullDate = this.escape(channel?.fullDate);
      queryStr += `
          (${_pointId}, ${_channelId}, ${_fullDate}, ${_authMemberId}, ${_authMemberId})${
        idx === req?.channel?.length - 1 ? ';' : ','
      }
          `;
    });

    queryStr += /* sql */ `
-- 新增 log
INSERT INTO Basic_Point_Setting_Log
(Fields, Field_Name, New_Value, Create_ID)
VALUES(${_field}, ${_fieldName}, ${_newValue}, ${_authMemberId});
`;

    await this.internalConn.query(queryStr);

    return {};
  }

  /**
   * 取得列表筆數＆積點發放規則列表
   * @param req
   */
  async getPointSendingInfo(
    req: GetPointSendingListDto
  ): Promise<GetPointSendingInfoResp> {
    const _rewardName = this.escape(req?.rewardName);
    const _rewardType = this.escape(req?.rewardType);
    const _startDate = this.escape(req?.startDate);
    const _endDate = this.escape(req?.endDate);
    const _membershipStatus = this.escape(req?.membershipStatus);
    const _brandId = this.escape(req?.brandId);
    const _excludePointRewardIds = this.escape(req?.excludePointRewardIds);
    const _start = this.escape((req?.page - 1) * req?.perPage);
    const _limit = this.escape(req?.perPage);

    let queryCountStr = /* sql */ `
-- 取得資料筆數
SELECT COUNT(1) rewardCount FROM Point_Reward_Rules prr
INNER JOIN (
    SELECT prms.Point_Reward_ID, JSON_ARRAYAGG(prms.Member_Ship) memberShipId, JSON_ARRAYAGG(imsb.Member_Ship_Name) memberShipName
    FROM Point_Reward_Member_Ship prms
    INNER JOIN IEat_Member_Ship_Branch imsb ON imsb.Member_Ship_Branch_ID = prms.Member_Ship
    GROUP BY prms.Point_Reward_ID
) memberShipData ON memberShipData.Point_Reward_ID = prr.Point_Reward_ID
WHERE Is_Active = 1`;

    let queryStr = /* sql */ `
-- 取得列表資料
SELECT  prr.Point_Reward_ID rewardId,
        prr.Reward_Name rewardName,
        memberShipData.memberShipName memberShipName,
       	prr.Point_Reward_Type rewardType,
       	JSON_ARRAYAGG(JSON_OBJECT("ratioType", prs.Point_Ratio_Type, "purchasedSum", prs.Purchased_Sum, 'purchasedEvery', prs.Purchased_Every, 'handselPoint', prs.Handsel_Point)) rewardPoints,
        prr.Reward_Start_Date startDate,
        prr.Reward_End_Date endDate,
        prr.Create_Date createDate,
        prr.Alter_Date modifyDate,
        IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = prr.Create_ID), 'system') createId,
        IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = prr.Alter_ID), 'system') modifyId
FROM Point_Reward_Rules prr
INNER JOIN Point_Reward_Setting prs ON prs.Point_Reward_ID = prr.Point_Reward_ID
INNER JOIN Point_Reward_Member_Ship prms ON prms.Point_Reward_ID = prr.Point_Reward_ID
INNER JOIN IEat_Member_Ship_Branch imsb ON imsb.Member_Ship_Branch_ID = prms.Member_Ship
INNER JOIN (
    SELECT prms.Point_Reward_ID, JSON_ARRAYAGG(prms.Member_Ship) memberShipId, JSON_ARRAYAGG(imsb.Member_Ship_Name) memberShipName
    FROM Point_Reward_Member_Ship prms
    INNER JOIN IEat_Member_Ship_Branch imsb ON imsb.Member_Ship_Branch_ID = prms.Member_Ship
    GROUP BY prms.Point_Reward_ID
) memberShipData ON memberShipData.Point_Reward_ID = prr.Point_Reward_ID
WHERE prr.Is_Active = 1 AND prs.Status = 1`;

    if (req?.brandId) {
      queryCountStr += /* sql */ ` AND prr.Point_Reward_ID IN (SELECT Point_Reward_ID FROM Point_Reward_Brands WHERE Is_Active = 1 AND Brand_ID = ${_brandId})`;
      queryStr += /* sql */ ` AND prr.Point_Reward_ID IN (SELECT Point_Reward_ID FROM Point_Reward_Brands WHERE Is_Active = 1 AND Brand_ID = ${_brandId})`;
    }

    if (req?.excludePointRewardIds?.length) {
      queryCountStr += /* sql */ ` AND prr.Point_Reward_ID NOT IN (${_excludePointRewardIds})`;
      queryStr += /* sql */ ` AND prr.Point_Reward_ID NOT IN (${_excludePointRewardIds})`;
    }

    switch (req?.status) {
      // 今天 2023/08/19 < 開始日 2023/08/21 => 尚未開始
      case ENUM_REWARD_STATUS.NOTYET:
        if (req?.startDate && req?.endDate) {
          queryCountStr += /* sql */ ` AND UNIX_TIMESTAMP(CURRENT_TIMESTAMP) < UNIX_TIMESTAMP(Reward_Start_Date)`;
          queryStr += /* sql */ ` AND UNIX_TIMESTAMP(CURRENT_TIMESTAMP) < UNIX_TIMESTAMP(Reward_Start_Date)`;
        } else {
          queryCountStr += /* sql */ ` AND (UNIX_TIMESTAMP(CURRENT_TIMESTAMP) < UNIX_TIMESTAMP(Reward_Start_Date) OR (Reward_Start_Date IS NULL AND Reward_End_Date IS NULL))`;
          queryStr += /* sql */ ` AND (UNIX_TIMESTAMP(CURRENT_TIMESTAMP) < UNIX_TIMESTAMP(Reward_Start_Date) OR (Reward_Start_Date IS NULL AND Reward_End_Date IS NULL))`;
        }
        break;

      // 今天 2023/08/25 > 結束日 2023/08/21 => 已結束
      case ENUM_REWARD_STATUS.END:
        queryCountStr += /* sql */ ` AND UNIX_TIMESTAMP(CURRENT_TIMESTAMP) > UNIX_TIMESTAMP(Reward_End_Date)`;
        queryStr += /* sql */ ` AND UNIX_TIMESTAMP(CURRENT_TIMESTAMP) > UNIX_TIMESTAMP(Reward_End_Date)`;
        break;

      // 今天 2023/08/24 <= 結束日 2023/08/31 && 今天 2023/08/24 >= 開始日 2023/08/19 => 進行中
      case ENUM_REWARD_STATUS.ING:
        queryCountStr += /* sql */ ` AND UNIX_TIMESTAMP(CURRENT_TIMESTAMP) <= UNIX_TIMESTAMP(Reward_End_Date) AND UNIX_TIMESTAMP(CURRENT_TIMESTAMP) >= UNIX_TIMESTAMP(Reward_Start_Date)`;
        queryStr += /* sql */ ` AND UNIX_TIMESTAMP(CURRENT_TIMESTAMP) <= UNIX_TIMESTAMP(Reward_End_Date) AND UNIX_TIMESTAMP(CURRENT_TIMESTAMP) >= UNIX_TIMESTAMP(Reward_Start_Date)`;
        break;
    }

    if (req?.rewardName) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.REWARD_NAME:
          queryCountStr += ` AND prr.Reward_Name = ${_rewardName}`;
          queryStr += ` AND prr.Reward_Name = ${_rewardName}`;
          break;
      }
    }

    if (
      req?.rewardType === ENUM_REWARD_TYPE.CONS ||
      req?.rewardType === ENUM_REWARD_TYPE.REWARD
    ) {
      queryCountStr += /* sql */ ` AND prr.Point_Reward_Type = ${_rewardType}`;
      queryStr += /* sql */ ` AND prr.Point_Reward_Type = ${_rewardType}`;
    }
    if (req?.membershipStatus) {
      queryCountStr += /* sql */ ` AND POSITION(${_membershipStatus} IN memberShipData.memberShipId)`;
      queryStr += /* sql */ ` AND POSITION(${_membershipStatus} IN memberShipData.memberShipId)`;
    }
    if (req?.startDate && req?.endDate) {
      queryCountStr += /* sql */ ` AND Reward_Start_Date <= ${_endDate} AND Reward_End_Date >= ${_startDate}`;
      queryStr += /* sql */ ` AND prr.Reward_Start_Date <= ${_endDate} AND prr.Reward_End_Date >= ${_startDate}`;
    }

    queryStr += /* sql */ ` GROUP BY prr.Point_Reward_ID ORDER BY prr.Create_Date DESC LIMIT ${_start}, ${_limit}`;
    const result =
      (await this.internalConn.query(`${queryCountStr};${queryStr}`)) ?? [];
    const [rewardCount, rewardList] = result;

    return { rewardCount, rewardList };
  }

  /**
   * 取得列表筆數＆門市列表
   * @param req
   */
  async getSotreInfo(req: GetStoreListDto): Promise<GetStoreInfoResp> {
    const _search = this.escape(req?.search);
    const _brand = this.escape(req?.brand);
    const _mall = this.escape(req?.mall);
    const _cityCode = this.escape(req?.cityCode);
    const _zipCode = this.escape(req?.zipCode);
    const _start = this.escape((req?.page - 1) * req?.perPage);
    const _limit = this.escape(req?.perPage);

    let queryCountStr = /* sql */ `
-- 取得資料筆數
SELECT COUNT(1) storeCount FROM Store store WHERE store.Store_Status = 1`;

    let queryStr = /* sql */ `
-- 取得列表資料
SELECT  brand.Brand_Name brandName,
        store.Store_Name storeName,
        cc.Code_Name city,
        cc1.Code_Name zip,
        store.Mall_Name mallName,
        store.Pos_Store posStore
FROM Store store
INNER JOIN Brand brand ON brand.Brand_ID = store.Brand_ID
INNER JOIN Code_Center cc ON cc.Code = store.Store_City AND cc.Belong_To = '${ENUM_BELONG_TO.CITY_CODE}'
INNER JOIN Code_Center cc1 ON cc1.Code = store.Store_District AND cc1.Belong_To = '${ENUM_BELONG_TO.ZIP_CODE}'
WHERE store.Store_Status = 1`;

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.STORE_ID:
          queryCountStr += ` AND store.Pos_Store = ${_search}`;
          queryStr += ` AND store.Pos_Store = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.STORE_NAME:
          queryCountStr += ` AND store.Store_Name = ${_search}`;
          queryStr += ` AND store.Store_Name = ${_search}`;
          break;
      }
    }

    if (req?.brand) {
      queryCountStr += /* sql */ ` AND store.Brand_ID = ${_brand}`;
      queryStr += /* sql */ ` AND store.Brand_ID = ${_brand}`;
    }

    if (req?.mall) {
      queryCountStr += /* sql */ ` AND store.Mall_Name = ${_mall}`;
      queryStr += /* sql */ ` AND store.Mall_Name = ${_mall}`;
    }

    if (req?.cityCode) {
      queryCountStr += /* sql */ ` AND store.Store_City = ${_cityCode}`;
      queryStr += /* sql */ ` AND store.Store_City = ${_cityCode}`;
    }
    if (req?.zipCode) {
      queryCountStr += /* sql */ ` AND store.Store_District = ${_zipCode}`;
      queryStr += /* sql */ ` AND store.Store_District = ${_zipCode}`;
    }

    queryStr += /* sql */ ` ORDER BY store.Brand_ID LIMIT ${_start}, ${_limit}`;

    const result =
      (await this.internalConn.query(`${queryCountStr};${queryStr}`)) ?? [];
    const [storeListCount, storeList] = result;

    return { storeListCount, storeList };
  }

  /**
   * 門市列表篩選資料(品牌、商場)
   */
  async getStoreFilterOptions(): Promise<GetStoreFilterOptionsFromDBResp> {
    const queryStr = /* sql */ `
SELECT DISTINCT Mall_Name mallName FROM Store WHERE Store_Status = 1;

SELECT Brand_ID brandId, Brand_Name brandName
FROM Brand WHERE Brand_Status = 1
  `;

    const result = await this.internalConn.query(queryStr);
    const [mallInfo, brandInfo] = result;

    return { mallInfo, brandInfo };
  }

  /**
   * 取得列表筆數＆門市列表
   * @param req
   */
  async getProductInfo(req: GetProductListDto): Promise<GetProductInfoResp> {
    const _search = this.escape(req?.search);
    const _brand = this.escape(req?.brand);
    const _channel = this.escape(req?.channel);
    const _excludePrdIds = this.escape(req?.excludePrdIds);
    const _start = this.escape((req?.page - 1) * req?.perPage);
    const _limit = this.escape(req?.perPage);

    let queryCountStr = /* sql */ `
-- 取得資料筆數
SELECT COUNT(1) productCount FROM Product pro
INNER JOIN Product_Brand pb ON pb.Product_ID = pro.Product_ID
WHERE pro.Product_Status = 1`;

    let queryStr = /* sql */ `
-- 取得列表資料
SELECT pro.Product_ID productId, pro.Product_Name productName, b.Brand_Name brandName, c.Channel_Name channelName
FROM Product pro
INNER JOIN Channel c ON c.Channel_ID = pro.Channel_ID
INNER JOIN Product_Brand pb ON pb.Product_ID = pro.Product_ID
INNER JOIN Brand b ON b.Brand_ID = pb.Brand_ID
WHERE pro.Product_Status = 1`;

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.PRODUCT_ID:
          queryCountStr += ` AND pro.Product_ID = ${_search}`;
          queryStr += ` AND pro.Product_ID = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.PRODUCT_NAME:
          queryCountStr += ` AND pro.Product_Name = ${_search}`;
          queryStr += ` AND pro.Product_Name = ${_search}`;
          break;
      }
    }

    if (req?.brand) {
      queryCountStr += /* sql */ ` AND pb.Brand_ID = ${_brand}`;
      queryStr += /* sql */ ` AND pb.Brand_ID = ${_brand}`;
    }

    if (req?.channel?.length) {
      queryCountStr += /* sql */ ` AND pro.Channel_ID IN (${_channel})`;
      queryStr += /* sql */ ` AND pro.Channel_ID IN (${_channel})`;
    }

    if (req?.excludePrdIds?.length) {
      queryCountStr += /* sql */ ` AND pro.Product_ID NOT IN (${_excludePrdIds})`;
      queryStr += /* sql */ ` AND pro.Product_ID NOT IN (${_excludePrdIds})`;
    }

    queryStr += /* sql */ ` ORDER BY pro.Create_Date DESC LIMIT ${_start}, ${_limit}`;

    const result =
      (await this.internalConn.query(`${queryCountStr};${queryStr}`)) ?? [];
    const [productListCount, productList] = result;

    return { productListCount, productList };
  }

  /**
   * 複製發放規則
   * @param rewardId 要複製的對象
   * @param newRewardId 新的活動編號
   */
  async copyPointSending(
    rewardId: string,
    newRewardId: string
  ): Promise<Record<string, never>> {
    const _rewardId = this.escape(rewardId);
    const _newRewardId = this.escape(newRewardId);

    const queryStr = /* sql */ `
SET @name = (SELECT Reward_Name FROM Point_Reward_Rules WHERE Point_Reward_ID = ${_rewardId});
SET @number = (SELECT COUNT(1) FROM Point_Reward_Rules WHERE Reward_Name LIKE CONCAT(@name,'%') AND Is_Active = 1);
SET @copyNumber= IF(@number=1,'',@number-1);

INSERT INTO Point_Reward_Rules
(Point_Reward_ID, Reward_Name, Point_Reward_Type, Reward_Start_Date, Reward_End_Date, Active_Status, Active_Day, Select_Store, Remark, Is_Active, Create_Date, Create_ID, Alter_Date, Alter_ID)
SELECT ${_newRewardId}, CONCAT(@name,'-複製',@copyNumber), Point_Reward_Type, NULL, NULL, Active_Status, Active_Day, Select_Store, Remark, Is_Active, CURRENT_TIMESTAMP, Create_ID, CURRENT_TIMESTAMP, Alter_ID
FROM Point_Reward_Rules
WHERE Point_Reward_ID = ${_rewardId};

INSERT INTO Point_Reward_Member_Ship
(Point_Reward_ID, Member_Ship, Is_Active, Create_Date, Create_ID, Alter_Date, Alter_ID)
SELECT ${_newRewardId}, Member_Ship, Is_Active, CURRENT_TIMESTAMP, Create_ID, CURRENT_TIMESTAMP, Alter_ID
FROM Point_Reward_Member_Ship
WHERE Point_Reward_ID = ${_rewardId};

INSERT INTO Point_Reward_Setting
(Point_Reward_ID, Point_Ratio_Type, Status, Purchased_Sum, Purchased_Every, Handsel_Point, Is_Active, Create_Date, Create_ID, Alter_Date, Alter_ID)
SELECT ${_newRewardId}, Point_Ratio_Type, Status, Purchased_Sum, Purchased_Every, Handsel_Point, Is_Active, CURRENT_TIMESTAMP, Create_ID, CURRENT_TIMESTAMP, Alter_ID
FROM Point_Reward_Setting
WHERE Point_Reward_ID = ${_rewardId};

INSERT INTO Point_Reward_Channel
(Point_Reward_ID, Channel_ID, Is_Active, Create_Date, Create_ID, Alter_Date, Alter_ID)
SELECT ${_newRewardId}, Channel_ID, Is_Active, CURRENT_TIMESTAMP, Create_ID, CURRENT_TIMESTAMP, Alter_ID
FROM Point_Reward_Channel
WHERE Point_Reward_ID = ${_rewardId};

-- 不會複製排除日期
/* INSERT INTO Point_Reward_Exception_Dates
(Point_Reward_ID, Exception_Date, Is_Active, Create_Date, Create_ID, Alter_Date, Alter_ID)
SELECT ${_newRewardId}, Exception_Date, Is_Active, CURRENT_TIMESTAMP, Create_ID, CURRENT_TIMESTAMP, Alter_ID
FROM Point_Reward_Exception_Dates
WHERE Point_Reward_ID = ${_rewardId}; */

INSERT INTO Point_Reward_Meal_Period
(Point_Reward_ID, Meal_Period_ID, Is_Active, Create_Date, Create_ID, Alter_Date, Alter_ID)
SELECT ${_newRewardId}, Meal_Period_ID, Is_Active, CURRENT_TIMESTAMP, Create_ID, CURRENT_TIMESTAMP, Alter_ID
FROM Point_Reward_Meal_Period
WHERE Point_Reward_ID = ${_rewardId};

INSERT INTO Point_Reward_Product
(Point_Reward_ID, Product_ID, Is_Active, Create_Date, Create_ID, Alter_Date, Alter_ID)
SELECT ${_newRewardId}, Product_ID, Is_Active, CURRENT_TIMESTAMP, Create_ID, CURRENT_TIMESTAMP, Alter_ID
FROM Point_Reward_Product
WHERE Point_Reward_ID = ${_rewardId};

INSERT INTO Point_Reward_Brands
(Point_Reward_ID, Brand_ID, Is_Active, Create_Date, Create_ID, Alter_Date, Alter_ID)
SELECT ${_newRewardId}, Brand_ID, Is_Active, CURRENT_TIMESTAMP, Create_ID, CURRENT_TIMESTAMP, Alter_ID
FROM Point_Reward_Brands
WHERE Point_Reward_ID = ${_rewardId};

INSERT INTO Point_Reward_Branch_Store
(Point_Reward_ID, Brand_ID, Store_ID, Is_Active, Create_Date, Create_ID, Alter_Date, Alter_ID)
SELECT ${_newRewardId}, Brand_ID, Store_ID, Is_Active, CURRENT_TIMESTAMP, Create_ID, CURRENT_TIMESTAMP, Alter_ID
FROM Point_Reward_Branch_Store
WHERE Point_Reward_ID = ${_rewardId};
`;
    await this.internalConn.query(queryStr);

    return {};
  }

  /**
   * 取得活動起迄日
   * @param rewardId 活動編號
   */
  async getRewardDate(
    rewardId: string
  ): Promise<{ startDate: string; endDate: string }> {
    const queryStr = /* sql */ `
SELECT Reward_Start_Date startDate, Reward_End_Date endDate
FROM Point_Reward_Rules
WHERE Point_Reward_ID = ?`;

    const result =
      (await this.internalConn.query(queryStr, [rewardId]))?.[0] ?? null;

    return result;
  }

  /**
   * 停用發放規則
   * @param rewardId 活動編號
   */
  async stopPointSending(
    rewardId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const queryStr = /* sql */ `
UPDATE Point_Reward_Rules
SET Reward_End_Date = DATE_SUB(NOW(), INTERVAL 1 MINUTE), Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ?
WHERE Point_Reward_ID = ?`;

    await this.internalConn.query(queryStr, [authMemberId, rewardId]);

    return {};
  }

  /**
   * 刪除消費型積點設定
   * @param rewardId 活動編號
   */
  async delPointSending(
    rewardId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const queryStr = /* sql */ `
UPDATE Point_Reward_Rules
SET Is_Active = 0, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ?
WHERE Point_Reward_ID = ?`;

    await this.internalConn.query(queryStr, [authMemberId, rewardId]);

    return {};
  }

  /**
   * 新增/編輯活動型積點設定
   * @param settingId 會籍版本編號
   * @param req
   * @param startDate 變 utc+0 的開始日
   * @param endDate 變 utc+0 的結束日
   * @returns
   */
  async addConsSetting(
    rewardId: string,
    req: AddConsSettingtDto,
    startDate: string,
    endDate: string
  ): Promise<Record<string, never>> {
    const _rewardType = this.escape(ENUM_REWARD_TYPE.CONS);
    const _rewardId = this.escape(rewardId);
    const _rewardName = this.escape(req?.rewardName);
    const _startDate = this.escape(startDate);
    const _endDate = this.escape(endDate);
    const _activeStatus = this.escape(req?.activeStatus);
    const _activeDay = this.escape(req?.activeDay);
    const _selectStore = this.escape(req?.selectStore);
    const _authMemberId = this.escape(req?.iam?.authMemberId);

    let queryStr = /* sql */ `
-- 主表
INSERT INTO Point_Reward_Rules
(Point_Reward_ID, Reward_Name, Point_Reward_Type, Reward_Start_Date, Reward_End_Date, Active_Status, Active_Day, Select_Store, Create_ID, Alter_ID)
VALUES(${_rewardId}, ${_rewardName}, ${_rewardType}, ${_startDate}, ${_endDate}, ${_activeStatus}, ${_activeDay}, ${_selectStore}, ${_authMemberId}, ${_authMemberId})
ON DUPLICATE KEY UPDATE
Reward_Name = ${_rewardName}, Reward_Start_Date = ${_startDate}, Reward_End_Date = ${_endDate}, Active_Status = ${_activeStatus}, Active_Day = ${_activeDay}, Select_Store = ${_selectStore}, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};

-- 主表關聯會籍
DELETE FROM Point_Reward_Member_Ship WHERE Point_Reward_ID = ${_rewardId};
INSERT INTO Point_Reward_Member_Ship
(Point_Reward_ID, Member_Ship, Create_ID, Alter_ID)
VALUES`;
    req?.memberShip?.forEach((member, idx) => {
      const _memberShip = this.escape(member);
      queryStr += `
(${_rewardId}, ${_memberShip}, ${_authMemberId}, ${_authMemberId})${
        idx === req?.memberShip?.length - 1 ? ';' : ','
      }`;
    });

    queryStr += /* sql */ `
-- 主表關聯贈送積點
DELETE FROM Point_Reward_Setting WHERE Point_Reward_ID = ${_rewardId};
INSERT INTO Point_Reward_Setting
(Point_Reward_ID, Point_Ratio_Type, Status, Purchased_Sum, Purchased_Every, Handsel_Point, Create_ID, Alter_ID)
VALUES`;
    req?.pointSetting?.forEach((point, idx) => {
      const _pointType = this.escape(point?.pointType);
      const _status = this.escape(point?.status);
      const _purchasedSum = this.escape(point?.purchasedSum);
      const _purchasedEvery = this.escape(point?.purchasedEvery);
      const _handselPoint = this.escape(point?.handselPoint);
      queryStr += `
(${_rewardId}, ${_pointType}, ${_status}, ${_purchasedSum}, ${_purchasedEvery}, ${_handselPoint}, ${_authMemberId}, ${_authMemberId})${
        idx === req?.pointSetting?.length - 1 ? ';' : ','
      }`;
    });

    queryStr += /* sql */ `
-- 主表關聯渠道
DELETE FROM Point_Reward_Channel WHERE Point_Reward_ID = ${_rewardId};
INSERT INTO Point_Reward_Channel
(Point_Reward_ID, Channel_ID, Create_ID, Alter_ID)
VALUES`;
    req?.channelId?.forEach((channelId, idx) => {
      const _channelId = this.escape(channelId);
      queryStr += `
(${_rewardId}, ${_channelId}, ${_authMemberId}, ${_authMemberId})${
        idx === req?.channelId?.length - 1 ? ';' : ','
      }`;
    });

    if (req?.excludeDate?.length) {
      queryStr += /* sql */ `
-- 主表關聯排除日期
DELETE FROM Point_Reward_Exception_Dates WHERE Point_Reward_ID = ${_rewardId};
INSERT INTO Point_Reward_Exception_Dates
(Point_Reward_ID, Exception_Date, Create_ID, Alter_ID)
VALUES`;
      req?.excludeDate?.forEach((date, idx) => {
        const _date = this.escape(date);
        queryStr += `
(${_rewardId}, ${_date}, ${_authMemberId}, ${_authMemberId})${
          idx === req?.excludeDate?.length - 1 ? ';' : ','
        }`;
      });
    }

    if (req?.mealPeriod?.length) {
      queryStr += /* sql */ `
-- 主表關聯餐期
DELETE FROM Point_Reward_Meal_Period WHERE Point_Reward_ID = ${_rewardId};
INSERT INTO Point_Reward_Meal_Period
(Point_Reward_ID, Meal_Period_ID, Create_ID, Alter_ID)
VALUES`;
      req?.mealPeriod?.forEach((mealPeriod, idx) => {
        const _mealPeriod = this.escape(mealPeriod);
        queryStr += `
(${_rewardId}, ${_mealPeriod}, ${_authMemberId}, ${_authMemberId})${
          idx === req?.mealPeriod?.length - 1 ? ';' : ','
        }`;
      });
    }

    if (req?.product?.length) {
      queryStr += /* sql */ `
-- 主表關聯餐期
DELETE FROM Point_Reward_Product WHERE Point_Reward_ID = ${_rewardId};
INSERT INTO Point_Reward_Product
(Point_Reward_ID, Product_ID, Create_ID, Alter_ID)
VALUES`;
      req?.product?.forEach((product, idx) => {
        const _product = this.escape(product);
        queryStr += `
(${_rewardId}, ${_product}, ${_authMemberId}, ${_authMemberId})${
          idx === req?.product?.length - 1 ? ';' : ','
        }`;
      });
    }

    // req?.brand 空陣列=全部品牌＆門市
    if (req?.brand?.length) {
      queryStr += /* sql */ `
-- 主表關聯品牌
DELETE FROM Point_Reward_Brands WHERE Point_Reward_ID = ${_rewardId};
INSERT INTO Point_Reward_Brands
(Point_Reward_ID, Brand_ID, Create_ID, Alter_ID)
VALUES`;
      req?.brand?.forEach((brand, idx) => {
        const _brandId = this.escape(brand?.brandId);
        queryStr += `
(${_rewardId}, ${_brandId}, ${_authMemberId}, ${_authMemberId})${
          idx === req?.brand?.length - 1 ? ';' : ','
        }`;
      });

      queryStr += /* sql */ `
-- 主表關聯門市
DELETE FROM Point_Reward_Branch_Store WHERE Point_Reward_ID = ${_rewardId};`;
      req?.brand?.forEach((brand) => {
        // req?.storeId 空陣列=該品牌全部門市
        if (brand?.storeId?.length) {
          queryStr += /* sql */ `
        INSERT INTO Point_Reward_Branch_Store
        (Point_Reward_ID, Brand_ID, Store_ID, Create_ID, Alter_ID)
        VALUES`;
          brand.storeId.forEach((store) => {
            const _store = this.escape(store);
            const _brandId = this.escape(brand?.brandId);
            queryStr += `
        (${_rewardId}, ${_brandId}, ${_store}, ${_authMemberId}, ${_authMemberId}),`;
          });
          if (queryStr.endsWith(',')) {
            queryStr = queryStr.slice(0, -1) + ';';
          }
        } else {
          const _brandId = this.escape(brand?.brandId);
          queryStr += /* sql */ `
          INSERT INTO Point_Reward_Branch_Store
          (Point_Reward_ID, Brand_ID, Store_ID, Create_ID, Alter_ID)
          SELECT ${_rewardId}, Brand_ID, Store_ID, ${_authMemberId}, ${_authMemberId} FROM Store WHERE Brand_ID = ${_brandId} AND Store_Status = 1;`;
        }
      });
    } else {
      queryStr += /* sql */ `
-- 主表關聯品牌
DELETE FROM Point_Reward_Brands WHERE Point_Reward_ID = ${_rewardId};
INSERT INTO Point_Reward_Brands
(Point_Reward_ID, Brand_ID, Create_ID, Alter_ID)
SELECT ${_rewardId}, Brand_ID, ${_authMemberId}, ${_authMemberId} FROM Brand WHERE Brand_Status = 1;
-- 主表關聯門市
DELETE FROM Point_Reward_Branch_Store WHERE Point_Reward_ID = ${_rewardId};
INSERT INTO Point_Reward_Branch_Store
(Point_Reward_ID, Brand_ID, Store_ID, Create_ID, Alter_ID)
SELECT ${_rewardId}, Brand_ID, Store_ID, ${_authMemberId}, ${_authMemberId} FROM Store WHERE Store_Status = 1;
`;
    }

    await this.internalConn.query(queryStr);

    return {};
  }

  /**
   * 消費型積點設定詳細資料
   * @param rewardId
   */
  async getConsSettingInfo(rewardId: string): Promise<GetConsSettingInfoResp> {
    const queryStr = /* sql */ `
SELECT  prr.Point_Reward_ID rewardId,
        prr.Reward_Name rewardName,
        prr.Reward_Start_Date startDate,
        prr.Reward_End_Date endDate,
        prr.Active_Status activeStatus,
        prr.Active_Day activeDay,
        prr.Select_Store selectStore,
        JSON_ARRAYAGG(pred.Exception_Date) exceptionDate,
        JSON_ARRAYAGG(prc.Channel_ID) channelId,
        JSON_ARRAYAGG(prms.Member_Ship) memberShip,
        JSON_ARRAYAGG(prmp.Meal_Period_ID) mealPriodId,
        JSON_ARRAYAGG(JSON_OBJECT("ratioType", prs.Point_Ratio_Type, "ratioStatus", prs.Status, "purchasedSum", prs.Purchased_Sum, 'purchasedEvery', prs.Purchased_Every, 'handselPoint', prs.Handsel_Point)) rewardPoints
FROM Point_Reward_Rules prr
LEFT JOIN Point_Reward_Exception_Dates pred ON pred.Point_Reward_ID = prr.Point_Reward_ID
INNER JOIN Point_Reward_Channel prc ON prc.Point_Reward_ID = prr.Point_Reward_ID
INNER JOIN Point_Reward_Member_Ship prms ON prms.Point_Reward_ID = prr.Point_Reward_ID
LEFT JOIN Point_Reward_Meal_Period prmp ON prmp.Point_Reward_ID = prr.Point_Reward_ID
INNER JOIN Point_Reward_Setting prs ON prs.Point_Reward_ID = prr.Point_Reward_ID
WHERE prr.Point_Reward_ID = ? AND Point_Reward_Type = ?
GROUP BY prr.Point_Reward_ID;

SELECT  brand.Brand_ID brandId,
        brand.Brand_Name brandName,
        store.Store_Name storeName,
        store.Store_ID storeId,
        store.Store_City cityCode,
        store.Store_District zipCode,
        store.Mall_Name mallName,
        store.Pos_Store posStore
FROM Point_Reward_Branch_Store prbs
INNER JOIN Point_Reward_Brands prb ON prb.Point_Reward_ID = prbs.Point_Reward_ID AND prbs.Brand_ID = prb.Brand_ID
INNER JOIN Store store ON store.Store_ID = prbs.Store_ID
INNER JOIN Brand brand ON brand.Brand_ID = prb.Brand_ID
WHERE prbs.Point_Reward_ID = ?;

SELECT  p.Product_ID productId,
        p.Product_Name productName,
        brand.Brand_Name brandName
FROM Point_Reward_Product prp
INNER JOIN Product p ON p.Product_ID = prp.Product_ID
INNER JOIN Product_Brand pb ON p.Product_ID = pb.Product_ID
INNER JOIN Brand brand ON brand.Brand_ID = pb.Brand_ID
WHERE prp.Point_Reward_ID = ?;

SELECT DISTINCT brand.Brand_ID brandId, brand.Brand_Name brandName, brand.Is_Corporation isCorporation
FROM Point_Reward_Brands prb
INNER JOIN Brand brand ON brand.Brand_ID = prb.Brand_ID
WHERE prb.Point_Reward_ID = ?;`;

    const result =
      (await this.internalConn.query(queryStr, [
        rewardId,
        ENUM_REWARD_TYPE.CONS,
        rewardId,
        rewardId,
        rewardId
      ])) ?? [];
    const [consSettingInfo, consSettingBrand, consSettingProduct, brands] =
      result;

    return {
      consSettingInfo,
      consSettingBrand,
      consSettingProduct,
      brands
    };
  }

  /**
   * 新增/編輯活動型積點設定
   * @param settingId 會籍版本編號
   * @param req
   * @param startDate 變 utc+0 的開始日
   * @param endDate 變 utc+0 的結束日
   * @returns
   */
  async addRewardSetting(
    rewardId: string,
    req: AddRewardSettingtDto,
    startDate: string,
    endDate: string
  ): Promise<Record<string, never>> {
    const _rewardType = this.escape(ENUM_REWARD_TYPE.REWARD);
    const _rewardId = this.escape(rewardId);
    const _rewardName = this.escape(req?.rewardName);
    const _channelId = this.escape(req?.channelId);
    const _startDate = this.escape(startDate);
    const _endDate = this.escape(endDate);
    const _handselPoint = this.escape(req?.handselPoint);
    const _activeStatus = this.escape(req?.activeStatus);
    const _activeDay = this.escape(req?.activeDay);
    const _remark = this.escape(req?.remark);
    const _authMemberId = this.escape(req?.iam?.authMemberId);

    let queryStr = /* sql */ `
-- 主表
INSERT INTO Point_Reward_Rules
(Point_Reward_ID, Reward_Name, Point_Reward_Type, Reward_Start_Date, Reward_End_Date, Active_Status, Active_Day, Remark, Create_ID, Alter_ID)
VALUES(${_rewardId}, ${_rewardName}, ${_rewardType}, ${_startDate}, ${_endDate}, ${_activeStatus}, ${_activeDay}, ${_remark}, ${_authMemberId}, ${_authMemberId})
ON DUPLICATE KEY UPDATE
Reward_Name = ${_rewardName}, Reward_Start_Date = ${_startDate}, Reward_End_Date = ${_endDate}, Active_Status = ${_activeStatus}, Active_Day = ${_activeDay}, Remark = ${_remark}, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};

-- 主表關聯渠道
INSERT INTO Point_Reward_Channel
(Point_Reward_ID, Channel_ID, Create_ID, Alter_ID)
VALUES(${_rewardId}, ${_channelId}, ${_authMemberId}, ${_authMemberId})
ON DUPLICATE KEY UPDATE
Channel_ID = ${_channelId}, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};

-- 主表關聯贈送積點
INSERT INTO Point_Reward_Setting
(Point_Reward_ID, Point_Ratio_Type, Handsel_Point, Create_ID, Alter_ID)
VALUES(${_rewardId}, ${_rewardType}, ${_handselPoint}, ${_authMemberId}, ${_authMemberId})
ON DUPLICATE KEY UPDATE
Handsel_Point = ${_handselPoint}, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};

-- 主表關聯會籍
DELETE FROM Point_Reward_Member_Ship WHERE Point_Reward_ID = ${_rewardId};
INSERT INTO Point_Reward_Member_Ship
(Point_Reward_ID, Member_Ship, Create_ID, Alter_ID)
VALUES
`;

    req?.memberShip?.forEach((member, idx) => {
      const _memberShip = this.escape(member);
      queryStr += `
(${_rewardId}, ${_memberShip}, ${_authMemberId}, ${_authMemberId})${
        idx === req?.memberShip?.length - 1 ? ';' : ','
      }
      `;
    });

    await this.internalConn.query(queryStr);

    return {};
  }

  /**
   * 活動型積點設定詳細資料
   * @param rewardId 活動編號
   */
  async getRewardSettingInfo(
    rewardId: string
  ): Promise<GetRewardSettingInfoResp[]> {
    const queryStr = /* sql */ `
SELECT  prr.Point_Reward_ID rewardId,
        prr.Reward_Name rewardName,
        prc.Channel_ID channelId,
        prr.Reward_Start_Date startDate,
        prr.Reward_End_Date endDate,
        prr.Active_Status activeStatus,
        prr.Active_Day activeDay,
        prs.Handsel_Point handselPoint,
        JSON_ARRAYAGG(prms.Member_Ship) memberShip,
        prr.Remark remark
FROM Point_Reward_Rules prr
INNER JOIN Point_Reward_Channel prc ON prc.Point_Reward_ID = prr.Point_Reward_ID
INNER JOIN Point_Reward_Setting prs ON prs.Point_Reward_ID = prr.Point_Reward_ID
INNER JOIN Point_Reward_Member_Ship prms ON prms.Point_Reward_ID = prr.Point_Reward_ID
WHERE prr.Point_Reward_ID = ? AND Point_Reward_Type = ?
GROUP BY prr.Point_Reward_ID,prc.Channel_ID,prs.Handsel_Point`;

    const result =
      (await this.internalConn.query(queryStr, [
        rewardId,
        ENUM_REWARD_TYPE.REWARD
      ])) ?? [];

    return result;
  }

  /**
   * 取得活動型送出去的點數
   * @param rewardId
   * @param tableNames
   */
  async getRewardSendPoint(
    rewardId: string,
    tableNames: string[]
  ): Promise<{ pointType: string; totalPoint: number }[]> {
    if (!tableNames?.length) return [];

    const _orderId = this.escape(rewardId);
    const unionClauses = tableNames
      .map(
        (tableName) =>
          `SELECT Point, Point_Type FROM ${tableName} WHERE Order_ID = ${_orderId}`
      )
      .join('\nUNION ALL\n');

    const queryStr = /* sql */ `
  -- 取得資料筆數
  SELECT Point_Type pointType, SUM(combinedLog.Point) totalPoint
  FROM (
     ${unionClauses}
  ) combinedLog
  GROUP BY combinedLog.Point_Type

  `;

    const result = (await this.internalConn.query(queryStr)) ?? [];

    return result;
  }

  /**
   * 積點調整列表
   */
  async getPointAdjustList(): Promise<GetPointAdjustListResp[]> {
    const queryStr = /* sql */ `
SELECT  pra.Adjust_ID adjustId,
        pra.Adjust_Name adjustName,
        pra.Adjust_Member_Type memberType,
        pra.Adjust_Point_Type adjustType,
        pra.Adjust_Point adjustPoint,
        DATE_FORMAT(pra.Adjust_Date, '%Y/%m/%d') adjustDate,
        pra.Create_Date createDate,
        IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = pra.Create_ID), 'system') createId,
        IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = pra.Alter_ID), 'system') modifyId,
        pra.Alter_Date modifyDate,
        pra.Is_Done isDone
FROM Point_Reward_Adjust pra
WHERE pra.Is_Active = 1
ORDER BY pra.Create_Date DESC`;

    const result = (await this.internalConn.query(queryStr)) ?? [];

    return result;
  }
  /**
   * 複製積點調整
   * @param adjustId 積點調整編號
   * @param newAdjustId 新積點調整編號
   * @returns
   */
  async copyPointAdjust(
    adjustId: string,
    newAdjustId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _adjustId = this.escape(adjustId);
    const _newAdjustId = this.escape(newAdjustId);
    const _authMemberId = this.escape(authMemberId);

    const queryStr = /* sql */ `
SET @name = (SELECT Adjust_Name FROM Point_Reward_Adjust WHERE Adjust_ID = ${_adjustId});
SET @number = (SELECT COUNT(1) FROM Point_Reward_Adjust WHERE Adjust_Name LIKE CONCAT(@name,'%') AND Is_Active = 1);
SET @copyNumber= IF(@number=1,'',@number-1);

INSERT INTO Point_Reward_Adjust
(Adjust_ID, Adjust_Name, Consume_Date, Adjust_Point_Type, Adjust_Data_Type, Adjust_Date, Adjust_Member_Type, Adjust_Point, File_Name, File_Data_Count,  Active_Status, Active_Day, Brand_ID, Store_ID, Remark, Create_ID, Alter_Date, Alter_ID)
SELECT ${_newAdjustId}, CONCAT(@name,'-複製',@copyNumber), Consume_Date, Adjust_Point_Type, Adjust_Data_Type, Adjust_Date, Adjust_Member_Type, Adjust_Point, File_Name, File_Data_Count, Active_Status, Active_Day, Brand_ID, Store_ID, Remark, ${_authMemberId}, CURRENT_TIMESTAMP, ${_authMemberId}
FROM Point_Reward_Adjust
WHERE Adjust_ID = ${_adjustId};

INSERT INTO Point_Reward_Adjust_Member
(Adjust_ID, Member_ID, Create_ID, Alter_Date, Alter_ID)
SELECT ${_newAdjustId}, Member_ID, ${_authMemberId}, CURRENT_TIMESTAMP, ${_authMemberId}
FROM Point_Reward_Adjust_Member
WHERE Adjust_ID = ${_adjustId};

INSERT INTO Files
(Relation_ID, Files_Type, Url, Create_ID, Alter_Date, Alter_ID)
SELECT ${_newAdjustId}, Files_Type, Url, ${_authMemberId}, CURRENT_TIMESTAMP, ${_authMemberId}
FROM Files
WHERE Relation_ID = ${_adjustId};
`;

    await this.internalConn.query(queryStr);

    return {};
  }

  /**
   * 取得積點調整執行時間
   * @param adjustdId 活動編號
   */
  async getAdjustDate(adjustdId: string): Promise<string> {
    const queryStr = /* sql */ `
SELECT Adjust_Date date
FROM Point_Reward_Adjust
WHERE Adjust_ID = ?`;

    const result =
      (await this.internalConn.query(queryStr, [adjustdId]))?.[0]?.date ?? null;

    return result;
  }

  /**
   * 刪除積點調整
   * @param adjustId 活動編號
   */
  async delPointAdjust(
    adjustId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const queryStr = /* sql */ `
UPDATE Point_Reward_Adjust
SET Is_Active = 0, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ?
WHERE Adjust_ID = ?`;

    await this.internalConn.query(queryStr, [authMemberId, adjustId]);

    return {};
  }

  /**
   * 取得檔案名稱
   * @param today 今日日期
   * @returns
   */
  async getFileCount(today: string): Promise<number> {
    const _today = this.escape(`${today}%`);

    const queryStr = /* sql */ `
SELECT COUNT(1) count FROM Point_Reward_Adjust
WHERE File_Name LIKE ${_today}`;

    const result =
      (await this.internalConn.query(queryStr))?.[0]?.count ?? null;

    return result;
  }

  /**
   * 新增/編輯積點調整
   * @param adjustId 積點調整編號
   * @param adjustDate 積點調整日期
   * @param req
   * @returns
   */
  async addPointAdjust(
    adjustId: string,
    adjustDate: string,
    req: AddPointAdjustDto
  ): Promise<Record<string, never>> {
    const _adjustId = this.escape(adjustId);
    const _adjustName = this.escape(req?.adjustName);
    const _adjustType = this.escape(req?.adjustType);
    const _consumeDate = this.escape(req?.consumeDate);
    const _dataType = this.escape(req?.dataType);
    const _adjustDate = this.escape(
      req?.adjustDate ? req?.adjustDate : adjustDate
    );
    const _memberType = this.escape(req?.memberType);
    const _mobileContryCode = this.escape(req?.mobileCountryCode);
    const _mobile = this.escape(removeFirstZero(req?.mobile));
    const _point = this.escape(req?.point);
    const _activeStatus = this.escape(req?.activeStatus);
    const _activeDay = this.escape(req?.activeDay);
    const _brandId = this.escape(req?.brandId);
    const _storeId = this.escape(req?.storeId);
    const _remark = this.escape(req?.remark);
    const _fileName = this.escape(req?.fileName);
    const _fileUrl = this.escape(req?.fileUrl);
    const _fileDataCount = this.escape(req?.fileDataCount);
    const _authMemberId = this.escape(req?.iam?.authMemberId);

    let queryStr = /* sql */ `
INSERT INTO Point_Reward_Adjust
(Adjust_ID, Adjust_Name, Consume_Date, Adjust_Point_Type, Adjust_Data_Type, Adjust_Date, Adjust_Member_Type, Adjust_Point, File_Name, File_Data_Count,Active_Status, Active_Day, Brand_ID, Store_ID, Remark, Create_ID, Alter_ID)
VALUES(${_adjustId}, ${_adjustName}, ${_consumeDate}, ${_adjustType}, ${_dataType}, ${_adjustDate}, ${_memberType}, ${_point}, ${_fileName}, ${_fileDataCount}, ${_activeStatus}, ${_activeDay}, ${_brandId}, ${_storeId}, ${_remark}, ${_authMemberId}, ${_authMemberId})
ON DUPLICATE KEY UPDATE
Adjust_Name = ${_adjustName}, Consume_Date = ${_consumeDate}, Adjust_Point_Type = ${_adjustType}, File_Name = ${_fileName}, File_Data_Count = ${_fileDataCount},
Adjust_Data_Type = ${_dataType}, Adjust_Date = ${_adjustDate}, Adjust_Member_Type = ${_memberType}, Adjust_Point = ${_point}, Active_Status = ${_activeStatus}, Active_Day = ${_activeDay},Brand_ID = ${_brandId}, Store_ID = ${_storeId}, Remark = ${_remark}, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};

`;

    if (req?.fileUrl) {
      queryStr += /* sql */ `

INSERT INTO Files
(Relation_ID, Files_Type, Url, Create_ID, Alter_ID)
VALUES(${_adjustId}, 'excel', ${_fileUrl}, ${_authMemberId}, ${_authMemberId})
ON DUPLICATE KEY UPDATE
Url = ${_fileUrl}, Alter_Date = CURRENT_TIMESTAMP, Alter_ID = ${_authMemberId};`;
    }

    if (req?.memberType === ENUM_ADJUST_MEMBER_TYPE.ASSIGN) {
      queryStr += /* sql */ `
DELETE FROM Point_Reward_Adjust_Member WHERE Adjust_ID = ${_adjustId};

SET @memberId = (SELECT Member_ID FROM IEat_Member WHERE Mobile_Country_Code = ${_mobileContryCode} AND Mobile = ${_mobile} AND Is_Active = 1);
INSERT INTO Point_Reward_Adjust_Member
(Adjust_ID, Member_ID, Create_ID, Alter_ID)
VALUES(${_adjustId}, @memberId, ${_authMemberId}, ${_authMemberId});`;
    }

    await this.internalConn.query(queryStr);

    return {};
  }

  /**
   * 積點調整詳細資訊
   * @param adjustId 積點調整編號
   */
  async getPointAdjustInfo(adjustId: string): Promise<GetPointAdjustInfoResp> {
    const queryStr = /* sql */ `
SELECT  pra.Adjust_ID adjustId,
        Adjust_Name adjustName,
        DATE_FORMAT(pra.Consume_Date, '%Y/%m/%d') consumeDate,
        Adjust_Point_Type adjustType,
        Adjust_Data_Type dataType,
        DATE_FORMAT(pra.Adjust_Date, '%Y/%m/%d') adjustDate,
        Adjust_Member_Type memberType,
        Adjust_Point point,
        f.Url fileUrl,
        member.Mobile_Country_Code mobileContryCode,
        member.Mobile mobile,
        member.Member_ID memberId,
        member.Member_Name name,
        File_Name fileName,
        File_Data_Count fileDataCount,
        Active_Status activeStatus,
        Active_Day activeDay,
        pra.Brand_ID brandId,
        pra.Store_ID storeId,
        pra.Is_Done isDone,
        Remark remark
FROM Point_Reward_Adjust pra
LEFT JOIN Files f ON f.Relation_ID = pra.Adjust_ID
LEFT JOIN Point_Reward_Adjust_Member pram ON pra.Adjust_ID = pram.Adjust_ID
LEFT JOIN IEat_Member member ON member.Member_ID = pram.Member_ID
WHERE pra.Adjust_ID = ?`;

    const result = (await this.internalConn.query(queryStr, [adjustId])) ?? [];

    return result?.[0];
  }
}
