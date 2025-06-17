import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  VERSION_NEUTRAL
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import apiPath from 'src/Center/api.path';
import { LoginDto, LoginResDto } from './Dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'auth'
})
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  /**
   * 後台登入
   * @param req
   * @returns
   */
  @Post(apiPath.auth.login)
  @ApiOperation({
    summary: '後台登入'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'internal account logged in successful',
    type: 'object'
  })
  async login(@Body() body: LoginDto): Promise<LoginResDto> {
    const data = await this.authService.login(body);
    return data;
  }

  /**
   * 後台登出
   * @param req
   * @returns
   */
  @Get(apiPath.auth.logout)
  @ApiOperation({
    summary: '後台登出'
  })
  @ApiCreatedResponse({
    status: 200,
    description: ''
  })
  async logout(@Headers() headers): Promise<object> {
    const data = await this.authService.logout(headers);
    return data;
  }

  /**
   * 新增後台使用者
   * @param req
   * @returns
   */
  @Post(apiPath.auth.addAuthMember)
  @ApiOperation({
    summary: '新增後台使用者'
  })
  @ApiCreatedResponse({
    status: 200,
    description: ''
  })
  async addAuthMember(
    @Body()
    body: {
      account: string;
      pwd: string;
      name: string;
      remark: string;
      email: string;
    }
  ): Promise<object> {
    const data = await this.authService.addAuthMember(body);
    return data;
  }

  /**
   * 使用 refresh token 更新 access token
   * @param req
   * @returns
   */
  @Get(apiPath.auth.tokenRefresh)
  @ApiOperation({
    summary: '使用 refresh token 更新 access token'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'access token refreshed successfully',
    type: 'object'
  })
  async tokenRefresh(
    @Headers() headers: {
      authorization: string;
      'refresh-token': string;
    }
  ): Promise<LoginResDto> {
    const data = await this.authService.tokenRefresh(headers);
    return data;
  }
}
