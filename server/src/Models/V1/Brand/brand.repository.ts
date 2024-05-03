import { Injectable } from '@nestjs/common';
import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import { GetBrandDetailResp } from 'src/Models/V1/Brand/Interface/get.brand.data.interface';
import { GetBrandSettingListResp } from 'src/Models/V1/Brand/Interface/get.brand.list.interface';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import {
  BrandAndStoreList,
  GetBrandAndStoreListDto
} from './Dto/get.branch.and.store.list.dto';
import { GetBrandMapStoreListResp } from './Interface/get.brand.map.store.list.interface';

@Injectable()
export class BrandRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得品牌設定列表
   *
   * @returns
   */
  async getBrandSettingList(): Promise<GetBrandSettingListResp[]> {
    const sqlStr = `
    SELECT
      brand.Brand_ID as brandId,
      brand.Brand_Name as name,
      brand.Brand_Business_Group as businessGroup,
      brand.Brand_Status as state,
      brand.Is_Corporation as isCorporation,
      brand.Create_Date as createTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = brand.Create_ID), 'system') as createName,
      brand.Alter_Date as alterTime,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = brand.Alter_ID), 'system') as alterName
    FROM
      Brand brand
    WHERE brand.Is_Active = 1
    ORDER BY brand.Sort_Order ASC
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得品牌關聯門市列表
   *
   * @returns
   */
  async getBrandMapStoreMenu(): Promise<GetBrandMapStoreListResp[]> {
    const sqlStr = `
    SELECT
      brand.Brand_ID as brandId,
      brand.Brand_Name as brandName,
      brand.Is_Corporation as isCorporation,
      store.Store_ID as storeId,
      store.Store_Name as storeName
    FROM
      Brand brand
    LEFT JOIN Store store ON brand.Brand_ID = store.Brand_ID AND store.Is_Active = 1
    WHERE brand.Is_Active = 1
    ORDER BY brand.Sort_Order, store.Store_City, store.Store_District ASC
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得品牌詳細資料
   *
   * @param brandId 品牌編號
   * @returns
   */
  async getBrandDetail(brandId: string): Promise<GetBrandDetailResp> {
    const sqlStr = `
    SELECT
      Brand_Name as name,
      Is_Corporation as isCorporation,
      Brand_Status as state,
      Sort_Order as brandRank
    FROM
      Brand
    WHERE Is_Active = 1
      AND Brand_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [brandId]);

    return result?.[0];
  }

  /**
   * 依品牌名稱取得品牌詳細資料
   *
   * @param brandName 品牌名稱
   * @returns
   */
  async getBrandDetailByName(brandName: string): Promise<GetBrandDetailResp> {
    const sqlStr = `
    SELECT
      Brand_Name as name,
      Is_Corporation as isCorporation,
      Sort_Order as brandRank
    FROM
      Brand
    WHERE Is_Active = 1
      AND Brand_Name = ?
    `;

    const result = (await this.internalConn.query(sqlStr, [brandName])) ?? [];

    return result?.[0];
  }

  /**
   * 軟刪除品牌資料
   *
   * @param brandId 品牌編號
   * @param authMemberId 後台人員編號
   * @returns
   */
  async delBrandDetail(
    brandId: string,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
      UPDATE Brand SET
        Is_Active = 0,
        Alter_ID = ?
      WHERE Brand_ID = ?
    `;

    await this.internalConn.query(sqlStr, [authMemberId, brandId]);

    return {};
  }

  /**
   * 新增品牌詳細資料
   *
   * @param brandId 品牌編號
   * @param name 品牌名稱
   * @param businessGroup 事業部
   * @param state 狀態
   * @param authMemberId 後台人員編號
   * @returns
   */
  async insBrandDetail(
    brandId: string,
    name: string,
    businessGroup: string,
    state: boolean,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const _brandId = this.internalConn.escape(brandId);
    const _name = this.internalConn.escape(name);
    const _businessGroup = this.internalConn.escape(businessGroup);
    const _state = this.internalConn.escape(state);
    const _authMemberId = this.internalConn.escape(authMemberId);

    const sqlStr = `
    UPDATE Brand SET Sort_Order = Sort_Order + 1 WHERE Sort_Order > 0;

    INSERT INTO Brand (Brand_ID, Brand_Name, Brand_Business_Group, Brand_Status, Sort_Order, Create_ID, Alter_ID)
    VALUES
    (${_brandId}, ${_name}, ${_businessGroup}, ${_state}, 1, ${_authMemberId}, ${_authMemberId})
    `;

    await this.internalConn.query(sqlStr, []);

    return {};
  }

  /**
   * 修改品牌詳細資料
   *
   * @param brandId 舊的品牌編號
   * @param code 品牌編號
   * @param name 品牌名稱
   * @param businessGroup 事業部
   * @param state 狀態
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updBrandDetail(
    brandId: string,
    code: string,
    name: string,
    businessGroup: string,
    state: boolean,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Brand SET
      Brand_ID = ?,
      Brand_Name = ?,
      Brand_Business_Group = ?,
      Brand_Status = ?,
      Alter_ID = ?
    WHERE Brand_ID = ?
    `;

    await this.internalConn.query(sqlStr, [
      code,
      name,
      businessGroup,
      state,
      authMemberId,
      brandId
    ]);

    return {};
  }

  /**
   * 修改品牌順序
   *
   * @param connection DB 連線
   * @param brandId 品牌編號
   * @param rank 順序
   * @param authMemberId 後台人員編號
   * @returns
   */
  async updBrandRank(
    connection,
    brandId: string,
    rank: number,
    authMemberId: string
  ): Promise<Record<string, never>> {
    const sqlStr = `
    UPDATE Brand SET
      Sort_Order = ?,
      Alter_Date = CURRENT_TIMESTAMP,
      Alter_ID = ?
    WHERE Brand_ID = ?
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      rank,
      authMemberId,
      brandId
    ]);

    return {};
  }

  /**
   * 取得品牌與門市列表
   *
   * @param req
   * @returns
   */
  async getBrandAndStoreList(
    req: GetBrandAndStoreListDto
  ): Promise<BrandAndStoreList[]> {
    const _search = this.internalConn.escape(req?.search);
    const _brandIds = this.internalConn.escape(req?.brandIds);
    const _mallName = this.internalConn.escape(req?.mallName);
    const _cityCode = this.internalConn.escape(req?.cityCode);
    const _zipCode = this.internalConn.escape(req?.zipCode);
    const _excludeStoreIds = this.internalConn.escape(req?.excludeStoreIds);
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);

    let sqlStr = `
    SELECT
      brand.Brand_ID as brandId,
      brand.Brand_Name as brandName,
      store.Store_Name as storeName,
      store.Store_City as cityCode,
      store.Store_District as zipCode,
      store.Mall_Name as mallName,
      store.Store_ID as storeId,
      store.Pos_Store as posStore
    FROM
      Brand brand
      JOIN Store store ON brand.Brand_ID = store.Brand_ID AND store.Is_Active = 1
    WHERE brand.Is_Active = 1
    `;

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.POS_STORE:
          sqlStr += ` AND store.Pos_Store = ${_search}`;
          break;
      }
    }

    if (req?.brandIds?.length > 0) {
      sqlStr += ` AND brand.Brand_ID IN (${_brandIds})`;
    }

    if (req?.mallName) {
      sqlStr += ` AND store.Mall_Name = ${_mallName}`;
    }

    if (req?.cityCode) {
      sqlStr += ` AND store.Store_City = ${_cityCode}`;
    }

    if (req?.zipCode) {
      sqlStr += ` AND store.Store_District = ${_zipCode}`;
    }

    if (req?.excludeStoreIds && req?.excludeStoreIds?.length > 0) {
      sqlStr += ` AND store.Store_ID NOT IN (${_excludeStoreIds})`;
    }

    sqlStr += ` ORDER BY brand.Sort_Order, store.Store_District DESC`;
    sqlStr += ` LIMIT ${_start}, ${_limit}`;

    const result = await this.internalConn.query(sqlStr, []);

    return result;
  }

  /**
   * 取得品牌與門市列表總筆數
   *
   * @param req
   * @returns
   */
  async getBrandAndStoreListCount(
    req: GetBrandAndStoreListDto
  ): Promise<number> {
    const _search = this.internalConn.escape(req?.search);
    const _brandIds = this.internalConn.escape(req?.brandIds);
    const _mallName = this.internalConn.escape(req?.mallName);
    const _cityCode = this.internalConn.escape(req?.cityCode);
    const _zipCode = this.internalConn.escape(req?.zipCode);
    const _excludeStoreIds = this.internalConn.escape(req?.excludeStoreIds);

    let sqlStr = `
    SELECT
      COUNT(*) as storeCount
    FROM
      Brand brand
      JOIN Store store ON brand.Brand_ID = store.Brand_ID AND store.Is_Active = 1
    WHERE brand.Is_Active = 1
    `;

    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.POS_STORE:
          sqlStr += ` AND store.Pos_Store = ${_search}`;
          break;
      }
    }

    if (req?.brandIds?.length > 0) {
      sqlStr += ` AND brand.Brand_ID IN (${_brandIds})`;
    }

    if (req?.mallName) {
      sqlStr += ` AND store.Mall_Name = ${_mallName}`;
    }

    if (req?.cityCode) {
      sqlStr += ` AND store.Store_City = ${_cityCode}`;
    }

    if (req?.zipCode) {
      sqlStr += ` AND store.Store_District = ${_zipCode}`;
    }

    if (req?.excludeStoreIds && req?.excludeStoreIds?.length > 0) {
      sqlStr += ` AND store.Store_ID NOT IN (${_excludeStoreIds})`;
    }

    const result = await this.internalConn.query(sqlStr, []);

    return result?.[0]?.storeCount;
  }
}
