import { HttpStatus, Injectable } from '@nestjs/common';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

import { CategoryRepository } from './category.repository';

import { GetCategoryOptionsResp } from './Dto/get.category.options.dto';

import moment = require('moment-timezone');
const crypto = require('crypto');

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  /**
   * 取得分類下拉選單列表
   * @returns
   */
  async getBackStageCategoryOptions(): Promise<GetCategoryOptionsResp[]> {
    try {
      const categoryOptions =
        await this.categoryRepository.getBackStageCategoryOptions();

      const result = categoryOptions?.map((data) => {
        return {
          categoryId: data?.categoryId,
          categoryName: data?.categoryName
        };
      });
      return result;
    } catch (error) {
      console.error('getBackStageCategoryList service error:', error);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
