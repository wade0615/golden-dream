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
import {
  DelCouponSendDetailDto,
  DelCouponSettingDetailDto,
  DownloadCouponSendExampleResp,
  ExchangeCouponDto,
  ExchangeCouponResp,
  GetAboutToExpiredCouponDto,
  GetAboutToExpiredCouponResp,
  GetCouponDetailDto,
  GetCouponDetailResp,
  GetCouponSearchDto,
  GetCouponSearchResp,
  GetCouponSendDetailDto,
  GetCouponSendDetailResp,
  GetCouponSendListDto,
  GetCouponSendListResp,
  GetCouponSettingDetailDto,
  GetCouponSettingDetailResp,
  GetCouponSettingListDto,
  GetCouponSettingListResp,
  GetMemberCouponCodeDto,
  GetMemberCouponCodeResp,
  GetMemberCouponDetailDto,
  GetMemberCouponDetailResp,
  GetMemberCouponListDto,
  GetMemberCouponListResp,
  GiveMemberCouponDto,
  UpdCouponSendDetailDto
} from './Dto';
import {
  GetCouponDetailListDto,
  GetCouponDetailListResp
} from './Dto/get.coupon.detail.list.dto';
import {
  GetMemberCouponDetailListDto,
  GetMemberCouponDetailListResp
} from './Dto/get.member.coupon.detail.list.dto';
import {
  GetMemberCouponDetailByRedeemIdDto,
  GetMemberCouponDetailByRedeemIdResp
} from './Dto/get.member.coupon.detail.redeem.id.dto';
import {
  GetPosMemberCouponDetailDto,
  GetPosMemberCouponDetailResp
} from './Dto/get.pos.member.coupon.detail.dto';
import { RefundCouponDetailDto } from './Dto/refund.coupon.detail.dto';
import { UpdCouponSettingDetailDto } from './Dto/upd.coupon.setting.detail.dto';
import { WriteOffCouponDetailDto } from './Dto/write.off.coupon.detail.dto';
import { WriteOffPosCouponDetailDto } from './Dto/write.off.pos.coupon.detail.dto';
import { CouponService } from './coupon.service';

@ApiTags('coupon')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'coupon'
})
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  /**
   * 取得兌換券設定列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getCouponSettingList)
  @ApiOperation({
    summary: '取得兌換券設定列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回兌換券設定列表.',
    type: GetCouponSettingListResp
  })
  async getCouponSettingList(
    @Body() body: GetCouponSettingListDto
  ): Promise<GetCouponSettingListResp> {
    const result = await this.couponService.getCouponSettingList(body);

    return result;
  }

  /**
   * 取得兌換券設定詳細資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getCouponSettingDetail)
  @ApiOperation({
    summary: '取得兌換券設定詳細資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回兌換券設定詳細資料',
    type: GetCouponSettingDetailResp
  })
  async getCouponSettingDetail(
    @Body() body: GetCouponSettingDetailDto
  ): Promise<GetCouponSettingDetailResp> {
    const result = await this.couponService.getCouponSettingDetail(body);

    return result;
  }

  /**
   * 修改兌換券詳細資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.updCouponSettingDetail)
  @ApiOperation({
    summary: '修改兌換券詳細資料'
  })
  @ApiCreatedResponse()
  async updCouponSettingDetail(
    @Body() body: UpdCouponSettingDetailDto
  ): Promise<Record<string, never>> {
    await this.couponService.updCouponSettingDetail(body);

    return {};
  }

  /**
   * 刪除兌換券詳細資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.delCouponSettingDetail)
  @ApiOperation({
    summary: '刪除兌換券詳細資料'
  })
  @ApiCreatedResponse()
  async delCouponSettingDetail(
    @Body() body: DelCouponSettingDetailDto
  ): Promise<Record<string, never>> {
    await this.couponService.delCouponSettingDetail(body);

    return {};
  }

  /**
   * 取得兌換券發放列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getCouponSendList)
  @ApiOperation({
    summary: '取得兌換券發放列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回兌換券發放列表',
    type: GetCouponSendListResp
  })
  async getCouponSendList(
    @Body() body: GetCouponSendListDto
  ): Promise<GetCouponSendListResp> {
    const result = await this.couponService.getCouponSendList(body);

    return result;
  }

  /**
   * 取得兌換券發放詳細資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getCouponSendDetail)
  @ApiOperation({
    summary: '取得兌換券發放詳細資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得兌換券發放詳細資料',
    type: GetCouponSendDetailResp
  })
  async getCouponSendDetail(
    @Body() body: GetCouponSendDetailDto
  ): Promise<GetCouponSendDetailResp> {
    const result = await this.couponService.getCouponSendDetail(body);

    return result;
  }

  /**
   * 修改兌換券發放詳細資料
   *
   * @param body
   * @returns
   */
  @Patch(apiPath.coupon.updCouponSendDetail)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '修改兌換券發放詳細資料'
  })
  @ApiCreatedResponse()
  async updCouponSendDetail(
    @UploadedFile() file: Express.Multer.File,
    @Headers() headers: any,
    @Body() body: UpdCouponSendDetailDto
  ): Promise<Record<string, never>> {
    const userId = headers['authMemberId'];
    await this.couponService.updCouponSendDetail(file, body, userId);

    return {};
  }

  /**
   * 刪除兌換券發放詳細資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.delCouponSendDetail)
  @ApiOperation({
    summary: '刪除兌換券發放詳細資料'
  })
  @ApiCreatedResponse()
  async delCouponSendDetail(
    @Body() body: DelCouponSendDetailDto
  ): Promise<Record<string, never>> {
    await this.couponService.delCouponSendDetail(body);

    return {};
  }

  /**
   * 依兌換券編碼會員兌換券資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getMemberCouponDetailByRedeemId)
  @ApiOperation({
    summary: '依兌換券編碼會員兌換券資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回兌換券資料',
    type: GetMemberCouponDetailByRedeemIdResp
  })
  async getMemberCouponDetailByRedeemId(
    @Body() body: GetMemberCouponDetailByRedeemIdDto
  ): Promise<GetMemberCouponDetailByRedeemIdResp> {
    const result = await this.couponService.getMemberCouponDetailByRedeemId(
      body
    );

    return result;
  }

  /**
   * 核銷兌換券
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.writeOffCouponDetail)
  @ApiOperation({
    summary: '核銷兌換券'
  })
  @ApiCreatedResponse()
  async writeOffCouponDetail(
    @Body() body: WriteOffCouponDetailDto
  ): Promise<Record<string, never>> {
    await this.couponService.writeOffCouponDetail(body);

    return {};
  }

  /**
   * 取得兌換券明細列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getCouponDetailList)
  @ApiOperation({
    summary: '取得兌換券明細列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回兌換券明細列表',
    type: GetCouponDetailListResp
  })
  async getCouponDetailList(
    @Body() body: GetCouponDetailListDto
  ): Promise<GetCouponDetailListResp> {
    const result = await this.couponService.getCouponDetailList(body);

    return result;
  }

  /**
   * 退貨兌換券
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.refundCouponDetail)
  @ApiOperation({
    summary: '退貨兌換券'
  })
  @ApiCreatedResponse()
  async refundCouponDetail(
    @Body() body: RefundCouponDetailDto
  ): Promise<Record<string, never>> {
    await this.couponService.refundCouponDetail(body);

    return {};
  }

  /**
   * 匯出兌換券明細列表
   *
   * @param res
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.exportCouponDetailList)
  @ApiOperation({
    summary: '匯出兌換券明細列表'
  })
  @ApiCreatedResponse()
  async exportMemberList(
    @Res() res: Response,
    @Body() body: GetCouponDetailListDto
  ) {
    await this.couponService.exportCouponDetailList(res, body);

    return {};
  }

  /**
   * 取得會員兌換券明細列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getMemberCouponDetailList)
  @ApiOperation({
    summary: '取得會員兌換券明細列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回會員兌換券明細列表',
    type: GetMemberCouponDetailListResp
  })
  async getMemberCouponDetailList(
    @Body() body: GetMemberCouponDetailListDto
  ): Promise<GetMemberCouponDetailListResp> {
    const result = await this.couponService.getMemberCouponDetailList(body);

    return result;
  }

  /**
   * 下載兌換券發放選擇會員範本
   *
   * @param res
   * @returns
   */
  @Get(apiPath.coupon.downloadCouponSendExample)
  async downloadCouponSendExample(
    @Res() res: Response
  ): Promise<DownloadCouponSendExampleResp> {
    const result = await this.couponService.downloadCouponSendExample(res);

    return result;
  }

  /**
   * 取得會員票券列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getMemberCouponList)
  async getMemberCouponList(
    @Body() body: GetMemberCouponListDto
  ): Promise<GetMemberCouponListResp> {
    const result = await this.couponService.getMemberCouponList(body);

    return result;
  }

  /**
   * 取得會員票券詳情
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getMemberCouponDetail)
  async getMemberCouponDetail(
    @Body() body: GetMemberCouponDetailDto
  ): Promise<GetMemberCouponDetailResp> {
    const result = await this.couponService.getMemberCouponDetail(body);

    return result;
  }

  /**
   * 取得票券兌換碼
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getMemberCouponCode)
  async getMemberCouponCode(
    @Body() body: GetMemberCouponCodeDto
  ): Promise<GetMemberCouponCodeResp> {
    const result = await this.couponService.getMemberCouponCode(body);

    return result;
  }

  /**
   * 取得即將到期票券數量
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getAboutToExpiredCoupon)
  async getAboutToExpiredCoupon(
    @Body() body: GetAboutToExpiredCouponDto
  ): Promise<GetAboutToExpiredCouponResp> {
    const result = await this.couponService.getAboutToExpiredCoupon(body);

    return result;
  }

  /**
   * 轉贈票券
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.giveMemberCoupon)
  async giveMemberCoupon(
    @Body() body: GiveMemberCouponDto
  ): Promise<Record<string, never>> {
    const result = await this.couponService.giveMemberCoupon(body);

    return result;
  }

  /**
   * 取得優惠券列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getCouponSearch)
  async getCouponSearch(
    @Body() body: GetCouponSearchDto
  ): Promise<GetCouponSearchResp> {
    const result = await this.couponService.getCouponSearch(body);

    return result;
  }

  /**
   * 優惠券詳情
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getCouponDetail)
  async getCouponDetail(
    @Body() body: GetCouponDetailDto
  ): Promise<GetCouponDetailResp> {
    const result = await this.couponService.getCouponDetail(body);

    return result;
  }

  /**
   * 兌換優惠券
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.exchangeCoupon)
  async exchangeCoupon(
    @Body() body: ExchangeCouponDto
  ): Promise<ExchangeCouponResp> {
    const result = await this.couponService.exchangeCoupon(body);

    return result;
  }

  /**
   * [POS] 取得會員票券詳情
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.getPosMemberCouponDetail)
  async getPosMemberCouponDetail(
    @Body() body: GetPosMemberCouponDetailDto
  ): Promise<GetPosMemberCouponDetailResp> {
    const result = await this.couponService.getPosMemberCouponDetail(body);

    return result;
  }

  /**
   * [POS] 核銷會員票券
   *
   * @param body
   * @returns
   */
  @Post(apiPath.coupon.writeOffPosCouponDetail)
  async writeOffPosCouponDetail(
    @Body() body: WriteOffPosCouponDetailDto
  ): Promise<Record<string, never>> {
    await this.couponService.writeOffPosCouponDetail(body);

    return {};
  }
}
