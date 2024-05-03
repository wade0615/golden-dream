import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  VERSION_NEUTRAL
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';
import { GetMemberSpecialTypeMenuResp } from 'src/Models/V1/Member/Dto';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import {
  CheckMobileIsExistedDto,
  CheckMobileIsExistedResp
} from './Dto/check.mobile.is.existed.dto';
import { DelRedisKey } from './Dto/del.redis.key.dto';
import { ExportCsvDataDto } from './Dto/export.csv.data.dto';
import { GetTownshipCityDataResp } from './Dto/get.town.ship.city.data.dto';
import { SetRedisKey } from './Dto/set.redis.data.dto';
import { UploadImageDto, UploadImageResp } from './Dto/upload.image.dto';
import {
  ImportCsvDataReq,
  ImportCsvDataResp
} from './Interface/import.csv.data.interface';
import { CommonService } from './common.service';

@ApiTags('common')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'common'
})
export class CommonController {
  constructor(
    private readonly redisService: RedisService,
    private readonly commonService: CommonService
  ) {}

  /**
   * 更新 code center
   * @returns
   */
  @Get(apiPath.common.updateCodeCenter)
  @ApiOperation({
    summary: '更新 code center'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '更新 code center.'
  })
  async updateCodeCenter(): Promise<{}> {
    await this.commonService.updateCodeCenter();

    return {};
  }

  /**
   * 城鎮資料
   * @returns
   */
  @Get(apiPath.common.getTownshipCityData)
  @ApiOperation({
    summary: '取得資料中心選單'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得資料中心選單.',
    type: GetMemberSpecialTypeMenuResp
  })
  async getTownshipCityData(): Promise<GetTownshipCityDataResp> {
    const result = await this.commonService.getTownshipCityData();

    return result;
  }

  /**
   * 上傳圖片
   *
   * @param files
   * @param body
   * @returns
   */
  @Post(apiPath.common.uploadImage)
  @UseInterceptors(FilesInterceptor('files', 15)) // maxCount of files
  @ApiOperation({
    summary: '上傳圖片'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得 GCP 圖片網址.',
    type: UploadImageResp
  })
  async uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UploadImageDto
  ): Promise<UploadImageResp> {
    const result = await this.commonService.uploadImage(body, files);

    return result;
  }

  /**
   * 檢查電話號碼是否存在
   * @returns
   */
  @Post(apiPath.common.checkMobileIsExisted)
  @ApiOperation({
    summary: '檢查電話號碼是否存在'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '檢查電話號碼是否存在.',
    type: CheckMobileIsExistedResp
  })
  async checkMobileIsExisted(
    @Body() body: CheckMobileIsExistedDto
  ): Promise<Record<string, never>> {
    const result = await this.commonService.checkMobileIsExisted(body);

    return result;
  }

  @Post(apiPath.common.getRedisKeys)
  async getRedisKeys() {
    const result = await this.redisService.scan();

    return result;
  }

  @Post(apiPath.common.delRedisKey)
  async delRedisKey(@Body() body: DelRedisKey): Promise<Record<string, never>> {
    await this.redisService.delCacheData(body.key);

    return {};
  }

  @Post(apiPath.common.setRedisData)
  async setRedisData(
    @Body() body: SetRedisKey
  ): Promise<Record<string, never>> {
    const isExpired = body.ttl ? true : false;

    await this.redisService.setCacheData(
      body.key,
      body.data,
      body.ttl,
      isExpired
    );

    return {};
  }

  /**
   * 匯入 Csv 資料
   *
   * @param body
   * @param file
   * @returns
   */
  @Patch(apiPath.common.importCsvData)
  @UseInterceptors(FileInterceptor('file'))
  async importCsvData(
    @Body() body: ImportCsvDataReq,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImportCsvDataResp> {
    const result = await this.commonService.importCsvData(file, body);

    return result;
  }

  /**
   * 匯出 Csv 資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.common.exportCsvData)
  @ApiOperation({
    summary: '匯出 Csv 資料'
  })
  async exportCsvData(
    @Body() body: ExportCsvDataDto
  ): Promise<Record<string, never>> {
    const result = await this.commonService.exportCsvData(body);

    return result;
  }

  /**
   * 匯入通知
   * @param file
   * @returns
   */
  @Post(apiPath.common.importNotification)
  @UseInterceptors(FileInterceptor('file'))
  async importNotification(
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ id }> {
    const result = await this.commonService.importNotification(file);

    return result;
  }
}
