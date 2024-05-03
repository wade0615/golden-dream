import { Body, Controller, Get, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import apiPath from 'src/Center/api.path';
import {
  GetChannelListResp,
  UpdChannelDetailDto,
  UpdChannelSortDto
} from 'src/Models/V1/Channel/Dto';
import { GetChannelMenuResp } from './Dto/get.channel.menu.dto';
import { ChannelService } from './channel.service';

@ApiTags('channel')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'channel'
})
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  /**
   * 取得渠道列表
   *
   * @returns
   */
  @Post(apiPath.channel.getChannelList)
  @ApiOperation({
    summary: '取得渠道列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回渠道列表',
    type: GetChannelListResp
  })
  async getChannelList(): Promise<GetChannelListResp[]> {
    const result = await this.channelService.getChannelList();

    return result;
  }

  /**
   * 修改渠道順序
   *
   * @param body
   * @returns
   */
  @Post(apiPath.channel.updChannelSort)
  @ApiOperation({
    summary: '修改渠道順序'
  })
  async updChannelSort(
    @Body() body: UpdChannelSortDto
  ): Promise<Record<string, never>> {
    await this.channelService.updChannelSort(body);

    return {};
  }

  /**
   * 修改渠道資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.channel.updChannelDetail)
  @ApiOperation({
    summary: '修改渠道詳細資料'
  })
  async updChannelDetail(
    @Body() body: UpdChannelDetailDto
  ): Promise<Record<string, never>> {
    await this.channelService.updChannelDetail(body);

    return {};
  }

  /**
   * 取得渠道下拉式選單
   *
   * @returns
   */
  @Get(apiPath.channel.getChannelMenu)
  @ApiOperation({
    summary: '取得渠道下拉式選單'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回渠道下拉式選單',
    type: GetChannelMenuResp
  })
  async getChannelMenu(): Promise<GetChannelMenuResp> {
    const result = await this.channelService.getChannelMenu();

    return result;
  }
}
