import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Req,
  VERSION_NEUTRAL
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import { AddMemberShipDto, AddMemberShipResp } from './Dto/add.member.ship.dto';
import {
  AddMemberShipSettingDto,
  AddMemberShipSettingResp
} from './Dto/add.member.ship.setting.dto';
import { DelMemberShipSettingDto } from './Dto/del.member.ship.setting.dto';
import {
  GetMemberSettingParameterDto,
  GetMemberSettingParameterResp
} from './Dto/get.member.setting.parameter.dto';
import { GetMemberShipMenuResp } from './Dto/get.member.ship.menu.dto';
import { UpdateActiveMemberShipDto } from './Dto/update.active.member.ship.dto';
import { UpdateActiveMemberShipSettingDto } from './Dto/update.active.member.ship.setting.dto';
import { GetBasicMemberShipSettingResp } from './Interface/get.basic.member.ship.setting.interface';
import { GetMemberShipSettingInfoResp } from './Interface/get.member.ship.setting.info.interface';
import { GetMemberShipSettingListResp } from './Interface/get.member.ship.setting.list.interface';
import { MemberShipService } from './memberShip.service';

@ApiTags('memberShip')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'memberShip'
})
export class MemberShipController {
  constructor(
    private readonly memberShipService: MemberShipService,
    private readonly redisService: RedisService
  ) {}

  /**
   * 取得會籍設定列表
   * @returns
   */
  @Get(apiPath.memberShip.getMemberShipSettingList)
  async getMemberShipSettingList(): Promise<GetMemberShipSettingListResp> {
    const result = await this.memberShipService.getMemberShipSettingList();

    return result;
  }

  /**
   * 新增編輯會籍版本
   * @returns
   */
  @Post(apiPath.memberShip.addMemberShipSetting)
  async addMemberShipSetting(
    @Body() body: AddMemberShipSettingDto
  ): Promise<AddMemberShipSettingResp> {
    const result = await this.memberShipService.addMemberShipSetting(body);

    return result;
  }

  /**
   * 編輯生效中的會籍版本
   * @returns
   */
  @Patch(apiPath.memberShip.updateActiveMemberShipSetting)
  async updateActiveMemberShipSetting(
    @Body() body: UpdateActiveMemberShipSettingDto
  ): Promise<AddMemberShipSettingResp> {
    const result = await this.memberShipService.updateActiveMemberShipSetting(
      body
    );

    return result;
  }

  /**
   * 複製會籍設定
   * @returns
   */
  @Put(apiPath.memberShip.copyMemberShipSetting)
  async copyMemberShipSetting(
    @Body() body: DelMemberShipSettingDto
  ): Promise<Record<string, never>> {
    const { settingId, iam } = body;
    const { authMemberId } = iam;
    const result = await this.memberShipService.copyMemberShipSetting(
      settingId,
      authMemberId
    );

    return result;
  }

  /**
   * 刪除會籍版本設定
   * @returns
   */
  @Delete(apiPath.memberShip.delMemberShipSetting)
  async delMemberShipSetting(
    @Body() body: DelMemberShipSettingDto
  ): Promise<Record<string, never>> {
    const { settingId } = body;
    const result = await this.memberShipService.delMemberShipSetting(settingId);

    return result;
  }

  /**
   * 新增編輯單項會籍
   * @returns
   */
  @Post(apiPath.memberShip.addMemberShip)
  async addMemberShip(
    @Body() body: AddMemberShipDto
  ): Promise<AddMemberShipResp> {
    const result = await this.memberShipService.addMemberShip(body);

    return result;
  }

  /**
   * 編輯啟用中的單項會籍
   * @returns
   */
  @Post(apiPath.memberShip.updateActiveMemberShip)
  async updateActiveMemberShip(
    @Body() body: UpdateActiveMemberShipDto
  ): Promise<AddMemberShipResp> {
    const result = await this.memberShipService.updateActiveMemberShip(body);

    return result;
  }

  /**
   * 發布會籍版本
   * @returns
   */
  @Post(apiPath.memberShip.releaseMemberShipSetting)
  async releaseMemberShipSetting(
    @Body() body: DelMemberShipSettingDto
  ): Promise<Record<string, never>> {
    const { settingId } = body;
    const result = await this.memberShipService.releaseMemberShipSetting(
      settingId
    );

    return result;
  }

  /**
   * 會籍版本設定詳細資訊
   * @returns
   */
  @Post(apiPath.memberShip.getMemberShipSettingInfo)
  async getMemberShipSettingInfo(
    @Body() body: DelMemberShipSettingDto
  ): Promise<GetMemberShipSettingInfoResp> {
    const { settingId } = body;
    const result = await this.memberShipService.getMemberShipSettingInfo(
      settingId
    );

    return result;
  }

  /**
   * 取得會員消費納入會籍計算時間 & next會籍參數
   * @returns
   */
  @Post(apiPath.memberShip.getMemberSettingParameter)
  async getMemberSettingParameter(
    @Body() body: GetMemberSettingParameterDto
  ): Promise<GetMemberSettingParameterResp> {
    const result = await this.memberShipService.getMemberSettingParameter(body);

    return result;
  }

  /**
   * CRM 取得初階會籍資料
   * @returns
   */
  @Get(apiPath.memberShip.getBasicMemberShipSetting)
  async getBasicMemberShipSetting(): Promise<GetBasicMemberShipSettingResp> {
    const result = await this.memberShipService.getBasicMemberShipSetting();

    return result;
  }

  /**
   * 取得會員會籍下拉式選單
   *
   * @returns
   */
  @Get(apiPath.memberShip.getMemberShipMenu)
  async getMemberShipMenu(): Promise<GetMemberShipMenuResp> {
    const result = await this.memberShipService.getMemberShipMenu();

    return result;
  }

  /**
   * batch insert data for demo and qa team
   * @returns
   */
  @Post(apiPath.memberShip.batchDemo)
  async batchDemo(@Req() req) {
    await this.memberShipService.batchDemo(req);

    return {};
  }

  @Post(apiPath.memberShip.batchMemberShipDemo)
  async batchMemberShipDemo(@Req() req) {
    await this.memberShipService.batchMemberShipDemo(req);

    return {};
  }

  /**
   * controlBatch for demo and qa team
   * 控制排程開關
   * @returns
   */
  @Post(apiPath.memberShip.controlBatch)
  async controlBatch(@Req() req) {
    let value;

    if (req?.body?.switch) {
      value = 'enable';
    } else {
      value = 'disable';

      await this.redisService.delCacheData('membeShip:order');
      await this.redisService.delCacheData('membeShip:orderReturn');
      await this.redisService.delCacheData('pending');
      await this.redisService.delCacheData('point:add');
      await this.redisService.delCacheData('point:minus');
    }

    const redisKey = [];
    switch (req?.body?.key) {
      case 'member':
        redisKey.push(
          `SCHEDULE_SWITCH:takeEffectMemberShip`,
          `SCHEDULE_SWITCH:upgradeMemberShip`,
          `SCHEDULE_SWITCH:downgradeMemberShip`,
          `SCHEDULE_SWITCH:renewalMemberShip`
        );
        break;
      case 'point':
        redisKey.push(
          `SCHEDULE_SWITCH:increasePoint`,
          `SCHEDULE_SWITCH:decreasePoint`
        );
        break;
      case 'mot':
        redisKey.push(
          `SCHEDULE_SWITCH:motDetect`,
          `SCHEDULE_SWITCH:motPrepare`,
          `SCHEDULE_SWITCH:motSend`,
          `SCHEDULE_SWITCH:motCluster`
        );
        break;
      case 'csv':
        redisKey.push(`SCHEDULE_SWITCH:exportBackstageCsv`);
        break;
      default:
        redisKey.push(req?.body?.key);
        break;
    }

    for (const key of redisKey) {
      await this.redisService.setCacheData(key, value, null, false);
    }

    return {};
  }

  /**
   * deleteFinishKey for demo and qa team
   * 刪除已完成的 key
   * @returns
   */
  @Post(apiPath.memberShip.deleteFinishKey)
  async deleteFinishKey() {
    const allKey = await this.redisService.scan();
    const doneKey = allKey?.filter((x) => x.includes('done'));
    await Promise.all(doneKey.map((x) => this.redisService.delCacheData(x)));

    return {};
  }
}
