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
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import { LoginDto, LoginResDto } from './Dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'auth'
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService
  ) {}

  /**
   * 登入CRM會員
   * @param req
   * @returns
   */
  @Post(apiPath.auth.login)
  @ApiOperation({
    summary: '後台會員登入'
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
   * 登出
   * @param req
   * @returns
   */
  @Get(apiPath.auth.logout)
  @ApiOperation({
    summary: '後台會員登出'
  })
  @ApiCreatedResponse({
    status: 200,
    description: ''
  })
  async logout(@Headers() headers): Promise<object> {
    const data = await this.authService.logout(headers);
    return data;
  }
}
