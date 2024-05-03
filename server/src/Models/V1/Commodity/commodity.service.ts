import { HttpStatus, Injectable } from '@nestjs/common';

import configError from 'src/Config/error.message.config';
import { MetaDataCommon } from 'src/Definition/Dto';
import { COMMODITY_METHODS } from 'src/Definition/Enum/Commodity/commodity.status.enum';
import { COMMODITY_TYPE } from 'src/Definition/Enum/Commodity/commodity.type.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { BrandRepository } from '../Brand/brand.repository';
import { ChannelRepository } from '../Channel/channel.repository';
import { StoreRepository } from '../Store/store.repository';
import { AddCommodityDetailDto } from './Dto/add.commodity.detail.dto';
import {
  GetCommodityListDto,
  GetCommodityListResp
} from './Dto/get.commodity.list.dto';
import { AddProductComboReq } from './Interface/add.commodity.combo.interface';
import { AddProductComboReplaceableReq } from './Interface/add.commodity.combo.replaceable.interface';
import { AddProductDetailReq } from './Interface/add.commodity.detail.interface';
import { CommodityRepository } from './commodity.repository';

@Injectable()
export class CommodityService {
  constructor(
    private commodityRepository: CommodityRepository,
    private channelRepository: ChannelRepository,
    private brandRepository: BrandRepository,
    private storeRepository: StoreRepository,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得商品列表
   *
   * @param req
   * @returns
   */
  async getCommodityList(
    req: GetCommodityListDto
  ): Promise<GetCommodityListResp> {
    const commodityList = await this.commodityRepository.getCommodityList(req);

    const commodityCount = await this.commodityRepository.getCommodityListCount(
      req
    );

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: commodityCount,
      totalPage: Math.ceil(commodityCount / req?.perPage)
    } as MetaDataCommon;

    commodityList?.forEach((x) => (x.isComboSub = x.isComboSub ? true : false));

    const result = <GetCommodityListResp>{};
    result.metaData = metaData;
    result.commodityList = commodityList;

    return result;
  }

  /**
   * 新增商品資訊
   *
   * @param req
   * @returns
   */
  async addCommodityDetail(
    req: AddCommodityDetailDto
  ): Promise<Record<string, never>> {
    const channelDetail = await this.channelRepository.getChannelDetailByPwd(
      req?.channelPwd
    );

    const addCommodityDetail: AddProductDetailReq[] = [];
    const addCommodityCombo: AddProductComboReq[] = [];
    const addCommodityComboReplaceable: AddProductComboReplaceableReq[] = [];
    const connection = await this.internalConn.getConnection();
    switch (req?.methods) {
      case COMMODITY_METHODS.ADD:
        for (const commodity of req?.commodityDetail) {
          const commodityDetail =
            await this.commodityRepository.getCommodityDetail(
              commodity?.commodity_id,
              commodity?.brand_id
            );

          if (commodityDetail) {
            throw new CustomerException(configError._340003, HttpStatus.OK);
          }

          const brandDetail = await this.brandRepository.getBrandDetail(
            commodity?.brand_id
          );
          if (!brandDetail) {
            throw new CustomerException(configError._340004, HttpStatus.OK);
          }

          const storeDetail = await this.storeRepository.getStoreDetail(
            commodity?.store_id
          );
          if (!storeDetail || storeDetail?.brandId != commodity?.brand_id) {
            throw new CustomerException(configError._340005, HttpStatus.OK);
          }

          addCommodityDetail.push({
            brandId: commodity?.brand_id,
            productId: commodity?.commodity_id,
            productName: commodity?.commodity_name,
            productType: commodity?.commodity_type,
            productStatus: commodity?.status,
            channelId: channelDetail?.channelId
          });

          for (const combo of commodity?.combo) {
            // 子套餐商品主表
            addCommodityDetail.push({
              brandId: commodity?.brand_id,
              productId: combo?.commodity_id,
              productName: combo?.commodity_name,
              productType: COMMODITY_TYPE.COMBO_MEAL,
              productStatus: commodity?.status,
              channelId: channelDetail?.channelId
            });

            // 子套餐商品關聯
            addCommodityCombo.push({
              productId: combo?.commodity_id,
              comboProductId: commodity?.commodity_id
            });

            for (const replaceableProduct of combo?.replaceable_products) {
              // 可替換商品主表
              addCommodityDetail.push({
                brandId: commodity?.brand_id,
                productId: replaceableProduct?.commodity_id,
                productName: replaceableProduct?.commodity_name,
                productType: COMMODITY_TYPE.COMBO_MEAL,
                productStatus: commodity?.status,
                channelId: channelDetail?.channelId
              });

              // 可替換商品關聯
              addCommodityComboReplaceable.push({
                productId: combo?.commodity_id,
                replaceableProductId: replaceableProduct?.commodity_id
              });
            }
          }
        }

        try {
          await connection.beginTransaction();

          await this.commodityRepository.addCommodityDetail(
            connection,
            addCommodityDetail,
            req?.iam?.authMemberId
          );

          await this.commodityRepository.addCommodityBrand(
            connection,
            addCommodityDetail
          );

          if (addCommodityCombo?.length > 0) {
            await this.commodityRepository.addCommodityCombo(
              connection,
              addCommodityCombo
            );
          }

          if (addCommodityComboReplaceable?.length > 0) {
            await this.commodityRepository.addCommodityComboReplaceable(
              connection,
              addCommodityComboReplaceable
            );
          }

          await connection.commit();
        } catch (error) {
          await connection.rollback();
          throw new CustomerException(configError._340001, HttpStatus.OK);
        } finally {
          await connection.release();
        }
        break;
      case COMMODITY_METHODS.UPD:
        try {
          await connection.beginTransaction();
          for (const detail of req?.commodityDetail) {
            await this.commodityRepository.updCommodityDetail(
              connection,
              detail?.commodity_id,
              detail?.commodity_name,
              detail?.status
            );

            for (const combo of detail?.combo) {
              await this.commodityRepository.updCommodityDetail(
                connection,
                combo?.commodity_id,
                combo?.commodity_name,
                detail?.status
              );

              for (const replaceableProduct of combo?.replaceable_products) {
                await this.commodityRepository.updCommodityDetail(
                  connection,
                  replaceableProduct?.commodity_id,
                  replaceableProduct?.commodity_name,
                  detail?.status
                );
              }
            }
          }

          await connection.commit();
        } catch (error) {
          await connection.rollback();
          throw new CustomerException(configError._340002, HttpStatus.OK);
        } finally {
          await connection.release();
        }
        break;
    }

    return {};
  }
}
