import { HttpStatus, Injectable } from '@nestjs/common';
import configError from 'src/Config/error.message.config';
import { MenuIdCommon, MetaDataCommon } from 'src/Definition/Dto';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import {
  DelBrandDetailDto,
  GetBrandListResp,
  GetBrandMenuResp,
  UpdBrandDetailDto,
  UpdBrandRankDto
} from 'src/Models/V1/Brand/Dto';
import { ChannelRepository } from 'src/Models/V1/Channel/channel.repository';
import { StoreRepository } from 'src/Models/V1/Store/store.repository';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import {
  GetBrandAndStoreListDto,
  GetBrandAndStoreListResp
} from './Dto/get.branch.and.store.list.dto';
import { GetBrandMapStoreMenuResp } from './Dto/get.brand.map.store.menu.dto';
import { BrandRepository } from './brand.repository';

@Injectable()
export class BrandService {
  constructor(
    private brandRepository: BrandRepository,
    private storeRepository: StoreRepository,
    private channelRepository: ChannelRepository,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得品牌列表
   *
   * @returns
   */
  async getBrandList(): Promise<GetBrandListResp[]> {
    // 取得品牌設定列表
    const brandList = await this.brandRepository.getBrandSettingList();

    // 取得品牌底下門市數量
    const storeCountData = await this.storeRepository.getStoreCountByBrands();

    let corporationStoreCount = 0;
    const storeCount =
      storeCountData?.reduce((acc, store) => {
        acc[`${store.brandId}`] = store.count;
        corporationStoreCount += store.count;
        return acc;
      }, {}) ?? {};

    // 取得品牌底下渠道數量
    const channelCountData =
      await this.channelRepository.getChannelCountByBrands();
    const channelCount =
      channelCountData?.reduce((acc, channel) => {
        acc[`${channel.brandId}`] = channel.count;
        return acc;
      }, {}) ?? {};

    const result = [] as GetBrandListResp[];
    brandList.forEach((value) => {
      result.push({
        brandId: value.brandId,
        name: value.name,
        businessGroup: value.businessGroup,
        isCorporation: value.isCorporation ? true : false,
        state: value.state ? true : false,
        storeCount: value.isCorporation
          ? corporationStoreCount
          : storeCount[value.brandId] ?? 0,
        channelCount: channelCount[value.brandId] ?? 0,
        createName: value.createName,
        createTime: value.createTime,
        alterName: value.alterName,
        alterTime: value.alterTime
      });
    });

    return result;
  }

  /**
   * 取得品牌菜單
   *
   * @returns
   */
  async getBrandMenu(): Promise<GetBrandMenuResp[]> {
    // 取得品牌設定列表
    const brandList = await this.brandRepository.getBrandSettingList();

    const result = [] as GetBrandMenuResp[];
    brandList?.map((brand) => {
      if (brand.state) {
        result.push({
          brandId: brand.brandId,
          brandName: brand.name,
          isCorporation: brand.isCorporation
        });
      }
    });

    return result;
  }

  /**
   * 取得品牌關聯的門市下拉式選單
   *
   * @returns
   */
  async getBrandMapStoreMenu(): Promise<GetBrandMapStoreMenuResp[]> {
    const brandMapStoreMenu = await this.brandRepository.getBrandMapStoreMenu();

    const brandDetail = {};
    brandMapStoreMenu?.map((list) => {
      if (!brandDetail[list.brandId]) {
        brandDetail[list.brandId] = {
          brandName: '',
          stores: []
        };
      }

      brandDetail[list.brandId].brandName = list.brandName;
      brandDetail[list.brandId].isCorporation = list.isCorporation;

      if (list.storeId) {
        brandDetail[list.brandId].stores.push(<MenuIdCommon>{
          id: list.storeId,
          name: list.storeName
        });
      }
    });

    const result = [] as GetBrandMapStoreMenuResp[];
    for (const detail in brandDetail) {
      result.push({
        brandId: detail,
        brandName: brandDetail[detail]?.brandName,
        isCorporation: brandDetail[detail]?.isCorporation,
        stores: brandDetail[detail]?.stores
      });
    }

    return result;
  }

  /**
   * 刪除品牌資料
   *
   * @param req
   * @returns
   */
  async delBrandDetail(req: DelBrandDetailDto): Promise<Record<string, never>> {
    const brandId = req?.brandId;
    // 取得 門市資料
    const brandDetail = await this.brandRepository.getBrandDetail(brandId);

    if (!brandDetail) {
      throw new CustomerException(configError._230001, HttpStatus.OK);
    }

    // 取得品牌底下門市數量
    const storeCountData = await this.storeRepository.getStoreCountByBrands(
      brandId
    );

    // 取得品牌底下渠道數量
    const channelCountData =
      await this.channelRepository.getChannelCountByBrands(brandId);

    // 當門市數量或渠道數量 >= 1，不可刪除
    if (storeCountData[0]?.count >= 1 || channelCountData[0]?.count >= 1) {
      throw new CustomerException(configError._230002, HttpStatus.OK);
    }

    // 當設定為集團，不可刪除
    if (brandDetail.isCorporation) {
      throw new CustomerException(configError._230003, HttpStatus.OK);
    }

    // 軟刪除 資料
    await this.brandRepository.delBrandDetail(brandId, req?.iam?.authMemberId);

    return {};
  }

  /**
   * 修改品牌資料
   *
   * @param req
   * @returns
   */
  async updBrandDetail(req: UpdBrandDetailDto): Promise<Record<string, never>> {
    // 有帶入更新ID
    if (req?.brandId) {
      // 取得品牌資料
      const brandDetail = await this.brandRepository.getBrandDetail(
        req?.brandId
      );

      // 品牌資料不存在
      if (!brandDetail) {
        throw new CustomerException(configError._230001, HttpStatus.OK);
      }

      // 有更新商品名稱
      if (req?.name != brandDetail?.name) {
        // 查詢欲修改品牌名稱的品牌資料
        const updBrandNameDetail =
          await this.brandRepository.getBrandDetailByName(req?.name);

        // 欲更新的品牌名稱已存在
        if (updBrandNameDetail) {
          throw new CustomerException(configError._230006, HttpStatus.OK);
        }
      }

      // 有更新商品代碼
      if (req?.code != req?.brandId) {
        // 查詢欲修改品牌代碼的品牌資料
        const updBrandDetail = await this.brandRepository.getBrandDetail(
          req?.code
        );

        // 欲更新的品牌代碼已存在
        if (updBrandDetail) {
          throw new CustomerException(configError._230005, HttpStatus.OK);
        }

        // 取得品牌底下門市數量
        const storeCountData = await this.storeRepository.getStoreCountByBrands(
          req?.brandId
        );

        // 取得品牌底下渠道數量
        const channelCountData =
          await this.channelRepository.getChannelCountByBrands(req?.brandId);

        // 當門市數量或渠道數量 >= 1，不可修改品牌代碼
        if (storeCountData[0]?.count >= 1 || channelCountData[0]?.count >= 1) {
          throw new CustomerException(configError._230007, HttpStatus.OK);
        }
      }

      // 更新品牌資料
      await this.brandRepository.updBrandDetail(
        req?.brandId,
        req?.code,
        req?.name,
        req?.businessGroup,
        req?.state,
        req?.iam?.authMemberId
      );

      return {};
    }

    // 新增品牌資料
    await this.brandRepository.insBrandDetail(
      req?.code,
      req?.name,
      req?.businessGroup,
      req?.state,
      req?.iam?.authMemberId
    );

    return {};
  }

  /**
   * 修改品牌設定排序
   *
   * @param req
   * @returns
   */
  async updBrandSort(req: UpdBrandRankDto): Promise<Record<string, never>> {
    // 無異動
    if (req?.brandSorts.length == 0) {
      throw new CustomerException(configError._200007, HttpStatus.OK);
    }

    const brandList = await this.brandRepository.getBrandSettingList();

    // 判斷修改排序的數量是否為全部
    if (brandList?.length != req?.brandSorts.length) {
      // TODO ELK LOG 待補
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }

    const brandDetail = await this.brandRepository.getBrandDetail(
      req?.brandSorts[0]
    );

    if (!brandDetail) {
      throw new CustomerException(configError._230001, HttpStatus.OK);
    }

    // 第一個必須為集團
    if (!brandDetail?.isCorporation) {
      throw new CustomerException(configError._230004, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 批次更新品牌順序
      let rank = 0;
      for (const brandId of req?.brandSorts) {
        await this.brandRepository.updBrandRank(
          connection,
          brandId,
          rank,
          req?.iam?.authMemberId
        );
        rank++;
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._230008, HttpStatus.OK);
    } finally {
      await connection.release();
    }

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
  ): Promise<GetBrandAndStoreListResp> {
    const list = await this.brandRepository.getBrandAndStoreList(req);

    const storeCount = await this.brandRepository.getBrandAndStoreListCount(
      req
    );

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: storeCount,
      totalPage: Math.ceil(storeCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetBrandAndStoreListResp>{};
    result.metaData = metaData;
    result.brandAndStoreList = list;

    return result;
  }
}
