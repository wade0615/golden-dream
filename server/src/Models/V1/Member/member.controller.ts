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
  UsePipes,
  VERSION_NEUTRAL
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import apiPath from 'src/Center/api.path';
import { GlobalDTOValidationPipe } from 'src/Global/Pipes/global.dto.validation.pipe';
import {
  AddMemberDetailDto,
  ChkUploadMemberMobileResp,
  GetMemberCommonDataDto,
  GetMemberCommonDataResp,
  GetMemberDetailDto,
  GetMemberDetailResp,
  GetMemberListDto,
  GetMemberListResp,
  GetMemberSpecialTypeMenuDto,
  GetMemberSpecialTypeMenuResp,
  ResendSmsMessage,
  UpdBatchMemberSpecialTypeDto,
  UpdMemberDetailDto,
  UpdMemberSpecialDetailDto,
  UpdateMemberPassword
} from 'src/Models/V1/Member/Dto';
import { DelMemberSpecialDetailDto } from './Dto/del.member.special.detail.dto';
import { DownloadMemberSpecialTypeExampleResp } from './Dto/download.member.special.type.example.dto';
import {
  GetBonusHistoryDto,
  GetBonusHistoryResp
} from './Dto/get.bonus.history.dto';
import {
  GetMemberBookingLogDto,
  GetMemberBookingLogResp
} from './Dto/get.member.booking.log.dto';
import {
  GetMemberDetailByMobileDto,
  GetMemberDetailByMobileResp
} from './Dto/get.member.detail.mobile.dto';
import {
  GetMemberDetailReferrerCodeDto,
  GetMemberDetailReferrerCodeResp
} from './Dto/get.member.detail.referrer.code.dto';
import {
  GetMemberEcVoucherInfoDto,
  GetMemberEcVoucherInfoResp
} from './Dto/get.member.ec.voucher.info.dto.';
import {
  GetMemberEcVoucherLogDto,
  GetMemberEcVoucherLogResp
} from './Dto/get.member.ec.voucher.log.dto';
import {
  GetMemberPointLogDto,
  GetMemberPointLogResp
} from './Dto/get.member.point.log.dto';
import {
  GetMemberShipLogDto,
  GetMemberShipLogResp
} from './Dto/get.member.ship.log.dto';
import { GetMemberSpecialListResp } from './Dto/get.member.special.list.dto';
import {
  GetOverviewAnalysisDto,
  GetOverviewAnalysisResp
} from './Dto/get.overview.analysis.dto';
import { UpdMemberSpecialRankDto } from './Dto/upd.member.special.rank.dto';
import { GetMemberBonusResp } from './Interface/get.member.bonus.interface';
import { GetPointFilterOptionsResp } from './Interface/get.point.filter.options.interface';
import { MemberService } from './member.service';

@ApiTags('member')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'member'
})
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  /**
   * 取得會員特殊類型選單
   *
   * @returns
   */
  @Post(apiPath.member.getMemberSpecialTypeMenu)
  @ApiOperation({
    summary: '取得會員特殊類型下拉式選單'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回會員特殊類型下拉式選單.',
    type: GetMemberSpecialTypeMenuResp
  })
  async getMemberSpecialTypeMenu(
    @Body() body: GetMemberSpecialTypeMenuDto
  ): Promise<GetMemberSpecialTypeMenuResp> {
    const result = await this.memberService.getMemberSpecialTypeMenu(body);

    return result;
  }

  /**
   * 取得會員基本資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.getMemberDetail)
  @ApiOperation({
    summary: '取得會員基本資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回會員基本資料.',
    type: GetMemberDetailResp
  })
  async getMemberDetail(
    @Body() body: GetMemberDetailDto
  ): Promise<GetMemberDetailResp> {
    const user = await this.memberService.getMemberDetail(body);

    return user;
  }

  /**
   * 取得會員列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.getMemberList)
  @ApiOperation({
    summary: '取得會員列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回會員列表.',
    type: GetMemberListResp
  })
  async getMemberList(
    @Body() body: GetMemberListDto
  ): Promise<GetMemberListResp> {
    const memberList = await this.memberService.getMemberList(body);

    return memberList;
  }

  /**
   * 取得會員共用資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.getMemberCommonData)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: '取得會員共用資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回會員共用資料.',
    type: GetMemberCommonDataResp
  })
  async getMemberCommonData(
    @Body() body: GetMemberCommonDataDto
  ): Promise<GetMemberCommonDataResp> {
    const result = await this.memberService.getMemberCommonData(body);

    return result;
  }

  /**
   * 新增會員
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.addMemberDetail)
  @ApiOperation({
    summary: '新增會員詳細資料'
  })
  @ApiCreatedResponse()
  async addMemberDetail(
    @Body() body: AddMemberDetailDto
  ): Promise<Record<string, never>> {
    await this.memberService.addMemberDetail(body);

    return {};
  }

  /**
   * 更新會員詳細資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.updMemberDetail)
  @ApiOperation({
    summary: '更新會員詳細資料'
  })
  @ApiCreatedResponse()
  async updMemberDetail(
    @Body() body: UpdMemberDetailDto
  ): Promise<Record<string, never>> {
    await this.memberService.updMemberDetail(body);

    return {};
  }

  /**
   * 取得特殊會員類型列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.getMemberSpecialList)
  @ApiOperation({
    summary: '取得會員特殊類型列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回會員特殊類型列表.',
    type: GetMemberSpecialListResp
  })
  async getMemberSpecialList(): Promise<GetMemberSpecialListResp[]> {
    const result = await this.memberService.getMemberSpecialList();

    return result;
  }

  /**
   * 修改特殊會員類型排序
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.updMemberSpecialRank)
  @ApiOperation({
    summary: '修改特殊會員類型順序'
  })
  @ApiCreatedResponse()
  async updMemberSpecialRank(
    @Body() body: UpdMemberSpecialRankDto
  ): Promise<Record<string, never>> {
    await this.memberService.updMemberSpecialRank(body);

    return {};
  }

  /**
   * 修改特殊會員類型詳細資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.updMemberSpecialDetail)
  @ApiOperation({
    summary: '修改特殊會員類型詳細資料'
  })
  @ApiCreatedResponse()
  async updMemberSpecialDetail(
    @Body() body: UpdMemberSpecialDetailDto
  ): Promise<Record<string, never>> {
    await this.memberService.updMemberSpecialDetail(body);

    return {};
  }

  /**
   * 刪除特殊會員類型
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.delMemberSpecialDetail)
  @ApiOperation({
    summary: '刪除特殊會員類型'
  })
  @ApiCreatedResponse()
  async delMemberSpecialDetail(
    @Body() body: DelMemberSpecialDetailDto
  ): Promise<Record<string, never>> {
    await this.memberService.delMemberSpecialDetail(body);

    return {};
  }

  /**
   * 檢查 Csv 手機國碼與手機號碼
   *
   * @returns
   */
  @Patch(apiPath.member.chkUploadMemberMobile)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '檢查 Csv 手機國碼與手機號碼'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回 Csv 手機國碼與手機號碼.',
    type: ChkUploadMemberMobileResp
  })
  async chkUploadMemberMobile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ChkUploadMemberMobileResp> {
    const mobileCsv = await this.memberService.chkUploadMobileCsv(file);

    const result = <ChkUploadMemberMobileResp>{};
    result.csvTempTableName = mobileCsv.csvTempTableName;
    result.totalCount = mobileCsv.totalCount;
    result.urls = mobileCsv.urls;

    return result;
  }

  /**
   * 批量儲存特殊會員類型
   *
   * @param body
   * @returns
   */
  @Patch(apiPath.member.updBatchMemberSpecialType)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '批量儲存特殊會員類型'
  })
  @ApiCreatedResponse()
  async updBatchMemberSpecialType(
    @Body() body: UpdBatchMemberSpecialTypeDto,
    @Headers() headers: any,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Record<string, never>> {
    const userId = headers['authMemberId'];
    await this.memberService.updBatchMemberSpecialType(body, file, userId);

    return {};
  }

  /**
   * 下載特殊會員類型範本
   *
   * @returns
   */
  @Get(apiPath.member.downloadMemberSpecialTypeExample)
  @ApiOperation({
    summary: '下載 CSV 特殊會員類型範本'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回特殊會員類型 CSV 範本.',
    type: DownloadMemberSpecialTypeExampleResp
  })
  async downloadMemberSpecialTypeExample(
    @Res() res: Response
  ): Promise<DownloadMemberSpecialTypeExampleResp> {
    const result = await this.memberService.downloadMemberSpecialTypeExample(
      res
    );

    return result;
  }

  /**
   * 依手機號碼取得會員資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.getMemberDetailByMobile)
  @ApiOperation({
    summary: '依手機號碼取得會員資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回會員詳細資料',
    type: GetMemberDetailByMobileResp
  })
  async getMemberDetailByMobile(
    @Body() body: GetMemberDetailByMobileDto
  ): Promise<GetMemberDetailByMobileResp> {
    const result = await this.memberService.getMemberDetailByMobile(body);

    return result;
  }

  /**
   * 後台重置密碼
   *
   * @returns
   */
  @Post(apiPath.member.updateMemberPassword)
  @ApiOperation({
    summary: '後台用設定會員密碼'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '後台用設定會員密碼.',
    type: UpdateMemberPassword
  })
  async resetPassword(
    @Body() body: UpdateMemberPassword
  ): Promise<Record<string, never>> {
    await this.memberService.resetPassword(body);

    return {};
  }

  /**
   * 重新發送驗證碼
   *
   * @returns
   */
  @Post(apiPath.member.resendSms)
  @ApiOperation({
    summary: '重新發送驗證碼'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '重新發送驗證碼.',
    type: ResendSmsMessage
  })
  async resendSms(
    @Body() body: ResendSmsMessage
  ): Promise<Record<string, never>> {
    const data = await this.memberService.resendSms(body);

    return data;
  }

  /**
   * 依推薦碼取得會員詳細資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.getMemberDetailByReferrerCode)
  @ApiOperation({
    summary: '依推薦碼取得會員詳細資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回會員詳細資料',
    type: GetMemberDetailReferrerCodeResp
  })
  async getMemberDetailByReferrerCode(
    @Body() body: GetMemberDetailReferrerCodeDto
  ): Promise<GetMemberDetailReferrerCodeResp> {
    const result = await this.memberService.getMemberDetailByReferrerCode(body);

    return result;
  }

  /**
   * 取得會員積點歷程下單選項
   * @param body
   * @returns
   */
  @Get(apiPath.member.getMemberPointFilterOptions)
  @ApiOperation({
    summary: '取得會員積點歷程下單選項'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得會員積點歷程下單選項'
  })
  async getMemberPointFilterOptions(): Promise<GetPointFilterOptionsResp> {
    const result = await this.memberService.getMemberPointFilterOptions();

    return result;
  }

  /**
   * 取得會員積點歷程
   * @param body
   * @returns
   */
  @Post(apiPath.member.getMemberPointLog)
  @ApiOperation({
    summary: '取得會員積點歷程'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得會員積點歷程.',
    type: GetMemberPointLogResp
  })
  async getMemberPointLog(
    @Body() body: GetMemberPointLogDto
  ): Promise<GetMemberPointLogResp> {
    const user = await this.memberService.getMemberPointLog(body);

    return user;
  }

  /**
   * 取得會員會籍歷程
   * @param body
   * @returns
   */
  @Post(apiPath.member.getMemberShipLog)
  @ApiOperation({
    summary: '取得會員會籍歷程'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得會員會籍歷程.',
    type: GetMemberPointLogResp
  })
  async getMemberShipLog(
    @Body() body: GetMemberShipLogDto
  ): Promise<GetMemberShipLogResp> {
    const user = await this.memberService.getMemberShipLog(body);

    return user;
  }

  /**
   * 取得會員訂位資訊
   * @param body
   * @returns
   */
  @Post(apiPath.member.getMemberBookingLog)
  @ApiOperation({
    summary: '取得會員訂位資訊'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得會員訂位資訊.',
    type: GetMemberBookingLogResp
  })
  async getMemberBookingLog(
    @Body() body: GetMemberBookingLogDto
  ): Promise<GetMemberBookingLogResp> {
    const user = await this.memberService.getMemberBookingLog(body);

    return user;
  }

  /**
   * 取得會員電子票卷紀錄
   * @param body
   * @returns
   */
  @Post(apiPath.member.getMemberEcVoucherLog)
  @ApiOperation({
    summary: '取得會員電子票卷紀錄'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得會員電子票卷紀錄.',
    type: GetMemberEcVoucherLogResp
  })
  async getMemberEcVoucherLog(
    @Body() body: GetMemberEcVoucherLogDto
  ): Promise<GetMemberEcVoucherLogResp> {
    const user = await this.memberService.getMemberEcVoucherLog(body);

    return user;
  }

  /**
   * 取得會員電子票卷詳細資料
   * @param body
   * @returns
   */
  @Post(apiPath.member.getMemberEcVoucherInfo)
  @ApiOperation({
    summary: '取得會員電子票卷詳細資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得會員電子票卷詳細資料.',
    type: GetMemberEcVoucherInfoResp
  })
  async getMemberEcVoucherInfo(
    @Body() body: GetMemberEcVoucherInfoDto
  ): Promise<GetMemberEcVoucherInfoResp> {
    const { id } = body;
    const user = await this.memberService.getMemberEcVoucherInfo(id);

    return user;
  }

  /**
   * 取得會員紅利資料(OAuth)
   * @param body
   * @returns
   */
  @Post(apiPath.member.getMemberBonus)
  @ApiOperation({
    summary: '取得會員紅利資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得會員紅利資料.',
    type: GetMemberPointLogResp
  })
  async getMemberBonus(
    @Body() body: GetMemberDetailDto
  ): Promise<GetMemberBonusResp> {
    const { memberId } = body;
    const user = await this.memberService.getMemberBonus(memberId);

    return user;
  }

  /**
   * 取得紅利點數紀錄
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.getBonusHistory)
  async getBonusHistory(
    @Body() body: GetBonusHistoryDto
  ): Promise<GetBonusHistoryResp> {
    const result = await this.memberService.getBonusHistory(body);

    return result;
  }

  /**
   * 取得會員總覽分析
   *
   * @param body
   * @returns
   */
  @Post(apiPath.member.getOverviewAnalysis)
  @ApiOperation({
    summary: '取得會員總覽分析'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回會員總覽分析資料.',
    type: GetOverviewAnalysisResp
  })
  async getOverviewAnalysis(
    @Body() body: GetOverviewAnalysisDto
  ): Promise<GetOverviewAnalysisResp> {
    const result = await this.memberService.getOverviewAnalysis(body);

    return result;
  }
}
