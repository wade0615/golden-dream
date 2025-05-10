import { HttpStatus, Injectable } from '@nestjs/common';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

import { CategoryRepository } from './category.repository';

import { GetCategoryListResp } from './Dto/get.category.list.dto';

import moment = require('moment-timezone');
const crypto = require('crypto');

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  /**
   * 取得文章分類列表
   * @returns
   */
  async getCategoryList(): Promise<GetCategoryListResp[]> {
    try {
      const categoryOptions = await this.categoryRepository.getCategoryList();

      const result = categoryOptions?.map((data) => {
        return {
          categoryId: data?.categoryId,
          categoryName: data?.categoryName
        };
      });
      return result;
    } catch (error) {
      console.error('getCategoryList service error:', error);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
