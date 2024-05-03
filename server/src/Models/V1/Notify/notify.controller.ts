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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import apiPath from 'src/Center/api.path';
import { DelNotifyClassDto } from './Dto/del.notify.class.dto';
import { DelNotifyMemberDetailDto } from './Dto/del.notify.member.detail.dto';
import {
  DownloadNotifyMemberExampleResp,
  NotifyMemberTypeDto
} from './Dto/download.notify.member.example.dto';
import { GetNotifyClassListResp } from './Dto/get.notify.class.dto';
import { GetNotifyClassMenuResp } from './Dto/get.notify.class.menu.dto';
import {
  GetNotifyMemberListDto,
  GetNotifyMemberListResp
} from './Dto/get.notify.member.list.dto';
import { UpdNotifyClassDetailDto } from './Dto/upd.notify.class.detail.dto';
import { UpdNotifyClassRankDto } from './Dto/upd.notify.class.rank.dto';
import { UpdNotifyMemberDetailDto } from './Dto/upd.notify.member.detail.dto';
import { UploadAddNotifyMemberResp } from './Dto/upload.add.notify.member.dto';
import { NotifyService } from './notify.service';

@ApiTags('notify')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'notify'
})
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  /**
   * 取得通知分類列表
   *
   * @returns
   */
  @Get(apiPath.notify.getNotifyClassList)
  @ApiOperation({
    summary: '取得通知分類列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回通知分類列表.',
    type: GetNotifyClassListResp
  })
  async getNotifyClassList(): Promise<GetNotifyClassListResp[]> {
    const result = await this.notifyService.getNotifyClassList();

    return result;
  }

  /**
   * 修改通知分類設定排序
   *
   * @param body
   * @returns
   */
  @Post(apiPath.notify.updNotifyClassRank)
  @ApiOperation({
    summary: '修改通知分類設定排序'
  })
  async updNotifyClassRank(
    @Body() body: UpdNotifyClassRankDto
  ): Promise<Record<string, never>> {
    await this.notifyService.updNotifyClassRank(body);

    return {};
  }

  /**
   * 修改通知分類詳細資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.notify.updNotifyClassDetail)
  @ApiOperation({
    summary: '修改通知分類詳細資料'
  })
  async updNotifyClassDetail(
    @Body() body: UpdNotifyClassDetailDto
  ): Promise<Record<string, never>> {
    await this.notifyService.updNotifyClassDetail(body);

    return {};
  }

  /**
   * 刪除通知分類設定
   *
   * @param body
   * @returns
   */
  @Post(apiPath.notify.delNotifyClassDetail)
  @ApiOperation({
    summary: '刪除通知分類設定'
  })
  async delNotifyClassDetail(
    @Body() body: DelNotifyClassDto
  ): Promise<Record<string, never>> {
    await this.notifyService.delNotifyClassDetail(body);

    return {};
  }

  /**
   * 取得通知分類下拉式選單
   *
   * @returns
   */
  @Get(apiPath.notify.getNotifyClassMenu)
  @ApiOperation({
    summary: '取得通知分類下拉式選單'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回通知分類選單資料.',
    type: GetNotifyClassMenuResp
  })
  async getNotifyClassMenu(): Promise<GetNotifyClassMenuResp> {
    const result = await this.notifyService.getNotifyClassMenu();

    return result;
  }

  /**
   * 取得通知人員列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.notify.getNotifyMemberList)
  @ApiOperation({
    summary: '取得通知人員列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回通知人員列表.',
    type: GetNotifyMemberListResp
  })
  async getNotifyMemberList(
    @Body() body: GetNotifyMemberListDto
  ): Promise<GetNotifyMemberListResp> {
    const result = await this.notifyService.getNotifyMemberList(body);

    return result;
  }

  /**
   * 修改通知人員詳細資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.notify.updNotifyMemberDetail)
  @ApiOperation({
    summary: '修改通知人員詳細資料'
  })
  @ApiCreatedResponse()
  async updNotifyMemberDetail(
    @Body() body: UpdNotifyMemberDetailDto
  ): Promise<Record<string, never>> {
    await this.notifyService.updNotifyMemberDetail(body);

    return {};
  }

  /**
   * 刪除通知人員資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.notify.delNotifyMemberDetail)
  @ApiOperation({
    summary: '刪除通知人員資料'
  })
  @ApiCreatedResponse()
  async delNotifyMemberDetail(
    @Body() body: DelNotifyMemberDetailDto
  ): Promise<Record<string, never>> {
    await this.notifyService.delNotifyMemberDetail(body);

    return {};
  }

  /**
   * 下載通知人員名單範本
   *
   * @param res
   * @param body
   * @returns
   */
  @Post(apiPath.notify.downloadNotifyMemberExample)
  @ApiOperation({
    summary: '下載通知人員名單範本'
  })
  @ApiCreatedResponse()
  async downloadNotifyMemberExample(
    @Res() res: Response,
    @Body() body: NotifyMemberTypeDto
  ): Promise<DownloadNotifyMemberExampleResp> {
    const result = await this.notifyService.downloadNotifyMemberExample(
      res,
      body
    );

    return result;
  }

  /**
   * 上傳新增通知人員名單
   *
   * @param file
   * @returns
   */
  @Patch(apiPath.notify.uploadAddNotifyMemberDetail)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '上傳新增通知人員名單'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回新增通知人員資料.',
    type: UploadAddNotifyMemberResp
  })
  async uploadAddNotifyMemberDetail(
    @UploadedFile() file: Express.Multer.File
  ): Promise<UploadAddNotifyMemberResp> {
    const notifyMember = await this.notifyService.chkUploadAddNotifyMember(
      file
    );

    const result = <UploadAddNotifyMemberResp>{};
    result.totalCount = notifyMember?.totalCount;

    return result;
  }

  /**
   * 儲存新增通知人員名單
   *
   * @param file
   * @returns
   */
  @Patch(apiPath.notify.updBatchAddNotifyMemberDetail)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '儲存新增通知人員名單'
  })
  @ApiCreatedResponse()
  async updBatchAddNotifyMemberDetail(
    @Headers() headers: any,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Record<string, never>> {
    const userId = headers['authMemberId'];
    await this.notifyService.updBatchAddNotifyMember(file, userId);

    return {};
  }

  /**
   * 儲存刪除通知人員名單
   *
   * @param file
   * @returns
   */
  @Patch(apiPath.notify.updBatchDelNotifyMemberDetail)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '儲存刪除通知人員名單'
  })
  @ApiCreatedResponse()
  async updBatchDelNotifyMemberDetail(
    @Headers() headers: any,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Record<string, never>> {
    const userId = headers['authMemberId'];
    await this.notifyService.updBatchDelNotifyMember(file, userId);

    return {};
  }
}
