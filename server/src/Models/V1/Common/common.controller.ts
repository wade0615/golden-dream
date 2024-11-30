import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
  VERSION_NEUTRAL
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';
// import { RedisService } from 'src/Providers/Database/Redis/redis.service';
// import { DelRedisKey } from './Dto/del.redis.key.dto';
// import { SetRedisKey } from './Dto/set.redis.data.dto';
import { UploadImageDto, UploadImageResp } from './Dto/upload.image.dto';
import { CommonService } from './common.service';

@ApiTags('common')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'common'
})
export class CommonController {
  constructor(
    // private readonly redisService: RedisService,
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
    // await this.commonService.updateCodeCenter();

    return {};
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

  // @Post(apiPath.common.getRedisKeys)
  // async getRedisKeys() {
  //   const result = await this.redisService.scan();

  //   return result;
  // }

  // @Post(apiPath.common.delRedisKey)
  // async delRedisKey(@Body() body: DelRedisKey): Promise<Record<string, never>> {
  //   await this.redisService.delCacheData(body.key);

  //   return {};
  // }

  // @Post(apiPath.common.setRedisData)
  // async setRedisData(
  //   @Body() body: SetRedisKey
  // ): Promise<Record<string, never>> {
  //   const isExpired = body.ttl ? true : false;

  //   await this.redisService.setCacheData(
  //     body.key,
  //     body.data,
  //     body.ttl,
  //     isExpired
  //   );

  //   return {};
  // }

  /**
   * 取得側邊欄小卡資訊
   * @returns
   */
  @Get(apiPath.common.getAsideCardDetail)
  async getAsideCardDetail(): Promise<{
    postCount: number;
    categoriesCount: number;
  }> {
    const result = await this.commonService.getAsideCardDetail();

    return result;
  }
}
