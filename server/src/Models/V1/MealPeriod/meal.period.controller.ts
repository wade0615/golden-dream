import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  VERSION_NEUTRAL
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';
import {
  AddMealPeriodDto,
  DelMealPeriodDto,
  GetMealPeriodListDto,
  SortMealPeriodDto,
  UpdMealPeriodDto
} from './Dto';
import { MealPeriodService } from './meal.period.service';

@ApiTags('meal')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'meal'
})
export class MealPeriodController {
  constructor(private readonly mealPeriodService: MealPeriodService) {}

  /**
   * 取得餐期列表
   * @param body
   * @returns
   */
  @Get(apiPath.meal.getMealPeriodList)
  @ApiOperation({
    summary: '取得餐期列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '取得餐期列表成功！',
    type: GetMealPeriodListDto
  })
  async getPOSMealPeriodList(): Promise<GetMealPeriodListDto[]> {
    const result = await this.mealPeriodService.getPOSMealPeriodList();

    return result;
  }

  /**
   * 新增餐期
   * @param body
   * @returns
   */
  @Post(apiPath.meal.addMealPeriodSetting)
  @ApiOperation({
    summary: '建立餐期'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '更新餐期成功！'
  })
  async addPOS_MealPeriod(
    @Body() body: AddMealPeriodDto
  ): Promise<Record<string, never>> {
    const result = await this.mealPeriodService.addPOSMealPeriod(body);

    return result;
  }

  /**
   * 刪除餐期餐期
   * @param body
   * @returns
   */
  @Delete(apiPath.meal.delMealPeriodSetting)
  @ApiOperation({
    summary: '刪除餐期'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '刪除餐期成功！'
  })
  async getStoreList(
    @Body() body: DelMealPeriodDto
  ): Promise<Record<string, never>> {
    const result = await this.mealPeriodService.deletePOSMealPeriod(body);

    return result;
  }

  /**
   * 修改餐期資料
   * @param body
   * @returns
   */
  @Post(apiPath.meal.updateMealPeriodSetting)
  @ApiOperation({
    summary: '修改餐期資料'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '更新餐期成功'
  })
  async updStoreDetail(
    @Body() body: UpdMealPeriodDto
  ): Promise<Record<string, never>> {
    await this.mealPeriodService.updatePOSMealPeriod(body);

    return {};
  }

  /**
   * 修改餐期排序
   *
   * @param body
   * @returns
   */
  @Post(apiPath.meal.updMealPeriodSort)
  @ApiOperation({
    summary: '修改餐期排序'
  })
  async updChannelSort(
    @Body() body: SortMealPeriodDto
  ): Promise<Record<string, never>> {
    await this.mealPeriodService.updatePOSort(body);
    return {};
  }
}
