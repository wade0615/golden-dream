import { Body, Controller, Get, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import {
  CountClusterMemberDto,
  CountClusterMemberResp
} from './Dto/count.cluster.member.dto';
import { DelClusterSettingDto } from './Dto/del.cluster.setting.dto';
import { GetClusterCommonSettingResp } from './Dto/get.cluster.common.setting.dto';
import {
  GetClusterDownloadListDto,
  GetClusterDownloadListResp
} from './Dto/get.cluster.download.list.dto';
import {
  GetClusterSettingDetailDto,
  GetClusterSettingDetailResp
} from './Dto/get.cluster.setting.detail.dto';
import {
  GetClusterSettingListDto,
  GetClusterSettingListResp
} from './Dto/get.cluster.setting.list.dto';
import { StopClusterSettingDto } from './Dto/stop.cluster.setting.dto';
import { UpdClusterCommonSettingDto } from './Dto/upd.cluster.common.setting.dto';
import { UpdClusterSettingDto } from './Dto/upd.cluster.setting.dto';
import { ClusterService } from './cluster.service';

@ApiTags('cluster')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'cluster'
})
export class ClusterController {
  constructor(
    private readonly clusterService: ClusterService,
    private readonly redisService: RedisService
  ) {}

  /**
   * 取得分群通用設定
   *
   * @returns
   */
  @Get(apiPath.cluster.getClusterCommonSetting)
  @ApiOperation({
    summary: '取得分群通用設定'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回分群通用設定.',
    type: GetClusterCommonSettingResp
  })
  async getClusterCommonSetting(): Promise<GetClusterCommonSettingResp> {
    const result = await this.clusterService.getClusterCommonSetting();

    return result;
  }

  /**
   * 修改分群通用設定
   *
   * @param body
   * @returns
   */
  @Post(apiPath.cluster.updClusterCommonSetting)
  @ApiOperation({
    summary: '修改分群通用設定'
  })
  async updClusterCommonSetting(
    @Body() body: UpdClusterCommonSettingDto
  ): Promise<Record<string, never>> {
    await this.clusterService.updClusterCommonSetting(body);

    return {};
  }

  /**
   * 分群設定列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.cluster.getClusterSettingList)
  @ApiOperation({
    summary: '取得分群設定列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回分群設定列表.',
    type: GetClusterSettingListResp
  })
  async getClusterSettingList(
    @Body() body: GetClusterSettingListDto
  ): Promise<GetClusterSettingListResp> {
    const result = await this.clusterService.getClusterSettingList(body);

    return result;
  }

  /**
   * 取得分群設定明細
   *
   * @param body
   * @returns
   */
  @Post(apiPath.cluster.getClusterSettingDetail)
  @ApiOperation({
    summary: '取得分群設定明細'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回分群設定明細.',
    type: GetClusterSettingDetailResp
  })
  async getClusterSettingDetail(
    @Body() body: GetClusterSettingDetailDto
  ): Promise<GetClusterSettingDetailResp> {
    const result = await this.clusterService.getClusterSettingDetail(body);

    return result;
  }

  /**
   * 更新分群設定
   *
   * @param body
   * @returns
   */
  @Post(apiPath.cluster.updClusterSetting)
  @ApiOperation({
    summary: '更新分群設定'
  })
  async updClusterSetting(
    @Body() body: UpdClusterSettingDto
  ): Promise<Record<string, never>> {
    await this.clusterService.updClusterSetting(body);

    return {};
  }

  /**
   * 計算分群觸及人數
   *
   * @param body
   * @returns
   */
  @Post(apiPath.cluster.countClusterMember)
  @ApiOperation({
    summary: '計算分群觸及人數'
  })
  async countClusterPeople(
    @Body() body: CountClusterMemberDto
  ): Promise<CountClusterMemberResp> {
    const result = await this.clusterService.countClusterMember(body);

    return result;
  }

  /**
   * 取得分群下載列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.cluster.getClusterDownloadList)
  @ApiOperation({
    summary: '取得分群下載列表'
  })
  async getClusterDownloadList(
    @Body() body: GetClusterDownloadListDto
  ): Promise<GetClusterDownloadListResp> {
    const result = await this.clusterService.getClusterDownloadList(body);

    return result;
  }

  /**
   * 停用分群設定
   *
   * @param body
   * @returns
   */
  @Post(apiPath.cluster.stopClusterSetting)
  @ApiOperation({
    summary: '停用分群設定'
  })
  async stopClusterSetting(
    @Body() body: StopClusterSettingDto
  ): Promise<Record<string, never>> {
    await this.clusterService.stopClusterSetting(body);

    return {};
  }

  /**
   * 刪除分群設定
   *
   * @param body
   * @returns
   */
  @Post(apiPath.cluster.delClusterSetting)
  @ApiOperation({
    summary: '刪除分群設定'
  })
  async delClusterSetting(
    @Body() body: DelClusterSettingDto
  ): Promise<Record<string, never>> {
    await this.clusterService.delClusterSetting(body);

    return {};
  }

  @Get(apiPath.cluster.demo)
  @ApiOperation({
    summary: '取得分群下載列表'
  })
  async demo() {
    await this.redisService.delCacheData(
      'SCHEDULE_SWITCH:exportClusterData:in_progress'
    );

    await this.redisService.delCacheData(
      'SCHEDULE_SWITCH:exportClusterData:done'
    );

    await this.redisService.delCacheData(
      'SCHEDULE_SWITCH:singleClusterData:in_progress'
    );

    await this.redisService.delCacheData(
      'SCHEDULE_SWITCH:singleClusterData:done'
    );

    await this.redisService.delCacheData(
      'SCHEDULE_SWITCH:exportBackstageCsv:in_progress'
    );

    await this.redisService.delCacheData(
      'SCHEDULE_SWITCH:exportBackstageCsv:done'
    );

    await this.redisService.setCacheData(
      'SCHEDULE_SWITCH:singleClusterData',
      'enable',
      null,
      false
    );

    await this.redisService.setCacheData(
      'SCHEDULE_SWITCH:exportBackstageCsv',
      'enable',
      null,
      false
    );

    await this.redisService.setCacheData(
      'SCHEDULE_SWITCH:exportClusterData',
      'enable',
      null,
      false
    );
    return {};
  }
}
