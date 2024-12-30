import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Patch,
  Post
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';

import { PostsService } from './posts.service';

import { AddPostReq } from './Dto/add.post.dto';
import { EditPostReq } from './Dto/edit.post.dto';
import { GetPostByIdReq, GetPostByIdResp } from './Dto/get.post.by.id.dto';
import { GetPostListReq, GetPostListResp } from './Dto/get.post.list.dto';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

@ApiTags('backStage/posts')
@Controller('backStage/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 取得後台文章列表
   * @param body
   * @returns
   */
  @Post(apiPath.backStage.posts.getBackStagePostList)
  async getBackStagePostList(
    @Body() body: GetPostListReq
  ): Promise<GetPostListResp> {
    try {
      const result = await this.postsService.getBackStagePostList(body);

      return result;
    } catch (error) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }

  /**
   * 取得指定文章
   * @param body
   * @returns
   */
  @Post(apiPath.backStage.posts.getBackStagePostById)
  async getPostById(@Body() body: GetPostByIdReq): Promise<GetPostByIdResp> {
    try {
      const result = await this.postsService.getBackStagePostById(body);

      return result;
    } catch (error) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }

  /**
   * 新增文章
   * @param body
   * @returns
   */
  @Post(apiPath.backStage.posts.postBackStageAddPost)
  async addPost(
    @Headers() headers: any,
    @Body() body: AddPostReq
  ): Promise<any> {
    try {
      const userId = headers['authMemberId'] ?? 'system';
      const result = await this.postsService.postBackStageAddPost(body, userId);

      return result;
    } catch (error) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }

  /**
   * 編輯文章
   * @param body
   * @returns
   */
  @Patch(apiPath.backStage.posts.patchBackStageEditPost)
  async editPost(
    @Headers() headers: any,
    @Body() body: EditPostReq
  ): Promise<any> {
    try {
      const userId = headers['authMemberId'] ?? 'system';
      const result = await this.postsService.editPost(body, userId);

      return result;
    } catch (error) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
