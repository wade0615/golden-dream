import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  VERSION_NEUTRAL
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import apiPath from 'src/Center/api.path';
import { AddOrderDetailDto } from './Dto/add.order.detail.dto';
import {
  GetMemberOrderDataDto,
  GetMemberOrderDataResp
} from './Dto/get.member.order.data.dto';
import {
  GetMemberOrderLogDto,
  GetMemberOrderLogResp
} from './Dto/get.member.order.log.dto';
import {
  GetOrderDetailDto,
  GetOrderDetailResp
} from './Dto/get.order.detail.dto';
import {
  GetOrderDetailByTransactionIdDto,
  GetOrderDetailByTransactionIdResp
} from './Dto/get.order.detail.transaction.dto';
import {
  GetOrderExportListDto,
  GetOrderExportListResp
} from './Dto/get.order.export.list.dto';
import { GetOrderLogDto, GetOrderLogResp } from './Dto/get.order.log.dto';
import { GetPointLogDto, GetPointLogResp } from './Dto/get.point.log.dto';
import { ReturnCouponDetailDto } from './Dto/return.coupon.detail.dto';
import { GetPointLogFilterOptionsResp } from './Interface/get.point.log.filter.options.interface';
import { OrderService } from './order.service';

@ApiTags('order')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'order'
})
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 取得消費記錄
   *
   * @param body
   * @returns
   */
  @Post(apiPath.order.getOrderLog)
  @ApiOperation({
    summary: '取得訂單記錄'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回訂單記錄列表.',
    type: GetOrderLogResp
  })
  async getOrderLog(@Body() body: GetOrderLogDto): Promise<GetOrderLogResp> {
    const result = await this.orderService.getOrderLog(body);

    return result;
  }

  /**
   * 取得會員消費紀錄
   *
   * @param body
   * @returns
   */
  @Post(apiPath.order.getMemberOrderLog)
  @ApiOperation({
    summary: '取得會員訂單記錄'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回會員訂單記錄.',
    type: GetMemberOrderLogResp
  })
  async getMemberOrderLog(
    @Body() body: GetMemberOrderLogDto
  ): Promise<GetMemberOrderLogResp> {
    const result = await this.orderService.getMemberOrderLog(body);

    return result;
  }

  /**
   * 訂單詳情
   *
   * @param body
   * @returns
   */
  @Post(apiPath.order.getOrderDetail)
  @ApiOperation({
    summary: '取得訂單詳情'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回訂單詳情資料.',
    type: GetOrderDetailResp
  })
  async getOrderDetail(
    @Body() body: GetOrderDetailDto
  ): Promise<GetOrderDetailResp> {
    const result = await this.orderService.getOrderDetail(body);

    return result;
  }

  /**
   * 補登消費紀錄
   *
   * @param body
   * @returns
   */
  @Post(apiPath.order.addOrderDetail)
  @ApiOperation({
    summary: '補登訂單資料'
  })
  @ApiCreatedResponse()
  async addOrderDetail(
    @Body() body: AddOrderDetailDto
  ): Promise<Record<string, never>> {
    await this.orderService.addOrderDetail(body);

    return {};
  }

  /**
   * 依交易編號取得訂單詳情
   *
   * @param body
   * @returns
   */
  @Post(apiPath.order.getOrderDetailByTransactionId)
  @ApiOperation({
    summary: '依交易編號取得訂單詳情'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回訂單詳情資料.',
    type: GetOrderDetailByTransactionIdResp
  })
  async getOrderDetailByTransactionId(
    @Body() body: GetOrderDetailByTransactionIdDto
  ): Promise<GetOrderDetailByTransactionIdResp> {
    const result = await this.orderService.getOrderDetailByTransactionId(body);

    return result;
  }

  /**
   * 優惠券商品券退貨
   * @param body
   * @returns
   */
  @Post(apiPath.order.returnCoupon)
  @ApiOperation({
    summary: '優惠券商品券退貨'
  })
  @ApiCreatedResponse()
  async returnCoupon(
    @Body() body: ReturnCouponDetailDto
  ): Promise<Record<string, never>> {
    const { couponId, iam } = body;
    const { authMemberId } = iam;
    await this.orderService.returnCoupon(couponId, authMemberId);

    return {};
  }

  /**
   * 取得積點明細列表
   * @param body
   * @returns
   */
  @Post(apiPath.order.getPointLog)
  @ApiOperation({
    summary: '取得積點明細列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得積點明細列表',
    type: GetPointLogResp
  })
  async getPointLog(@Body() body: GetPointLogDto): Promise<GetPointLogResp> {
    const result = await this.orderService.getPointLog(body);

    return result;
  }

  /**
   * 積點明細下拉篩選資料
   * @param body
   * @returns
   */
  @Get(apiPath.order.getPointLogFilterOptions)
  @ApiOperation({
    summary: '積點列表篩選資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '積點列表篩選資料'
  })
  async getPointLogFilterOptions(): Promise<GetPointLogFilterOptionsResp> {
    const result = await this.orderService.getPointLogFilterOptions();

    return result;
  }

  /**
   * 匯出積點明細
   * @param body
   * @returns
   */
  @Post(apiPath.order.exportPointLog)
  @ApiOperation({
    summary: '匯出積點明細'
  })
  async exportPointLog(@Res() res: Response, @Body() body: GetPointLogDto) {
    await this.orderService.exportPointLog(res, body);

    return {};
  }

  /**
   * 取得交易匯出資料列表
   *
   * @param body
   * @returns
   */
  @Post(apiPath.order.getOrderExportList)
  @ApiOperation({
    summary: '取得匯出資料列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '返回匯出資料列表',
    type: GetOrderExportListResp
  })
  async getOrderExportList(
    @Body() body: GetOrderExportListDto
  ): Promise<GetOrderExportListResp> {
    const result = await this.orderService.getOrderExportList(body);

    return result;
  }

  /**
   * 取得會員消費資料
   *
   * @param body
   * @returns
   */
  @Post(apiPath.order.getMemberOrderData)
  async getMemberOrderData(
    @Body() body: GetMemberOrderDataDto
  ): Promise<GetMemberOrderDataResp> {
    const result = await this.orderService.getMemberOrderData(body);

    return result;
  }
}
