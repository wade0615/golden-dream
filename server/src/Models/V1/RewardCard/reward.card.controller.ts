import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  VERSION_NEUTRAL
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import apiPath from 'src/Center/api.path';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import { AddDemoDataDto } from './Dto/add.demo.data.dto';
import { DelRewardCardSettingDetailDto } from './Dto/del.reward.card.setting.detail.dto';
import { DelRewardSendDetailDto } from './Dto/del.reward.send.detail.dto';
import { DownloadRewardSendExampleResp } from './Dto/download.reward.example.dto';
import {
  ExchangeRewardCardDto,
  ExchangeRewardCardResp
} from './Dto/exchange.reward.card.dto';
import {
  GetMemberRewardCardDetailDto,
  GetMemberRewardCardDetailResp
} from './Dto/get.member.reward.card.detail.dto';
import {
  GetMemberRewardCardGiftDetailDto,
  GetMemberRewardCardGiftDetailResp
} from './Dto/get.member.reward.card.gift.detail.dto';
import {
  GetMemberRewardCardGiftListDto,
  GetMemberRewardCardGiftListResp
} from './Dto/get.member.reward.card.gift.list.dto';
import {
  GetMemberRewardCardListDto,
  GetMemberRewardCardListResp
} from './Dto/get.member.reward.card.list.dto';
import {
  GetMemberRewardDetailDto,
  GetMemberRewardDetailResp
} from './Dto/get.member.reward.detail.dto';
import {
  GetRewardCardHistoryDto,
  GetRewardCardHistoryResp
} from './Dto/get.reward.card.history.dto';
import { GetRewardCardMenuResp } from './Dto/get.reward.card.menu.dto';
import {
  GetRewardCardSettingDetailDto,
  GetRewardCardSettingDetailResp
} from './Dto/get.reward.card.setting.detail.dto';
import {
  GetRewardCardSettingListDto,
  GetRewardCardSettingListResp
} from './Dto/get.reward.card.setting.list.dto';
import {
  GetRewardDetailDto,
  GetRewardDetailResp
} from './Dto/get.reward.detail.dto';
import {
  GetRewardSendDetailDto,
  GetRewardSendDetailResp
} from './Dto/get.reward.send.detail.dto';
import {
  GetRewardSendListDto,
  GetRewardSendListResp
} from './Dto/get.reward.send.list.dto';
import { UpdRewardCardSettingDetailDto } from './Dto/upd.reward.card.setting.detail.dto';
import { UpdRewardSendDetailDto } from './Dto/upd.reward.send.detail.dto';
import { UploadRewardDetailResp } from './Dto/upload.reward.detail.dto';
import { RewardCardService } from './reward.card.service';

@ApiTags('rewardCard')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'rewardCard'
})
export class RewardCardController {
  constructor(
    private readonly rewardCardService: RewardCardService,
    private readonly redisService: RedisService
  ) {}

  /**
   * 取得集點卡列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.getRewardCardSettingList)
  @ApiOperation({
    summary: '取得集點卡列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回集點卡列表.',
    type: GetRewardCardSettingListResp
  })
  async getRewardCardSettingList(
    @Body() body: GetRewardCardSettingListDto
  ): Promise<GetRewardCardSettingListResp> {
    const result = await this.rewardCardService.getRewardCardSettingList(body);

    return result;
  }

  /**
   * 取得集點卡詳情
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.getRewardCardSettingDetail)
  @ApiOperation({
    summary: '取得集點卡詳情'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回集點卡詳情',
    type: GetRewardCardSettingDetailResp
  })
  async getRewardCardSettingDetail(
    @Body() body: GetRewardCardSettingDetailDto
  ): Promise<GetRewardCardSettingDetailResp> {
    const result = await this.rewardCardService.getRewardCardSettingDetail(
      body
    );

    return result;
  }

  /**
   * 儲存集點卡資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.updRewardCardSettingDetail)
  @ApiOperation({
    summary: '儲存集點卡資料'
  })
  @ApiCreatedResponse()
  async updRewardCardSettingDetail(
    @Body() body: UpdRewardCardSettingDetailDto
  ): Promise<Record<string, never>> {
    await this.rewardCardService.updRewardCardSettingDetail(body);

    return {};
  }

  /**
   * 刪除集點卡詳情
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.delRewardCardSettingDetail)
  @ApiOperation({
    summary: '刪除集點卡詳情'
  })
  @ApiCreatedResponse()
  async delRewardCardSettingDetail(
    @Body() body: DelRewardCardSettingDetailDto
  ): Promise<Record<string, never>> {
    await this.rewardCardService.delRewardCardSettingDetail(body);

    return {};
  }

  /**
   * 取得集點卡發送列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.getRewardSendList)
  @ApiOperation({
    summary: '取得集點卡發送列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回集點卡發送列表',
    type: GetRewardSendListResp
  })
  async getRewardSendList(
    @Body() body: GetRewardSendListDto
  ): Promise<GetRewardSendListResp> {
    const result = await this.rewardCardService.getRewardSendList(body);

    return result;
  }

  /**
   * 取得集點卡發送詳情
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.getRewardSendDetail)
  @ApiOperation({
    summary: '取得集點卡發送詳情'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回集點卡發送詳情',
    type: GetRewardSendDetailResp
  })
  async getRewardSendDetail(
    @Body() body: GetRewardSendDetailDto
  ): Promise<GetRewardSendDetailResp> {
    const result = await this.rewardCardService.getRewardSendDetail(body);

    return result;
  }

  /**
   * 檢查上傳集點卡發送詳細資料
   *
   * @param file
   * @returns
   */
  @Patch(apiPath.rewardCard.uploadRewardSendDetail)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '檢查上傳集點卡發送詳細資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回檢查上傳集點卡發送詳細資料',
    type: UploadRewardDetailResp
  })
  async uploadRewardSendDetail(
    @UploadedFile() file: Express.Multer.File
  ): Promise<UploadRewardDetailResp> {
    const rewardSendDetail =
      await this.rewardCardService.chkUploadRewardSendDetail(file, false);

    const result = <UploadRewardDetailResp>{};
    result.totalCount = rewardSendDetail?.totalCount;
    result.urls = rewardSendDetail?.urls;

    return result;
  }

  /**
   * 儲存集點卡發送
   *
   * @param body
   * @returns
   */
  @Patch(apiPath.rewardCard.updRewardSendDetail)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '儲存集點卡發送'
  })
  @ApiCreatedResponse()
  async updRewardSendDetail(
    @UploadedFile() file: Express.Multer.File,
    @Headers() headers: any,
    @Body() body: UpdRewardSendDetailDto
  ): Promise<Record<string, never>> {
    const userId = headers['authMemberId'];
    await this.rewardCardService.updRewardSendDetail(file, body, userId);

    return {};
  }

  /**
   * 刪除集點卡發送
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.delRewardSendDetail)
  @ApiOperation({
    summary: '刪除集點發送'
  })
  @ApiCreatedResponse()
  async delRewardSendDetail(
    @Body() body: DelRewardSendDetailDto
  ): Promise<Record<string, never>> {
    await this.rewardCardService.delRewardSendDetail(body);

    return {};
  }

  /**
   * 下載集點發送範本
   *
   * @returns
   */
  @Get(apiPath.rewardCard.downloadRewardSendExample)
  @ApiOperation({
    summary: '下載集點發送範本'
  })
  @ApiCreatedResponse()
  async downloadRewardSendExample(
    @Res() res: Response
  ): Promise<DownloadRewardSendExampleResp> {
    const result = await this.rewardCardService.downloadRewardSendExample(res);

    return result;
  }

  /**
   * 取得集點卡下拉式選單
   *
   * @returns
   */
  @Get(apiPath.rewardCard.getRewardCardMenu)
  @ApiOperation({
    summary: '取得集點卡下拉式選單'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回集點卡下拉式選單',
    type: GetRewardCardMenuResp
  })
  async getRewardCardMenu(): Promise<GetRewardCardMenuResp> {
    const result = await this.rewardCardService.getRewardCardMenu();

    return result;
  }

  /**
   * 取得集點明細
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.getRewardDetail)
  @ApiOperation({
    summary: '取得集點明細'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回集點明細',
    type: GetRewardDetailResp
  })
  async getRewardCardDetailHistory(
    @Body() body: GetRewardDetailDto
  ): Promise<GetRewardDetailResp> {
    const result = await this.rewardCardService.getRewardDetail(body);

    return result;
  }

  /**
   * 取得會員集點明細
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.getMemberRewardDetail)
  @ApiOperation({
    summary: '取得會員集點明細'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回會員集點明細',
    type: GetMemberRewardDetailResp
  })
  async getMemberRewardDetail(
    @Body() body: GetMemberRewardDetailDto
  ): Promise<GetMemberRewardDetailResp> {
    const result = await this.rewardCardService.getMemberRewardDetail(body);

    return result;
  }

  /**
   * 匯出集點明細
   *
   * @param res
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.exportRewardDetail)
  @ApiOperation({
    summary: '匯出集點明細'
  })
  @ApiCreatedResponse()
  async exportRewardDetail(
    @Res() res: Response,
    @Body() body: GetRewardDetailDto
  ) {
    await this.rewardCardService.exportRewardDetail(res, body);

    return {};
  }

  /**
   * 集點活動列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.getMemberRewardCardList)
  async getMemberRewardCardList(
    @Body() body: GetMemberRewardCardListDto
  ): Promise<GetMemberRewardCardListResp> {
    const result = await this.rewardCardService.getMemberRewardCardList(body);

    return result;
  }

  /**
   * 集點活動詳情
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.getMemberRewardCardDetail)
  async getMemberRewardCardDetail(
    @Body() body: GetMemberRewardCardDetailDto
  ): Promise<GetMemberRewardCardDetailResp> {
    const result = await this.rewardCardService.getMemberRewardCardDetail(body);

    return result;
  }

  /**
   * 集點可兌換獎品列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.getMemberRewardCardGiftList)
  async getMemberRewardCardGiftList(
    @Body() body: GetMemberRewardCardGiftListDto
  ): Promise<GetMemberRewardCardGiftListResp> {
    const result = await this.rewardCardService.getMemberRewardCardGiftList(
      body
    );

    return result;
  }

  /**
   * 集點可兌換獎品詳情
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.getMemberRewardCardGiftDetail)
  async getMemberRewardCardGiftDetail(
    @Body() body: GetMemberRewardCardGiftDetailDto
  ): Promise<GetMemberRewardCardGiftDetailResp> {
    const result = await this.rewardCardService.getMemberRewardCardGiftDetail(
      body
    );

    return result;
  }

  /**
   * 兌換獎品
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.exchangeRewardCard)
  async exchangeRewardCard(
    @Body() body: ExchangeRewardCardDto
  ): Promise<ExchangeRewardCardResp> {
    const result = await this.rewardCardService.exchangeRewardCard(body);

    return result;
  }

  /**
   * 集點歷程
   *
   * @param body
   * @returns
   */
  @Post(apiPath.rewardCard.getRewardCardHistory)
  async getRewardCardHistory(
    @Body() body: GetRewardCardHistoryDto
  ): Promise<GetRewardCardHistoryResp> {
    const result = await this.rewardCardService.getRewardCardHistory(body);

    return result;
  }

  /**
   * batchDemo
   * @returns
   */
  @Get(apiPath.rewardCard.demoBatch)
  async batchDemo() {
    await this.redisService.delCacheData(
      'SCHEDULE_SWITCH:collatingSaleTransactionData:in_progress'
    );

    await this.redisService.delCacheData(
      'SCHEDULE_SWITCH:collatingSaleTransactionData:done'
    );

    await this.redisService.delCacheData(
      'SCHEDULE_SWITCH:collatingSaleTransactionData'
    );

    await this.redisService.delCacheData(
      'SCHEDULE_SWITCH:collatingReturnTransactionData:done'
    );

    await this.redisService.delCacheData(
      'max:reward:card:transaction:id:230911'
    );

    await this.redisService.delCacheData('reward:orderReturn:20230911');

    await this.redisService.delCacheData('fail');

    await this.redisService.delCacheData(
      'SCHEDULE_SWITCH:sendMemberRewardCard:done'
    );

    await this.redisService.setCacheData(
      'SCHEDULE_SWITCH:collatingSaleTransactionData',
      'enable',
      null,
      false
    );

    return {};
  }

  @Post(apiPath.rewardCard.demoAddData)
  async demoAddData(@Body() body: AddDemoDataDto) {
    body?.orderData?.forEach(async (order) => {
      await this.redisService.lpushData('reward:order', JSON.stringify(order));
    });

    body?.returnOrder?.forEach(async (order) => {
      await this.redisService.lpushData(
        'reward:orderReturn',
        JSON.stringify(order)
      );
    });
  }
}
