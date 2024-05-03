import { Injectable } from '@nestjs/common';
import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import {
  GetStoreListDto,
  StoreList
} from 'src/Models/V1/Store/Dto/get.store.list.dto';
import { GetStoreCountByBrandsResp } from 'src/Models/V1/Store/Interface/get.store.count.interface';
import { GetStoreDetailResp } from 'src/Models/V1/Store/Interface/get.store.detail.interface';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

@Injectable()
export class StoreRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得各品牌的門市數量
   *
   * @param brandId 品牌編號
   * @returns
   */
  async getStoreCountByBrands(
    brandId?: string
  ): Promise<GetStoreCountByBrandsResp[]> {
    const _brandId = this.internalConn.escape(brandId);

    let sqlStr = `
    SELECT
      Brand_ID as brandId,
      COUNT(Store_ID) as count
    FROM
      Store
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
   * 取得門市列表
   *
   * @param req
   * @returns
   */
  async getStoreList(req: GetStoreListDto): Promise<StoreList[]> {
    const _brandId = this.internalConn.escape(req?.brandId);
    const _cityCode = this.internalConn.escape(req?.cityCode);
    const _search = this.internalConn.escape(req?.search);
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);

    let sqlStr = `
    SELECT
      store.Brand_ID as brandId,
      store.Store_ID as storeId,
      brand.Brand_Name as brandName,
      store.Store_Name as storeName,
      store.Store_City as cityCode,
      Store_District as zipCode,
      store.Mall_Name as mallName,
      store.Pos_Store as posCode,
      store.Store_People as peopleCount,
      store.Create_Date as createTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = store.Create_ID), 'system') as createName,
      store.Alter_Date as alterTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = store.Alter_ID), 'system') as alterName,
      store.Store_Status as state
    FROM
      Store store
    JOIN Brand brand ON store.Brand_ID = brand.Brand_ID
    WHERE store.Is_Active = 1
    `;

    if (req?.brandId) {
      sqlStr += ` AND store.Brand_ID = ${_brandId}`;
    }

    if (req?.cityCode) {
      sqlStr += ` AND store.Store_City = ${_cityCode}`;
    }

    switch (req?.state) {
      case 1:
        sqlStr += ` AND store.Store_Status = 1`;
        break;
      case 2:
        sqlStr += ` AND store.Store_Status = 0`;
        break;
    }

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.BRAND_NAME:
          sqlStr += ` AND brand.Brand_Name = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.STORE_NAME:
          sqlStr += ` AND store.Store_Name = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.MALL_NAME:
          sqlStr += ` AND store.Mall_Name = ${_search}`;
          break;
      }
    }

    sqlStr += ` ORDER BY brand.Sort_Order, store.Store_City DESC`;
    sqlStr += ` LIMIT ${_start}, ${_limit}`;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得門市總筆數
   *
   * @param req
   * @returns
   */
  async getStoreListCount(req: GetStoreListDto): Promise<number> {
    const _brandId = this.internalConn.escape(req?.brandId);
    const _cityCode = this.internalConn.escape(req?.cityCode);
    const _search = this.internalConn.escape(req?.search);

    let sqlStr = `
    SELECT
      COUNT(Store_ID) as storeCount
    FROM
      Store store
    JOIN Brand brand ON store.Brand_ID = brand.Brand_ID
    WHERE store.Is_Active = 1
    `;

    if (req?.brandId) {
      sqlStr += ` AND store.Brand_ID = ${_brandId}`;
    }

    if (req?.cityCode) {
      sqlStr += ` AND store.Store_City = ${_cityCode}`;
    }

    switch (req?.state) {
      case 1:
        sqlStr += ` AND store.Store_Status = 1`;
        break;
      case 2:
        sqlStr += ` AND store.Store_Status = 0`;
        break;
    }

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.BRAND_NAME:
          sqlStr += ` AND brand.Brand_Name = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.STORE_NAME:
          sqlStr += ` AND store.Store_Name = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.MALL_NAME:
          sqlStr += ` AND store.Mall_Name = ${_search}`;
          break;
      }
    }

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result?.[0]?.storeCount;
  }

  /**
   * 取得門市詳細資料
   *
   * @param storeId 門市編號
   * @returns
   */
  async getStoreDetail(storeId: string): Promise<GetStoreDetailResp> {
    const sqlStr = `
    SELECT
      Brand_ID as brandId,
      Store_Name as storeName,
      Store_City as cityCode,
      Store_District as zipCode,
      Store_Status as state,
      Store_People as peopleCount,
      Mall_Name as mallName,
      Pos_Store as posCode,
      Create_Date as createTime,
      Alter_Date as alterTime
    FROM Store
    WHERE Store_ID = ?
      AND Is_Active = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [storeId])) ?? [];

    return result?.[0];
  }

  /**
   * 依照品牌編號取得門市資料
   *
   * @param brandId 品牌編號
   * @returns
   */
  async getStoreDetailByBrandId(
    brandId: string
  ): Promise<GetStoreDetailResp[]> {
    let sqlStr = `
    SELECT
      Store_ID as storeId,
      Brand_ID as brandId,
      Store_Name as storeName,
      Store_City as cityCode,
      Store_District as zipCode,
      Store_Status as state,
      Store_People as peopleCount,
      Mall_Name as mallName,
      Pos_Store as posCode,
      Create_Date as createTime,
      Alter_Date as alterTime
    FROM Store
    WHERE Is_Active = 1
    `;

    const params = [];
    if (brandId) {
      sqlStr += ` AND Brand_ID = ?`;
      params.push(brandId);
    }

    const result = await this.internalConn.query(sqlStr, params);

    return result;
  }

  /**
   * 依POS代碼取得門市詳細資料
   *
   * @param posCode POS代碼
   * @returns
   */
  async getStoreDetailByPosCode(posCode: string): Promise<GetStoreDetailResp> {
    const sqlStr = `
    SELECT
      Brand_ID as brandId,
      Store_Name as storeName,
      Store_City as cityCode,
      Store_District as zipCode,
      Store_Status as state,
      Store_People as peopleCount,
      Mall_Name as mallName,
      Pos_Store as posCode,
      Create_Date as createTime,
      Alter_Date as alterTime
    FROM
      Store
    WHERE Pos_Store = ?
    `;

    const result = (await this.internalConn.query(sqlStr, [posCode])) ?? [];

    return result?.[0];
  }

  /**
   * 取得門市商場菜單
   *
   * @returns
   */
  async getStoreMallMenu(): Promise<string[]> {
    const sqlStr = `
    SELECT
      DISTINCT Mall_Name as mallNames
    FROM
      Store
    WHERE Is_Active = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    const names = [];
    for (const val of result) {
      names.push(val?.mallNames);
    }

    return names;
  }

  /**
   * 修改門市詳細資料
   *
   * @param brandId 品牌編號
   * @param storeId 門市編號
   * @param mallName 商場名稱
   * @param peopleCount 門市人數
   * @param posCode POS代碼
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updStoreDetail(
    brandId: string,
    storeId: string,
    mallName: string,
    peopleCount: number,
    posCode: string,
    authMemberId: string,
    cityCode: string,
    zipCode: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Store SET
      Mall_Name = ?,
      Store_People = ?,
      Pos_Store = ?,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?,
      Store_City = ?,
      Store_District = ?
    WHERE Brand_ID = ?
      AND Store_ID = ?
    `;

    await this.internalConn.query(sqlStr, [
      mallName,
      peopleCount,
      posCode,
      authMemberId,
      cityCode,
      zipCode,
      brandId,
      storeId
    ]);

    return {};
  }
}
