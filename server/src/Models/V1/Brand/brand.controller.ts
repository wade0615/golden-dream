import { Body, Controller, Get, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';

import {
  DelBrandDetailDto,
  GetBrandListResp,
  GetBrandMenuResp,
  UpdBrandDetailDto,
  UpdBrandRankDto
} from 'src/Models/V1/Brand/Dto';
import {
  GetBrandAndStoreListDto,
  GetBrandAndStoreListResp
} from './Dto/get.branch.and.store.list.dto';
import { GetBrandMapStoreMenuResp } from './Dto/get.brand.map.store.menu.dto';
import { BrandService } from './brand.service';

@ApiTags('brand')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'brand'
})
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  /**
   * 品牌設定列表
   *
   * @returns
   */
  @Post(apiPath.brand.getBrandList)
  @ApiOperation({
    summary: '取得品牌列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回品牌列表.',
    type: GetBrandListResp
  })
  async getBrandList(): Promise<GetBrandListResp[]> {
    const result = await this.brandService.getBrandList();

    return result;
  }

  /**
   * 取得品牌菜單
   *
   * @returns
   */
  @Get(apiPath.brand.getBrandMenu)
  @ApiOperation({
    summary: '取得品牌下拉式選單'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回品牌下拉式選單',
    type: [GetBrandMenuResp]
  })
  async getBrandMenu(): Promise<GetBrandMenuResp[]> {
    const result = await this.brandService.getBrandMenu();

    return result;
  }

  /**
   * 取得品牌與門市的下拉式選單
   *
   * @returns
   */
  @Get(apiPath.brand.getBrandMapStoreMenu)
  @ApiOperation({
    summary: '取得品牌與門市的下拉式選單'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回品牌與門市關聯的下拉式選單.',
    type: [GetBrandMapStoreMenuResp]
  })
  async getBrandMapStoreMenu(): Promise<GetBrandMapStoreMenuResp[]> {
    const result = await this.brandService.getBrandMapStoreMenu();

    return result;
  }

  /**
   * 品牌門市刪除(軟刪)
   *
   * @param body
   * @returns
   */
  @Post(apiPath.brand.delBrandDetail)
  @ApiOperation({
    summary: '刪除品牌資料'
  })
  async delBrandDetail(
    @Body() body: DelBrandDetailDto
  ): Promise<Record<string, never>> {
    await this.brandService.delBrandDetail(body);

    return {};
  }

  /**
   * 品牌門市儲存
   *
   * @param body
   * @returns
   */
  @Post(apiPath.brand.updBrandDetail)
  @ApiOperation({
    summary: '更新品牌資料'
  })
  async updBrandDetail(
    @Body() body: UpdBrandDetailDto
  ): Promise<Record<string, never>> {
    await this.brandService.updBrandDetail(body);

    return {};
  }

  /**
   * 修改品牌排序
   *
   * @param body
   * @returns
   */
  @Post(apiPath.brand.updBrandSort)
  @ApiOperation({
    summary: '修改品牌順序'
  })
  async updBrandSort(
    @Body() body: UpdBrandRankDto
  ): Promise<Record<string, never>> {
    await this.brandService.updBrandSort(body);

    return {};
  }

  /**
   * 取得品牌與門市列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.brand.getBrandAndStoreList)
  @ApiOperation({
    summary: '取得品牌與門市列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回品牌與門市列表.',
    type: GetBrandAndStoreListResp
  })
  async getBrandAndStoreList(
    @Body() body: GetBrandAndStoreListDto
  ): Promise<GetBrandAndStoreListResp> {
    const result = await this.brandService.getBrandAndStoreList(body);

    return result;
  }
}
