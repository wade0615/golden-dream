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
import { DownloadHolidayExampleResp } from './Dto/download.holiday.example.dto';
import {
  GetHolidaySettingListDto,
  GetHolidaySettingListResp
} from './Dto/get.holiday.list.dto';
import { UpdBatchHolidaySettingDto } from './Dto/upd.batch.holiday.setting.dto';
import { UploadHolidaySettingResp } from './Dto/upload.holiday.setting.dto';
import { HolidayService } from './holiday.service';

@ApiTags('holiday')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'holiday'
})
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  /**
   * 取得假日設定列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.holiday.getHolidaySettingList)
  @ApiOperation({
    summary: '取得假日設定列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回假日設定列表.',
    type: GetHolidaySettingListResp
  })
  async getHolidaySettingList(
    @Body() body: GetHolidaySettingListDto
  ): Promise<GetHolidaySettingListResp> {
    const result = await this.holidayService.getHolidaySettingList(body);

    return result;
  }

  /**
   * 下載假日設定範本
   *
   * @param res
   * @returns
   */
  @Get(apiPath.holiday.downloadHolidayExample)
  @ApiOperation({
    summary: '下載假日設定範本'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回假日設定範本.',
    type: DownloadHolidayExampleResp
  })
  async downloadHolidayExample(
    @Res() res: Response
  ): Promise<DownloadHolidayExampleResp> {
    const result = await this.holidayService.downloadHolidayExample(res);

    return result;
  }

  /**
   * 匯入 Excel 假日設定資料
   *
   * @param file
   * @returns
   */
  @Patch(apiPath.holiday.uploadHolidaySetting)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '匯入 Excel 假日設定'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回 Excel 假日設定總筆數.',
    type: UploadHolidaySettingResp
  })
  async uploadHolidaySetting(
    @Body() body: UpdBatchHolidaySettingDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<UploadHolidaySettingResp> {
    const result = await this.holidayService.chkUploadHolidaySetting(
      body,
      file
    );

    return result;
  }

  /**
   * 儲存 Excel 假日設定資料
   *
   * @param body
   * @param file
   * @returns
   */
  @Patch(apiPath.holiday.updBatchHolidaySetting)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '儲存 Excel 假日設定'
  })
  @ApiCreatedResponse()
  async updBatchHolidaySetting(
    @Body() body: UpdBatchHolidaySettingDto,
    @Headers() headers: any,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Record<string, never>> {
    const userId = headers['authMemberId'];
    await this.holidayService.updBatchHolidaySetting(body, file, userId);

    return {};
  }
}
