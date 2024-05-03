import {
  Body,
  Controller,
  Delete,
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
import { AddTagMemberDto } from './Dto/add.tag.member.dto';
import { DelTagDataDto } from './Dto/del.tag.data.dto';
import { DelTagGroupDto } from './Dto/del.tag.group.dto';
import { DelTagMemberDto } from './Dto/del.tag.member.dto';
import { DownloadTagDataResp } from './Dto/download.tag.data';
import { GetTagDetailDto, GetTagDetailResp } from './Dto/get.tag.detail.dto';
import { GetTagGroupListResp } from './Dto/get.tag.group.list.dto';
import { GetTagGroupMenuResp } from './Dto/get.tag.group.menu.dto';
import { GetTagListDto, GetTagListResp } from './Dto/get.tag.list.dto';
import {
  GetTagMemberListDto,
  GetTagMemberListResp
} from './Dto/get.tag.member.list.dto';
import { GetTagMenuResp } from './Dto/get.tag.menu.dto';
import { InsTagDataDto } from './Dto/ins.tag.data.dto';
import { InsTagGroupDto } from './Dto/ins.tag.group.dto';
import { StopTagStatusDto } from './Dto/stop.tag.status.dto';
import { UpdTagGroupSortDto } from './Dto/upd.tag.group.sort.dto';
import { TagService } from './tag.service';

@ApiTags('tag')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'tag'
})
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * 取得標籤列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.tag.getTagList)
  @ApiOperation({
    summary: '取得標籤列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回標籤列表.',
    type: GetTagListResp
  })
  async getTagList(@Body() body: GetTagListDto): Promise<GetTagListResp> {
    const result = await this.tagService.getTagList(body);

    return result;
  }

  /**
   * 取得標籤詳情
   *
   * @param body
   * @returns
   */
  @Post(apiPath.tag.getTagDetail)
  @ApiOperation({
    summary: '取得標籤詳情'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回標籤詳情.',
    type: GetTagDetailResp
  })
  async getTagDetail(@Body() body: GetTagDetailDto): Promise<GetTagDetailResp> {
    const result = await this.tagService.getTagDetail(body);

    return result;
  }

  /**
   * 新增標籤資料
   *
   * @returns
   */
  @Post(apiPath.tag.insTagData)
  @ApiOperation({
    summary: '新增標籤資料'
  })
  async insTagData(
    @Body() body: InsTagDataDto
  ): Promise<Record<string, never>> {
    await this.tagService.insTagData(body);

    return {};
  }

  /**
   * 停用標籤
   *
   * @returns
   */
  @Post(apiPath.tag.stopTagStatus)
  @ApiOperation({
    summary: '停用標籤'
  })
  async stopTagStatus(
    @Body() body: StopTagStatusDto
  ): Promise<Record<string, never>> {
    await this.tagService.stopTagStatus(body);

    return {};
  }

  /**
   * 刪除標籤
   *
   * @returns
   */
  @Delete(apiPath.tag.delTagData)
  @ApiOperation({
    summary: '刪除標籤'
  })
  async delTagData(
    @Body() body: DelTagDataDto
  ): Promise<Record<string, never>> {
    await this.tagService.delTagData(body);

    return {};
  }

  /**
   * 下載標籤範本
   *
   * @returns
   */
  @Get(apiPath.tag.downloadTagExample)
  @ApiOperation({
    summary: '下載標籤範本'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '下載標籤範本.',
    type: DownloadTagDataResp
  })
  async downloadTagExample(@Res() res: Response): Promise<DownloadTagDataResp> {
    const result = await this.tagService.downloadTagExample(res);

    return result;
  }

  /**
   * 取得標籤下拉式選單
   *
   * @returns
   */
  @Get(apiPath.tag.getTagMenu)
  @ApiOperation({
    summary: '取得標籤下拉式選單'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回標籤下拉式選單資料.',
    type: GetTagMenuResp
  })
  async getTagMenu(): Promise<GetTagMenuResp[]> {
    const result = await this.tagService.getTagMenu();

    return result;
  }

  /**
   * 取得標籤分類下拉式選單
   *
   * @returns
   */
  @Get(apiPath.tag.getTagGroupMenu)
  @ApiOperation({
    summary: '取得標籤分類下拉式選單'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回標籤分類下拉式選單資料.',
    type: GetTagGroupMenuResp
  })
  async getTagGroupMenu(): Promise<GetTagGroupMenuResp[]> {
    const result = await this.tagService.getTagGroupMenu();

    return result;
  }

  /**
   * 取得標籤分類管理
   *
   * @returns
   */
  @Get(apiPath.tag.getTagGroupList)
  @ApiOperation({
    summary: '取得品牌列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回品牌列表.',
    type: GetTagGroupListResp
  })
  async getTagGroupList(): Promise<GetTagGroupListResp[]> {
    const result = await this.tagService.getTagGroupList();

    return result;
  }

  /**
   * 新增/編輯標籤分類管理
   *
   * @param body
   * @returns
   */
  @Post(apiPath.tag.insTagGroup)
  @ApiOperation({
    summary: '新增/編輯標籤分類管理'
  })
  async insTagGroup(
    @Body() body: InsTagGroupDto
  ): Promise<Record<string, never>> {
    await this.tagService.insTagGroup(body);

    return {};
  }

  /**
   * 刪除標籤分類
   *
   * @param body
   * @returns
   */
  @Delete(apiPath.tag.delTagGroup)
  @ApiOperation({
    summary: '刪除標籤分類'
  })
  async delTagGroup(
    @Body() body: DelTagGroupDto
  ): Promise<Record<string, never>> {
    await this.tagService.delTagGroup(body);

    return {};
  }

  /**
   * 更改標籤分類排序
   *
   * @param body
   * @returns
   */
  @Post(apiPath.tag.updTagGroupSort)
  @ApiOperation({
    summary: '更改標籤分類排序'
  })
  async updTagGroupSort(
    @Body() body: UpdTagGroupSortDto
  ): Promise<Record<string, never>> {
    await this.tagService.updTagGroupSort(body);

    return {};
  }

  /**
   * 新增會員標籤
   *
   * @param body
   * @returns
   */
  @Patch(apiPath.tag.addTagMember)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '新增會員標籤'
  })
  async addTagMember(
    @UploadedFile() file: Express.Multer.File,
    @Headers() headers: any,
    @Body() body: AddTagMemberDto
  ): Promise<Record<string, never>> {
    const userId = headers['authMemberId'];
    await this.tagService.addTagMember(file, body, userId);

    return {};
  }

  /**
   * 移除會員標籤
   *
   * @param body
   * @returns
   */
  @Patch(apiPath.tag.delTagMember)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '移除會員標籤'
  })
  async delTagMember(
    @UploadedFile() file: Express.Multer.File,
    @Headers() headers: any,
    @Body() body: DelTagMemberDto
  ): Promise<Record<string, never>> {
    const userId = headers['authMemberId'];
    await this.tagService.delTagMember(file, body, userId);

    return {};
  }

  /**
   * 取得貼標列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.tag.getTagMemberList)
  @ApiOperation({
    summary: '取得貼標列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回貼標列表.',
    type: GetTagMemberListResp
  })
  async getTagMemberList(
    @Body() body: GetTagMemberListDto
  ): Promise<GetTagMemberListResp> {
    const result = await this.tagService.getTagMemberList(body);

    return result;
  }
}
