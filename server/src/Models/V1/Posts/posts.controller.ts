import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';

import { PostsService } from './posts.service';

import { GetPostByIdReq, GetPostByIdResp } from './Dto/get.post.by.id.dto';
import { GetPostListReq, GetPostListResp } from './Dto/get.post.list.dto';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 取得文章列表
   * @param body
   * @returns
   */
  @Post(apiPath.posts.getPostList)
  async getPostList(@Body() body: GetPostListReq): Promise<GetPostListResp> {
    try {
      const result = await this.postsService.getPostList(body);

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
  @Post(apiPath.posts.getPostById)
  async getPostById(@Body() body: GetPostByIdReq): Promise<GetPostByIdResp> {
    try {
      const result = await this.postsService.getPostById(body);

      return result;
    } catch (error) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
