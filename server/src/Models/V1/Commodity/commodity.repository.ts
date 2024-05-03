import { Injectable } from '@nestjs/common';

import { COMMODITY_STATUS } from 'src/Definition/Enum/Commodity/commodity.status.enum';
import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import {
  CommodityList,
  GetCommodityListDto
} from './Dto/get.commodity.list.dto';
import { AddProductComboReq } from './Interface/add.commodity.combo.interface';
import { AddProductComboReplaceableReq } from './Interface/add.commodity.combo.replaceable.interface';
import { AddProductDetailReq } from './Interface/add.commodity.detail.interface';
import { GetCommodityDetailResp } from './Interface/get.commodity.detail.interface';

@Injectable()
export class CommodityRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得商品資訊列表
   *
   * @param req
   * @returns
   */
  async getCommodityList(req: GetCommodityListDto): Promise<CommodityList[]> {
    const _brandId = this.internalConn.escape(req?.brandId);
    const _channelId = this.internalConn.escape(req?.channelId);
    const _commodityName = this.internalConn.escape(req?.commodityName);
    const _status = this.internalConn.escape(
      COMMODITY_STATUS[req?.status] ?? ''
    );
    const _commodityType = this.internalConn.escape(req?.commodityType);
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);

    let sqlStr = `
    SELECT DISTINCT
      c.Channel_Name as channelName,
      brand.Brand_Name as brandName,
      product.Product_ID as productId,
      product.Product_Name as productName,
      product.Product_Type as productType,
      product.Create_Date as createTime,
      product.Alter_Date as alterTime,
      IF(ISNULL(productCombo.Product_ID) AND ISNULL(pcr.Product_ID), false, true) as isComboSub
    FROM
      Product product
      LEFT JOIN Product_Brand pb ON product.Product_ID = pb.Product_ID AND pb.Is_Active = 1
      JOIN Brand brand ON pb.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
      JOIN Channel c ON product.Channel_ID = c.Channel_ID AND c.Is_Active = 1
      LEFT JOIN Product_Combo productCombo ON product.Product_ID = productCombo.Product_ID AND productCombo.Is_Active = 1
      LEFT JOIN Product_Combo_Replaceable pcr ON product.Product_ID = pcr.Replaceable_Product_ID AND pcr.Is_Active = 1
    WHERE product.Is_Active = 1
    `;

    if (req?.commodityName) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.COMMODITY_NAME:
          sqlStr += ` AND product.Product_Name = ${_commodityName}`;
          break;
      }
    }

    if (req?.brandId) {
      sqlStr += ` AND pb.Brand_ID = ${_brandId}`;
    }

    if (req?.channelId) {
      sqlStr += ` AND product.Channel_ID = ${_channelId}`;
    }

    if (req?.commodityType) {
      sqlStr += ` AND product.Product_Type = ${_commodityType}`;
    }

    if (req?.status) {
      sqlStr += ` AND product.Product_Status = ${_status}`;
    }

    switch (req?.comboSub) {
      case 1:
        sqlStr += ` AND product.Product_Type = 1`;
        sqlStr += ` AND (productCombo.Product_ID IS NOT NULL OR pcr.Product_ID IS NOT NULL)`;
        break;
      case 2:
        sqlStr += ` AND productCombo.Product_ID IS NULL`;
        sqlStr += ` AND pcr.Product_ID IS NULL`;
        break;
    }

    sqlStr += ` ORDER BY product.Create_Date DESC`;
    sqlStr += ` LIMIT ${_start}, ${_limit}`;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得商品資訊列表總筆數
   *
   * @param req
   * @returns
   */
  async getCommodityListCount(req: GetCommodityListDto): Promise<number> {
    const _brandId = this.internalConn.escape(req?.brandId);
    const _channelId = this.internalConn.escape(req?.channelId);
    const _commodityName = this.internalConn.escape(req?.commodityName);
    const _status = this.internalConn.escape(
      COMMODITY_STATUS[req?.status] ?? ''
    );
    const _commodityType = this.internalConn.escape(req?.commodityType);

    let sqlStr = `
    SELECT
      COUNT(product.Product_ID) as commodityCount
    FROM
      Product product
      LEFT JOIN Product_Brand pb ON product.Product_ID = pb.Product_ID AND pb.Is_Active = 1
      JOIN Brand brand ON pb.Brand_ID = brand.Brand_ID AND brand.Is_Active = 1
      JOIN Channel c ON product.Channel_ID = c.Channel_ID AND c.Is_Active = 1
      LEFT JOIN Product_Combo productCombo ON product.Product_ID = productCombo.Product_ID AND productCombo.Is_Active = 1
      LEFT JOIN Product_Combo_Replaceable pcr ON product.Product_ID = pcr.Replaceable_Product_ID AND pcr.Is_Active = 1
    WHERE product.Is_Active = 1
    `;

    if (req?.commodityName) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.COMMODITY_NAME:
          sqlStr += ` AND product.Product_Name = ${_commodityName}`;
          break;
      }
    }

    if (req?.brandId) {
      sqlStr += ` AND pb.Brand_ID = ${_brandId}`;
    }

    if (req?.channelId) {
      sqlStr += ` AND product.Channel_ID = ${_channelId}`;
    }

    if (req?.commodityType) {
      sqlStr += ` AND product.Product_Type = ${_commodityType}`;
    }

    if (req?.status) {
      sqlStr += ` AND product.Product_Status = ${_status}`;
    }

    switch (req?.comboSub) {
      case 1:
        sqlStr += ` AND product.Product_Type = 1`;
        sqlStr += ` AND (productCombo.Product_ID IS NOT NULL OR pcr.Product_ID IS NOT NULL)`;
        break;
      case 2:
        sqlStr += ` AND productCombo.Product_ID IS NULL`;
        sqlStr += ` AND pcr.Product_ID IS NULL`;
        break;
    }

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result?.[0]?.commodityCount;
  }

  /**
   * 取得多筆商品詳細資訊
   *
   * @param commodityId 商品編號
   * @param brandId 品牌編號
   * @returns
   */
  async getCommodityDetail(
    commodityId: string,
    brandId: string
  ): Promise<GetCommodityDetailResp> {
    const sqlStr = `
    SELECT
      Product_ID as productId,
      Brand_ID as brandId
    FROM Product_Brand
    WHERE Is_Active = 1
      AND Product_ID = ?
      AND Brand_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [
      commodityId,
      brandId
    ]);

    return result?.[0];
  }

  /**
   * 新增商品資料
   *
   * @param connection DB 連線
   * @param addCommodityDetail
   * @param authMemberId 後台人員編號
   * @returns
   */
  async addCommodityDetail(
    connection,
    addCommodityDetail: AddProductDetailReq[],
    authMemberId: string
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Product
    (Product_ID, Product_Name, Product_Type, Channel_ID, Product_Status, Create_ID, Alter_ID)
    VALUES
    `;
    let i = 0;
    const params = [];
    for (const detail of addCommodityDetail) {
      if (i >= 1) {
        sqlStr += `,`;
      }
      sqlStr += `(?, ?, ?, ?, ?, ?, ?)`;

      params.push(
        detail?.productId,
        detail?.productName,
        detail?.productType,
        detail?.channelId,
        detail?.productStatus,
        authMemberId,
        authMemberId
      );
      i++;
    }

    sqlStr += ` ON DUPLICATE KEY UPDATE Product_Status = VALUES(Product_Status)`;

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 新增商品品牌資料
   *
   * @param connection DB 連線
   * @param commodityDetail
   * @returns
   */
  async addCommodityBrand(
    connection,
    addCommodityDetail: AddProductDetailReq[]
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Product_Brand
    (Product_ID, Brand_ID, Create_ID, Alter_ID)
    VALUES
    `;
    let i = 0;
    const params = [];
    for (const detail of addCommodityDetail) {
      if (i >= 1) {
        sqlStr += `,`;
      }

      sqlStr += `(?, ?, ?, ?)`;
      params.push(detail?.productId, detail?.brandId, 'system', 'system');
      i++;
    }

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 新增商品套餐資料
   *
   * @param connection DB 連線
   * @param addCommodityCombo
   * @returns
   */
  async addCommodityCombo(
    connection,
    addCommodityCombo: AddProductComboReq[]
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Product_Combo
    (Product_ID, Combo_Product_ID, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    const params = [];
    for (const combo of addCommodityCombo) {
      if (i >= 1) {
        sqlStr += `,`;
      }
      sqlStr += `(?, ?, ?, ?)`;

      params.push(combo?.productId, combo?.comboProductId, 'system', 'system');
      i++;
    }

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 新增商品套餐可替換商品資料
   *
   * @param connection DB 連線
   * @param addCommodityComboReplaceable
   * @returns
   */
  async addCommodityComboReplaceable(
    connection,
    addCommodityComboReplaceable: AddProductComboReplaceableReq[]
  ): Promise<Record<string, never>> {
    let sqlStr = `
    INSERT INTO Product_Combo_Replaceable
    (Product_ID, Replaceable_Product_ID, Create_ID, Alter_ID)
    VALUES
    `;

    let i = 0;
    const params = [];
    for (const combo of addCommodityComboReplaceable) {
      if (i >= 1) {
        sqlStr += `,`;
      }
      sqlStr += `(?, ?, ?, ?)`;

      params.push(
        combo?.productId,
        combo?.replaceableProductId,
        'system',
        'system'
      );
      i++;
    }

    await this.internalConn.transactionQuery(connection, sqlStr, params);

    return {};
  }

  /**
   * 修改商品資料
   *
   * @param connection DB 連線
   * @param commodityId 商品編號
   * @param commodityName 商品名稱
   * @param status 商品狀態
   * @returns
   */
  async updCommodityDetail(
    connection,
    commodityId: string,
    commodityName: string,
    status: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Product SET
      Product_Name = ?,
      Product_Status = ?,
      Alter_ID = ?
    WHERE Product_ID = ?
      AND Is_Active = 1
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      commodityName,
      status,
      'system',
      commodityId
    ]);

    return {};
  }
}
