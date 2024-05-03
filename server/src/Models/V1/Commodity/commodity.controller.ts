import { Body, Controller, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';
import { AddCommodityDetailDto } from './Dto/add.commodity.detail.dto';
import {
  GetCommodityListDto,
  GetCommodityListResp
} from './Dto/get.commodity.list.dto';
import { CommodityService } from './commodity.service';

@ApiTags('commodity')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'commodity'
})
export class CommodityController {
  constructor(private readonly commodityService: CommodityService) {}

  /**
   * 取得商品列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.commodity.getCommodityList)
  @ApiOperation({
    summary: '取得商品資訊列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回商品資訊列表.',
    type: GetCommodityListResp
  })
  async getCommodityList(
    @Body() body: GetCommodityListDto
  ): Promise<GetCommodityListResp> {
    const result = await this.commodityService.getCommodityList(body);

    return result;
  }

  /**
   * 新增商品列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.commodity.addCommodityDetail)
  async addCommodityDetail(
    @Body() body: AddCommodityDetailDto
  ): Promise<Record<string, never>> {
    await this.commodityService.addCommodityDetail(body);

    return {};
  }
}
