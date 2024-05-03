import { HttpStatus, Injectable } from '@nestjs/common';
import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

import { MetaDataCommon } from 'src/Definition/Dto/common';
import {
  GetStoreListDto,
  GetStoreListResp,
  GetStoreMallMenuResp,
  UpdStoreDetailDto
} from 'src/Models/V1/Store/Dto';
import { StoreRepository } from './store.repository';

@Injectable()
export class StoreService {
  constructor(private storeRepository: StoreRepository) {}

  /**
   * 取得門市列表
   *
   * @param req
   * @returns
   */
  async getStoreList(req: GetStoreListDto): Promise<GetStoreListResp> {
    // 只要頁數其中一個參數未定義，就使用預設值
    if (!req?.page || !req?.perPage) {
      req.page = 1;
      req.perPage = 50;
    }

    // 取得門市列表
    const storeList = await this.storeRepository.getStoreList(req);

    // 取得門市總筆數
    const storeCount = await this.storeRepository.getStoreListCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: storeCount,
      totalPage: Math.ceil(storeCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetStoreListResp>{};
    result.metaData = metaData;
    result.storeList = storeList;

    return result;
  }

  /**
   * 修改門市資料
   *
   * @param req
   * @returns
   */
  async updStoreDetail(req: UpdStoreDetailDto): Promise<Record<string, never>> {
    // 取得門市詳細資料
    const storeDetail = await this.storeRepository.getStoreDetail(req?.storeId);

    // 查無此門市
    if (!storeDetail) {
      throw new CustomerException(configError._240001, HttpStatus.OK);
    }

    const storeDetailByPos = await this.storeRepository.getStoreDetailByPosCode(
      req?.posCode
    );

    // POS 代碼重複
    if (storeDetailByPos && storeDetail?.posCode != req?.posCode) {
      throw new CustomerException(configError._240002, HttpStatus.OK);
    }

    // 修改門市詳細資料
    await this.storeRepository.updStoreDetail(
      req?.brandId,
      req?.storeId,
      req?.mallName,
      req?.peopleCount,
      req?.posCode,
      req?.iam?.authMemberId,
      req?.cityCode,
      req?.zipCode
    );

    return {};
  }

  /**
   * 取得門市商場資料
   *
   * @returns
   */
  async getStoreMallMenuData(): Promise<GetStoreMallMenuResp> {
    const mallNames = await this.storeRepository.getStoreMallMenu();

    const result = <GetStoreMallMenuResp>{};
    result.mallNames = mallNames;

    return result;
  }
}
