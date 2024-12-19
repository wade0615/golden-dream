import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';

import { CategoryService } from './category.service';

import { GetCategoryOptionsResp } from './Dto/get.category.options.dto';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

@ApiTags('backStage/category')
@Controller('backStage/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 取得後台分類下拉選單列表
   * @param body
   * @returns
   */
  @Get(apiPath.backStage.category.getBackStageCategoryOptions)
  async getBackStageCategoryOptions(): Promise<GetCategoryOptionsResp[]> {
    try {
      const result = await this.categoryService.getBackStageCategoryOptions();

      return result;
    } catch (error) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
