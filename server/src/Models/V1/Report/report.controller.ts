import { Body, Controller, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';
import {
  DownloadReportExportDto,
  DownloadReportExportResp
} from './Dto/download.report.export.dto';
import {
  GetReportExportListDto,
  GetReportExportListResp
} from './Dto/get.report.export.list.dto';
import { ReportService } from './report.service';

@ApiTags('report')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'report'
})
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  /**
   * 取得匯出報表列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.report.getReportExportList)
  @ApiOperation({
    summary: '取得報表匯出列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回報表匯出列表.',
    type: GetReportExportListResp
  })
  async getReportExportList(
    @Body() body: GetReportExportListDto
  ): Promise<GetReportExportListResp> {
    const result = await this.reportService.getReportExportList(body);

    return result;
  }

  /**
   * 下載報表匯出檔案
   *
   * @param req
   * @returns
   */
  @Post(apiPath.report.downloadReportExport)
  @ApiOperation({
    summary: '下載報表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回下載報表.',
    type: DownloadReportExportResp
  })
  async downloadReportExport(
    @Body() body: DownloadReportExportDto
  ): Promise<DownloadReportExportResp> {
    const result = await this.reportService.downloadReportExport(body);

    return result;
  }
}
