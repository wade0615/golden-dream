import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';

import { CategoryService } from './category.service';

import { GetCategoryListResp } from './Dto/get.category.list.dto';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 取得文章分類列表
   * @param body
   * @returns
   */
  @Get(apiPath.category.getCategoryList)
  async getCategoryList(): Promise<GetCategoryListResp[]> {
    try {
      const result = await this.categoryService.getCategoryList();

      return result;
    } catch (error) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
