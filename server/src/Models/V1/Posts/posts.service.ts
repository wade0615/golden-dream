import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as ruuidv4 } from 'uuid';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

import { PostsRepository } from './posts.repository';

import moment = require('moment-timezone');
const crypto = require('crypto');

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  /**
   * 取得文章列表
   * @returns
   */
  async getPostList(req): Promise<any> {
    try {
      const postList = await this.postsRepository.getPostList(req);

      const result = {
        metaData: {
          page: req?.page ?? 1,
          perPage: req?.perPage ?? 10,
          totalCount: 66,
          totalPages: 7
        },
        postList: postList?.map((data) => {
          return {
            id: data?.id ?? ruuidv4(),
            title: data?.title ?? '未知的標題',
            date: data?.createdDate ?? '未知的時間',
            tag: data?.tag ?? '未知的分類',
            content: data?.shortContent ?? '未知的簡介'
          };
        })
      };

      return result;
    } catch (error) {
      console.error('getPostList service error:', error);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
