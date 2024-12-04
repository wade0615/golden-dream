import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as ruuidv4 } from 'uuid';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

import { PostsRepository } from './posts.repository';

import { GetPostByIdReq, GetPostByIdResp } from './Dto/get.post.by.id.dto';
import { GetPostListReq, GetPostListResp } from './Dto/get.post.list.dto';

import moment = require('moment-timezone');
const crypto = require('crypto');

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  /**
   * 取得後台文章列表
   * @returns
   */
  async getBackStagePostList(req: GetPostListReq): Promise<GetPostListResp> {
    try {
      const postList = await this.postsRepository.getPostList(req);
      const postListCount = await this.postsRepository.getPostListCount();

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
      console.error('getPostList service error:', error);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }

  /**
   * 取得後台指定文章
   * @returns
   */
  async getBackStagePostById(req: GetPostByIdReq): Promise<GetPostByIdResp> {
    try {
      const postInfo = await this.postsRepository.getPostById(req?.postId);
      const postPrevAndNextId = await this.postsRepository.getPostPrevAndNextId(
        req?.postId
      );

      const result = {
        title: postInfo?.title ?? '未知的標題',
        category: postInfo?.categoryName ?? '未知的分類',
        createdDate: moment(postInfo?.createdDate).format('YYYY-MM-DD') ?? '',
        content:
          postInfo?.content.replace(/\\\\/g, '\\').replace(/\\n/g, '\n') ??
          '未知的文章內容',
        prevPostId: postPrevAndNextId?.prevId ?? '',
        nextPostId: postPrevAndNextId?.nextId ?? ''
      };

      return result;
    } catch (error) {
      console.error('getPostById service error:', error);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
