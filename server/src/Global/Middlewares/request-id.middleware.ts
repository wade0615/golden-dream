import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PermissionWhite } from 'src/Config/White/permission.white';
import { PermissionRoute } from 'src/Config/api.permission';
import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
import { CustomerException } from '../ExceptionFilter/global.exception.handle.filter';
const crypto = require('crypto');

/**
 * 權限管理中介層
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(
  ) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    // 取得 API 路徑
    const urlPath = req.originalUrl;
    const apiPath = urlPath.split('/');

    // 白名單驗證
    const isValid = await this._headerValid(apiPath);
    // const isValid = false; // 永遠不驗證

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

  /**
   * 白名單驗證
   * @param apiPath API 路徑
   * @returns 是否通過驗證，true: 需要驗證，false: 不需要驗證
   */
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

  /**
   * API 路徑權限驗證
   * @param apiPath API 路徑
   * @param permissionList 權限列表
   * @returns 是否通過驗證，true: 通過驗證，false: 不通過驗證
   */
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

  /**
   * 解析 token
   * @param bearerHeader token
   * @returns token
   */
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
