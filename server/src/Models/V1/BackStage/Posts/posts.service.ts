import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as ruuidv4 } from 'uuid';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

import { PostsRepository } from './posts.repository';

import { AddPostReq } from './Dto/add.post.dto';
import { GetPostByIdReq, GetPostByIdResp } from './Dto/get.post.by.id.dto';
import { GetPostListReq, GetPostListResp } from './Dto/get.post.list.dto';

import {
  POST_PUBLISH_CODE,
  POST_TYPE_CODE
} from 'src/Definition/Enum/post.enum';

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
            createDate: data?.createdDate ?? '未知的時間',
            alterDate: data?.alterDate ?? '未知的時間',
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
        category: postInfo?.categoryId ?? '未知的分類ID',
        categoryName: postInfo?.categoryName ?? '未知的分類',
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

  /**
   * 新增文章
   * @returns
   */
  async postBackStageAddPost(req: AddPostReq, userId: string): Promise<any> {
    try {
      const postData = {
        postId: ruuidv4(),
        postName: req?.postName,
        createId: userId,
        alterId: userId,
        content: req?.content,
        shortContent: req?.shortContent,
        postType: req?.postType
          ? parseInt(req?.postType, 10)
          : POST_TYPE_CODE?.NORMAL_POST,
        isPublish: req?.isPublish
          ? parseInt(req?.isPublish, 10)
          : POST_PUBLISH_CODE?.UNPUBLISH
      };
      await this.postsRepository.postBackStageAddPost(postData);

      await this.postsRepository.mappingPostCategory(
        postData.postId,
        req?.category
      );

      return true;
    } catch (error) {
      console.error('postBackStageAddPost service error:', error);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }

  /**
   * 編輯文章
   * @returns
   */
  async editPost() {}
}
