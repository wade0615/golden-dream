import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RouteWhite } from 'src/Config/White/route.white';
import { ThirdRoute } from 'src/Config/third';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import config from '../../Config/config';
import configError from '../../Config/error.message.config';
import { CustomerException } from '../ExceptionFilter/global.exception.handle.filter';
const { queryByMySqlPool } = require('../Module/mysql.module');
const mysql = require('mysql');
const escape = mysql.escape;
const ip = require('ip');

export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @Inject('LogService') private readonly logService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // const clientIP = ip.address();
    // process.env.clientIP = clientIP;

    //白名單內跳過
    const apiPath = req?.originalUrl.split('/');

    // 白名單 驗證
    if (RouteWhite.includes(`${apiPath[2]}/${apiPath[3]}`)) {
      // 呼叫ＡＰＩ前紀錄 Log : 白名單不紀錄 memberId
      // this.logService.printLogELK(
      //   req,
      //   {},
      //   ELK_LEVEL.INFO,
      //   '',
      //   '',
      //   'start',
      //   true
      // );

      return true;
    }

    try {
      // main.ts 結構問題，所以會 retry, 不判定會錯誤
      if (this.jwtService) await this.authorizationFunc(req, apiPath);
    } catch (error) {
      console.log('authorizationFunc FILED', '========== CATCH ==========');
      console.log('error  >>>>>> ', error);
      console.log('apiPath >>>>>', apiPath);
      console.log('========== END ==========');
      // console.log(
      //   'error ===>',
      //   error.errorCode === configError._200004.code,
      //   error?.errorVaule?.code
      // );
      // 清除 token 和 memberId
      process.env.token = '';
      process.env.memberId = '';
      // 呼叫ＡＰＩ前紀錄 Log
      // this.logService.printLogELK(req, {}, ELK_LEVEL.WARN, '', '', 'start');

      if (
        error.errorCode === configError._200004.code ||
        error?.errorVaule?.code
      )
        this.tokenErrorException(error);

      this.errorException(error);
    }
    // default
    return true;
  }

  /**
   * main
   * @param req
   * @returns
   */
  async authorizationFunc(req, apiPath) {
    let { authorization } = req.headers;

    if (!authorization) {
      if (!ThirdRoute.includes(`${apiPath[2]}/${apiPath[3]}`)) {
        throw new CustomerException(configError._200003, HttpStatus.FORBIDDEN);
      }
    }

    authorization = authorization.split(' ')[1]; // 去除 bearer

    // if (authorization === DEV_BACK_CODE) return true; // 後門移除

    // await this.jwtService.verifyAsync(authorization, {
    //   secret: config.JWT.SECRET
    // });

    //丟到 process 後 controller 要拿敏感資訊可以直接到 redis 拿
    if (authorization) process.env.token = authorization;
    //檢核 token
    const memberInfo = await this.checkToken(apiPath, authorization);
    //通用服務跳過檢核
    if (ThirdRoute.includes(`${apiPath[2]}/${apiPath[3]}`)) return;

    //檢核 API 權限
    await this.checkApiPermission(apiPath, memberInfo);
    //檢核帳號 & 角色狀態
    await this.checkRoleState(authorization);

    // 呼叫ＡＰＩ前紀錄 Log
    // this.logService.printLogELK(req, {}, ELK_LEVEL.INFO, '', '', 'start');
  }

  tokenErrorException(error) {
    throw new CustomerException(
      {
        code: configError._200004.code,
        msg: error?.errorVaule?.msg || error.message
      },
      HttpStatus.FORBIDDEN
    );
  }

  errorException(error) {
    throw new CustomerException(
      {
        code: configError._200004.code,
        msg: error?.errorVaule?.msg || error.message
      },
      HttpStatus.FORBIDDEN
    );
  }

  /**
   * 檢核 token
   */
  async checkToken(apiPath, token) {
    const memberKey = `${config.REDIS_KEY.TOKEN}:${token}`;
    const memberInfo = await this.redisService.getCacheData(memberKey);

    //如果memberInfo 不存在 or token 不一樣請重新登入
    //如果存在 重新賦予兩個小時生命
    if (!memberInfo || memberInfo?.token !== token) {
      if (!ThirdRoute.includes(`${apiPath[2]}/${apiPath[3]}`)) {
        throw new CustomerException(configError._200004, HttpStatus.FORBIDDEN);
      }
    }

    await this.redisService.setCacheData(memberKey, memberInfo, 60 * 60 * 4);

    process.env.name = memberInfo?.name;
    process.env.memberId = memberInfo?.memberId;
    process.env.account = memberInfo?.account;
    process.env.dwp = memberInfo?.password;

    return memberInfo;
  }

  /**
   * 檢查 帳號角色是否啟用
   */
  async checkRoleState(token: string) {
    //check token
    const cacheUserInfo = await this.redisService.getUserInfoFromCache(token);
    const memberId = cacheUserInfo?.authMemberId;

    // 取得帳號角色資訊
    const memRole = await this.getMemRoleState(memberId);

    // 任一項狀態未啟用 then 帳號已無法使用，請聯繫系統管理員。
    if (!memRole || !memRole?.roleState || !memRole?.memberState)
      throw new CustomerException(configError._200005, HttpStatus.FORBIDDEN);
  }

  /**
   * 查詢 member & role state
   */
  async getMemRoleState(memberId: string) {
    const sqlStr = /* sql */ `
        SELECT 
          mamr.Member_ID as memberId,
          mamr.Role_ID as roleId,
          ar.Role_State as roleState, 
          member.Member_State as memberState
        FROM 
          ftb.member
        JOIN ftb.map_auth_mem_role mamr ON member.Member_ID = mamr.Member_ID
        JOIN ftb.auth_role ar ON ar.Role_ID = mamr.Role_ID
        WHERE member.Member_ID = ?`;

    const result = await queryByMySqlPool(sqlStr, [memberId]);

    return result?.[0];
  }

  /**
   * 檢核是否有 API 權限
   */
  async checkApiPermission(apiPath, memberInfo) {
    apiPath = `${apiPath[2]}/${apiPath[3]}`;

    const userAuthItems = memberInfo?.authPermission
      ?.filter((permisson) => {
        return permisson?.apiPath?.length;
      })
      .map((path) => {
        return path?.apiPath;
      });

    const path = userAuthItems.find((item) => {
      return item?.includes(apiPath);
    });
  }
}
