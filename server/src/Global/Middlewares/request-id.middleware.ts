import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PermissionWhite } from 'src/Config/White/permission.white';
import { PermissionRoute } from 'src/Config/api.permission';
import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
import { AuthService } from 'src/Models/V1/Auth/auth.service';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import { v4 } from 'uuid';
import { CustomerException } from '../ExceptionFilter/global.exception.handle.filter';
const crypto = require('crypto');
/**
 * 權限管理中介層
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(
    private redisService: RedisService,
    private authService: AuthService
  ) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; connect-src 'self' https://wade-personal.de.r.appspot.com https://gorgeous-wade.com https://www.taiwan-strait-observatory.com; script-src 'self' https://www.googletagmanager.com;"
    );

    res.setHeader('X-Request-ID', v4());
    const urlPath = req.originalUrl;
    const apiPath = urlPath.split('/');

    // 白名單驗證
    // const isValid = false; // 先永遠不驗證，待串接完成後再加上去
    const isValid = await this._headerValid(apiPath);

    if (isValid) {
      const accessToken = req.headers.authorization;
      const pareToken = await this._credentialParser(accessToken);
      if (!pareToken) {
        console.log('[Authorization][Err] error access token', pareToken);
        throw new CustomerException(configError._200001, HttpStatus.OK);
      }

      // jwt verify
      // await this.authService._verifyToken(pareToken);
      const privKey = config._ENCRYPT_CODE.PRIV_KEY;
      const cryptoData = crypto
        .privateDecrypt(privKey, Buffer.from(pareToken, 'base64'))
        .toString('utf-8');
      if (!cryptoData) {
        throw new CustomerException(configError._200009, HttpStatus.FORBIDDEN);
      }

      const tokenData = cryptoData.split('|');
      const memberId = tokenData[0];
      const expiredTime = tokenData[1];

      if (new Date().getTime() > expiredTime) {
        throw new CustomerException(configError._200009, HttpStatus.FORBIDDEN);
      }

      // get auth member info from redis
      // const getUserInfo = await this.redisService.getCacheData(
      //   `${config.REDIS_KEY.TOKEN}:${pareToken}`
      // );

      // if (!getUserInfo?.authMemberId) {
      //   // user token expired => refresh token
      //   throw new CustomerException(configError._200009, HttpStatus.FORBIDDEN);
      // }

      // const getUserInfoPermission = getUserInfo?.authPermission || [];

      // if (!getUserInfoPermission?.length || getUserInfoPermission?.isAdmin) {
      //   // this user has no permission also not admin
      //   throw new CustomerException(configError._200006, HttpStatus.OK);
      // }

      // Admin user no need to check permission
      // if (!getUserInfoPermission?.isAdmin) {
      //   // TODO: 暫時註解API權限
      //   await this._permissionCheck(apiPath, getUserInfoPermission);
      // }

      // body add user info fot log tracking
      req.body.iam = { authMemberId: memberId ?? 'system' };
      req.headers['authMemberId'] = memberId;
      next();
    } else {
      req.body.iam = { authMemberId: 'system' };
      req.headers['authMemberId'] = 'system';
      next();
    }
  }

  async _headerValid(apiPath): Promise<boolean> {
    // white list no need token valid
    if (PermissionWhite.includes(`${apiPath[2]}/${apiPath[3]}`)) {
      return false;
    }

    if (!apiPath) {
      console.log('[Authorization][Err] error route path', apiPath);
      throw new CustomerException(configError._200001, HttpStatus.OK);
    }

    return true;
  }

  async _permissionCheck(apiPath, permissionList): Promise<boolean> {
    const currRoute = `${apiPath[2]}/${apiPath[3]}`;
    const currPermission = PermissionRoute[currRoute] ?? [];

    // check permission intersection
    const intersection = currPermission.filter((element) =>
      permissionList.includes(element)
    );

    if (!intersection.length) {
      throw new CustomerException(configError._200006, HttpStatus.OK);
    }
    return true;
  }

  async _credentialParser(bearerHeader: string): Promise<string> {
    let parts = bearerHeader?.split(' ') ?? [];
    if (parts?.length === 2 && parts?.[0] === 'Bearer') {
      const token = parts?.[1];
      return token;
    } else {
      throw new CustomerException(configError._200006, HttpStatus.OK);
    }
  }
}
