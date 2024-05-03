import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  VERSION_NEUTRAL
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import apiPath from 'src/Center/api.path';
import { GlobalDTOValidationPipe } from 'src/Global/Pipes/global.dto.validation.pipe';
import {
  GetStoreListDto,
  GetStoreListResp,
  GetStoreMallMenuResp,
  UpdStoreDetailDto
} from 'src/Models/V1/Store/Dto';
import { StoreService } from './store.service';

@ApiTags('store')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'store'
})
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * 取得門市列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.store.getStoreList)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: '取得門市列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回門市列表.',
    type: GetStoreListResp
  })
  async getStoreList(@Body() body: GetStoreListDto): Promise<GetStoreListResp> {
    const result = await this.storeService.getStoreList(body);

    return result;
  }

  /**
   * 修改門市資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.store.updStoreDetail)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: '修改門市詳細資料'
  })
  async updStoreDetail(
    @Body() body: UpdStoreDetailDto
  ): Promise<Record<string, never>> {
    await this.storeService.updStoreDetail(body);

    return {};
  }

  /**
   * 取得門市商場菜單
   *
   * @returns
   */
  @Get(apiPath.store.getStoreMallMenu)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: '取得門市商場下拉式選單'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回門市商場下拉式選單.',
    type: GetStoreMallMenuResp
  })
  async getStoreMallMenu(): Promise<GetStoreMallMenuResp> {
    const result = await this.storeService.getStoreMallMenuData();

    return result;
  }
}
