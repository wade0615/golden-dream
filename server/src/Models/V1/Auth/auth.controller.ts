import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  VERSION_NEUTRAL
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import apiPath from 'src/Center/api.path';
import config from 'src/Config/config';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import { GetUserInfoRes, LoginDto, LoginResDto } from './Dto';
import { GetDashBoardResp } from './Dto/get.dashbord.dto';
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
   * 重新刷新token
   * @param req
   * @returns
   */
  @Get(apiPath.auth.refresh)
  @ApiOperation({
    summary: '刷新會員token'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '',
    type: 'object'
  })
  async refresh(@Headers() headers): Promise<LoginResDto> {
    const data = await this.authService.refresh(headers);
    return data;
  }

  /**
   * 取得用戶資訊
   * @param req
   * @returns
   */
  @Get(apiPath.auth.getAuthInfo)
  @ApiOperation({
    summary: '透過token取得用戶資訊'
  })
  @ApiCreatedResponse({
    status: 200,
    description: '',
    type: 'object'
  })
  async getMemberInfo(@Headers() headers): Promise<GetUserInfoRes> {
    const data = await this.authService.getUserInfo(headers);
    return data;
  }

  /**
   * dashboard 資訊
   * @param req
   * @returns
   */
  @Get(apiPath.auth.getDashboard)
  @ApiOperation({
    summary: 'dashboard 資訊'
  })
  @ApiCreatedResponse({
    status: 200,
    description: ''
  })
  async getDashboard(): Promise<GetDashBoardResp> {
    const data = await this.authService.getDashboard();
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

  /*
   * 刪除 token for 前端 demo
   * @returns
   */
  @Post(apiPath.auth.tokenDemo)
  @ApiOperation({
    summary: '刪除 token for 前端 demo'
  })
  async tokenDemo(@Req() req) {
    let keys;
    switch (req?.body?.key) {
      case 'at':
        keys = await this.redisService.scan(`${config.REDIS_KEY.TOKEN}*`);
        break;

      case 'rt':
        keys = await this.redisService.scan(`${config.REDIS_KEY.TOKEN}*`);
        const rtk = await this.redisService.scan(
          `${config.REDIS_KEY.RFTOKEN}*`
        );
        keys.push(...rtk);
        break;
    }

    if (keys?.length) this.redisService.delCacheData(keys);

    return {};
  }
}
