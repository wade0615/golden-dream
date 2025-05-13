import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as ruuidv4 } from 'uuid';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

import { CategoryRepository } from './category.repository';

import { GetCategoryListResp } from './Dto/get.category.list.dto';
import {
  GetCategoryPostListReq,
  GetCategoryPostListResp
} from './Dto/get.category.post.list.dto';

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

  /**
   * 取得分類文章列表
   * @returns
   */
  async getCategoryPostList(
    req: GetCategoryPostListReq
  ): Promise<GetCategoryPostListResp> {
    try {
      const postList = await this.categoryRepository.getCategoryPostList(req);
      const postListCount =
        await this.categoryRepository.getCategoryPostListCount(req.categoryId);

      const result = {
        metaData: {
          page: req?.page ?? 1,
          perPage: req?.perPage ?? 10,
          totalCount: postListCount,
          totalPages: Math.ceil(postListCount / req?.perPage)
        },
        postList: postList?.map((data) => {
          return {
            id: data?.id ?? ruuidv4(),
            title: data?.title ?? '未知的標題',
            date: data?.createdDate ?? '未知的時間',
            category: data?.categoryName ?? '未知的分類',
            tag: data?.tag ?? '未知的標籤',
            content: data?.shortContent ?? '未知的簡介'
          };
        })
      };

      return result;
    } catch (error) {
      console.error('getCategoryPostList service error:', error);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
