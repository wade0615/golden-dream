import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import apiPath from 'src/Center/api.path';
import {
  AddPaymentDto,
  DelPaymentDto,
  GetPaymentListDto,
  SortPaymentDto,
  UpdPaymentDto,
} from './Dto';
import { PaymentService } from './payment.service';

@ApiTags('payment')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'payment',
})
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * 取得付款方式列表
   * @param body
   * @returns
   */
  @Get(apiPath.payment.getPaymentList)
  @ApiOperation({
    summary: '取得付款方式列表',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得付款方式列表成功！',
    type: GetPaymentListDto,
  })
  async getPOSPaymentList(): Promise<GetPaymentListDto> {
    const result = await this.paymentService.getPaymentList();

    return result;
  }

  /**
   * 新增付款方式
   * @param body
   * @returns
   */
  @Post(apiPath.payment.addPaymentSetting)
  @ApiOperation({
    summary: '建立付款方式',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '更新付款方式成功！',
  })
  async addPOS_Payment(
    @Body() body: AddPaymentDto,
  ): Promise<Record<string, never>> {
    const result = await this.paymentService.addPayment(body);

    return result;
  }

  /**
   * 刪除付款方式付款方式
   * @param body
   * @returns
   */
  @Delete(apiPath.payment.delPaymentSetting)
  @ApiOperation({
    summary: '刪除付款方式',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '刪除付款方式成功！',
  })
  async getStoreList(
    @Body() body: DelPaymentDto,
  ): Promise<Record<string, never>> {
    const result = await this.paymentService.deletePayment(body);

    return result;
  }

  /**
   * 修改付款方式資料
   * @param body
   * @returns
   */
  @Post(apiPath.payment.updatePaymentSetting)
  @ApiOperation({
    summary: '修改付款方式資料',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '更新付款方式成功',
  })
  async updStoreDetail(
    @Body() body: UpdPaymentDto,
  ): Promise<Record<string, never>> {
    await this.paymentService.updatePayment(body);

    return {};
  }

  /**
   * 修改付款方式排序
   *
   * @param body
   * @returns
   */
  @Post(apiPath.payment.updPaymentSort)
  @ApiOperation({
    summary: '修改付款方式排序',
  })
  async updChannelSort(
    @Body() body: SortPaymentDto,
  ): Promise<Record<string, never>> {
    await this.paymentService.updatePaymentSort(body);
    return {};
  }
}
