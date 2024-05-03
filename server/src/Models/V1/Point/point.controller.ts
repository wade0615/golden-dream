import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  VERSION_NEUTRAL
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import apiPath from 'src/Center/api.path';
import { GetMemberListResp } from '../Member/Dto';
import { AddConsSettingtDto } from './Dto/add.cons.setting.dto';
import { AddPointAdjustDto } from './Dto/add.point.adjust.dto';
import { AddRewardSettingtDto } from './Dto/add.reward.setting.dto';
import { AdjustIdDto } from './Dto/adjust.id.dto';
import { DownloadMemberPointExampleResp } from './Dto/download.member.special.type.example.dto';
import {
  GetPointSendingListDto,
  GetPointSendingListResp
} from './Dto/get.point.sending.list.dto';
import {
  GetProductListDto,
  GetProductListResp
} from './Dto/get.product.list.dto';
import { RewardIdDto } from './Dto/reward.id.dto';
import { UpdateBasicSettingDto } from './Dto/update.basic.setting.dto';
import { UploadMemberPointResp } from './Dto/upload.member.point.dto';
import { GetBasicSettingInfoResp } from './Interface/get.basic.setting.info.interface';
import { GetConsSettingInfoResp } from './Interface/get.cons.setting.info.interface';
import { GetConsSettingParameterResp } from './Interface/get.cons.setting.parameter.interface';
import { GetPointAdjustInfoResp } from './Interface/get.point.adjust.info.interface';
import { GetPointAdjustListResp } from './Interface/get.point.adjust.list.interface';
import { GetPointSendingFilterOptionsResp } from './Interface/get.point.sending.filter.options.interface';
import { GetRewardSettingInfoResp } from './Interface/get.reward.setting.info.interface';
import { PointService } from './point.service';
@ApiTags('point')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'point'
})
export class PointController {
  constructor(private readonly pointService: PointService) {}

  /**
   * 取得基本設定詳細資訊
   * @returns
   */
  @Get(apiPath.point.getBasicSettingInfo)
  @ApiOperation({
    summary: '取得基本設定詳細資訊'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得基本設定詳細資訊',
    type: GetMemberListResp
  })
  async getBasicSettingInfo(): Promise<GetBasicSettingInfoResp> {
    const result = await this.pointService.getBasicSettingInfo();

    return result;
  }

  /**
   * 編輯基本設定
   * @returns
   */
  @Patch(apiPath.point.updateBasicSetting)
  @ApiOperation({
    summary: '編輯基本設定'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '編輯基本設定',
    type: Object
  })
  async updateBasicSetting(
    @Body() body: UpdateBasicSettingDto
  ): Promise<Record<string, never>> {
    const result = await this.pointService.updateBasicSetting(body);

    return result;
  }

  /**
   * 積點發放規則列表
   * @param body
   * @returns
   */
  @Post(apiPath.point.getPointSendingList)
  @ApiOperation({
    summary: '積點發放規則列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '積點發放規則列表',
    type: GetPointSendingListResp
  })
  async getPointSendingList(
    @Body() body: GetPointSendingListDto
  ): Promise<GetPointSendingListResp> {
    const result = await this.pointService.getPointSendingList(body);

    return result;
  }

  /**
   * 積點發放規則篩選資料
   * @param body
   * @returns
   */
  @Get(apiPath.point.getPointSendingFilterOptions)
  @ApiOperation({
    summary: '積點發放規則篩選資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '積點發放規則篩選資料',
    type: GetPointSendingFilterOptionsResp
  })
  async getPointSendingFilterOptions(): Promise<GetPointSendingFilterOptionsResp> {
    const result = await this.pointService.getPointSendingFilterOptions();

    return result;
  }

  /**
   * 複製發放規則
   * @param body
   * @returns
   */
  @Post(apiPath.point.copyPointSending)
  @ApiOperation({
    summary: '複製發放規則'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '複製發放規則'
  })
  async copyPointSending(
    @Body() body: RewardIdDto
  ): Promise<Record<string, never>> {
    const { rewardId } = body;
    const result = await this.pointService.copyPointSending(rewardId);

    return result;
  }

  /**
   * 停用發放規則
   * @param body
   * @returns
   */
  @Patch(apiPath.point.stopPointSending)
  @ApiOperation({
    summary: '停用發放規則'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '停用發放規則'
  })
  async stopPointSending(
    @Body() body: RewardIdDto
  ): Promise<Record<string, never>> {
    const { rewardId, iam } = body;
    const { authMemberId } = iam;
    const result = await this.pointService.stopPointSending(
      rewardId,
      authMemberId
    );

    return result;
  }

  /**
   * 新增/編輯消費型積點設定
   * @param body
   * @returns
   */
  @Post(apiPath.point.addConsSetting)
  @ApiOperation({
    summary: '新增/編輯消費型積點設定'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '新增/編輯消費型積點設定'
  })
  async addConsSetting(
    @Body() body: AddConsSettingtDto
  ): Promise<Record<string, never>> {
    const result = await this.pointService.addConsSetting(body);

    return result;
  }

  /**
   * 消費型積點設定所需參數
   * @param body
   * @returns
   */
  @Get(apiPath.point.getConsSettingParameter)
  @ApiOperation({
    summary: '消費型積點設定所需參數'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '消費型積點設定所需參數',
    type: GetConsSettingParameterResp
  })
  async getConsSettingParameter(): Promise<GetConsSettingParameterResp> {
    const result = await this.pointService.getConsSettingParameter();

    return result;
  }

  /**
   * 消費型積點設定詳細資料
   * @param body
   * @returns
   */
  @Post(apiPath.point.getConsSettingInfo)
  @ApiOperation({
    summary: '消費型積點設定詳細資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '消費型積點設定詳細資料'
  })
  async getConsSettingInfo(
    @Body() body: RewardIdDto
  ): Promise<GetConsSettingInfoResp> {
    const { rewardId } = body;
    const result = await this.pointService.getConsSettingInfo(rewardId);

    return result;
  }

  // /**
  //  * 取得品牌門市列表
  //  * @param body
  //  * @returns
  //  */
  // @Post(apiPath.point.getStoreList)
  // @ApiOperation({
  //   summary: '取得品牌門市列表'
  // })
  // @ApiCreatedResponse({
  //   status: 200,
  //   description: '取得品牌門市列表',
  //   type: GetStoreListResp
  // })
  // async getStoreList(@Body() body: GetStoreListDto): Promise<GetStoreListResp> {
  //   const result = await this.pointService.getStoreList(body);

  //   return result;
  // }

  // /**
  //  * 門市列表篩選資料
  //  * @param body
  //  * @returns
  //  */
  // @Get(apiPath.point.getStoreFilterOptions)
  // @ApiOperation({
  //   summary: '門市列表篩選資料'
  // })
  // @ApiCreatedResponse({
  //   status: 200,
  //   description: '門市列表篩選資料',
  //   type: GetStoreFilterOptionResp
  // })
  // async getStoreFilterOptions(): Promise<GetStoreFilterOptionResp> {
  //   const result = await this.pointService.getStoreFilterOptions();

  //   return result;
  // }

  /**
   * 取得商品列表
   * @param body
   * @returns
   */
  @Post(apiPath.point.getProductList)
  @ApiOperation({
    summary: '取得商品門市列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得商品門市列表',
    type: GetProductListResp
  })
  async getProductList(
    @Body() body: GetProductListDto
  ): Promise<GetProductListResp> {
    const result = await this.pointService.getProductList(body);

    return result;
  }

  /**
   * 新增/編輯活動型積點設定
   * @param body
   * @returns
   */
  @Post(apiPath.point.addRewardSetting)
  @ApiOperation({
    summary: '新增/編輯活動型積點設定'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '新增/編輯活動型積點設定'
  })
  async addRewardSetting(
    @Body() body: AddRewardSettingtDto
  ): Promise<Record<string, never>> {
    const result = await this.pointService.addRewardSetting(body);

    return result;
  }

  /**
   * 活動型積點設定詳細資料
   * @param body
   * @returns
   */
  @Post(apiPath.point.getRewardSettingInfo)
  @ApiOperation({
    summary: '活動型積點設定詳細資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '活動型積點設定詳細資料',
    type: GetRewardSettingInfoResp
  })
  async getRewardSettingInfo(
    @Body() body: RewardIdDto
  ): Promise<GetRewardSettingInfoResp> {
    const { rewardId } = body;
    const result = await this.pointService.getRewardSettingInfo(rewardId);

    return result;
  }

  /**
   * 刪除消費型、活動型積點設定
   * @param body
   * @returns
   */
  @Delete(apiPath.point.delPointSending)
  @ApiOperation({
    summary: '刪除消費型、活動型積點設定'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '刪除消費型、活動型積點設定'
  })
  async delPointSending(
    @Body() body: RewardIdDto
  ): Promise<Record<string, never>> {
    const { rewardId, iam } = body;
    const { authMemberId } = iam;
    const result = await this.pointService.delPointSending(
      rewardId,
      authMemberId
    );

    return result;
  }

  /**
   * 積點調整列表
   * @returns
   */
  @Get(apiPath.point.getPointAdjustList)
  @ApiOperation({
    summary: '積點調整列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '積點調整列表',
    type: GetPointAdjustListResp
  })
  async getPointAdjustList(): Promise<GetPointAdjustListResp> {
    const result = await this.pointService.getPointAdjustList();

    return result;
  }

  /**
   * 複製積點調整
   * @returns
   */
  @Post(apiPath.point.copyPointAdjust)
  @ApiOperation({
    summary: '複製積點調整'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '複製積點調整'
  })
  async copyPointAdjust(
    @Body() body: AdjustIdDto
  ): Promise<Record<string, never>> {
    const { adjustId, iam } = body;
    const { authMemberId } = iam;
    const result = await this.pointService.copyPointAdjust(
      adjustId,
      authMemberId
    );

    return result;
  }

  /**
   * 刪除積點調整
   * @param body
   * @returns
   */
  @Delete(apiPath.point.delPointAdjust)
  @ApiOperation({
    summary: '刪除積點調整'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '刪除積點調整'
  })
  async delPointAdjust(
    @Body() body: AdjustIdDto
  ): Promise<Record<string, never>> {
    const { adjustId, iam } = body;
    const { authMemberId } = iam;
    const result = await this.pointService.delPointAdjust(
      adjustId,
      authMemberId
    );

    return result;
  }

  /**
   * 新增/編輯積點調整
   * @param body
   * @returns
   */
  @Post(apiPath.point.addPointAdjust)
  @ApiOperation({
    summary: '新增/編輯積點調整'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '新增/編輯積點調整'
  })
  async addPointAdjust(
    @Body() body: AddPointAdjustDto
  ): Promise<Record<string, never>> {
    const result = await this.pointService.addPointAdjust(body);

    return result;
  }

  /**
   * 積點調整詳細資訊
   * @param body
   * @returns
   */
  @Post(apiPath.point.getPointAdjustInfo)
  @ApiOperation({
    summary: '積點調整詳細資訊'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '積點調整詳細資訊'
  })
  async getPointAdjustInfo(
    @Body() body: AdjustIdDto
  ): Promise<GetPointAdjustInfoResp> {
    const { adjustId } = body;
    const result = await this.pointService.getPointAdjustInfo(adjustId);

    return result;
  }

  /**
   * 下載上傳會員積點範本
   * @returns
   */
  @Get(apiPath.point.downloadMemberPointExample)
  @ApiOperation({
    summary: '下載 Excel 上傳會員積點範本'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回上傳會員積點 Excel 範本.',
    type: DownloadMemberPointExampleResp
  })
  async downloadMemberPointExample(
    @Res() res: Response
  ): Promise<DownloadMemberPointExampleResp> {
    const result = await this.pointService.downloadMemberPointExample(res);

    return result;
  }

  /**
   * 匯入 excel 會員積點
   * @returns
   */
  @Patch(apiPath.point.uploadMemberPoint)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '匯入 Excel 會員積點'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回 Excel 會員積點總筆數.',
    type: UploadMemberPointResp
  })
  async uploadMemberPoint(
    @UploadedFile() file: Express.Multer.File
  ): Promise<UploadMemberPointResp> {
    const result = await this.pointService.uploadMemberPoint(file);

    return result;
  }
}
