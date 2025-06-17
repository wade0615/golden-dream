import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
// import { RedisService } from 'src/Providers/Database/Redis/redis.service';
// import { sha256Hash } from 'src/Utils/tools';
// import { ConfigApiService } from '../../../Config/Api/config.service';
import { LoginDto, LoginResDto } from './Dto';
import { GetUserInfoInterface } from './Interface/get.user.info.interface';
import { AuthRepository } from './auth.repository';

import { cryptoPwd, getRandomString } from 'src/Utils/tools';

import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

import moment = require('moment-timezone');
const crypto = require('crypto');

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    // private apiConfigService: ConfigApiService,
    // private redisService: RedisService,
    private readonly jwtService: JwtService,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 驗證User
   * @param req
   * @returns
   */
  async validateUser(req: LoginDto): Promise<GetUserInfoInterface> {
    const getInfoFromActResp = await this.authRepository.getUserInfo(req.act);
    if (!getInfoFromActResp?.disable) {
      throw new CustomerException(configError._220026, HttpStatus.OK);
    }

    const saltHashPassword = await cryptoPwd(
      req?.pwd,
      getInfoFromActResp?.salt
    );

    if (
      !getInfoFromActResp?.account ||
      getInfoFromActResp?.pswd != saltHashPassword
    ) {
      throw new CustomerException(configError._210001, HttpStatus.OK);
    }

    return getInfoFromActResp;
  }

  /**
   * 建立新的帳號id
   * @returns
   */
  async _generateNewId(): Promise<string> {
    const latestAuthMemberId =
      await this.authRepository.getLatestAuthMemberId();

    const memberRandom = getRandomString(5);
    const pattern = /\d{5}$/; // 匹配最後五個數字
    const match = latestAuthMemberId.match(pattern);

    const memberIdNumber = match
      ? (Number(match[0]) + 1).toString().padStart(5, '0')
      : '00001';

    const memberId = `${memberRandom}${memberIdNumber}`;

    return memberId;
  }

  /**
   * 產出隨機長度5的salt;
   * @returns
   */
  async genSalt() {
    const randomSalt = crypto
      .randomBytes(Math.ceil(5 / 2))
      .toString(config._HASH_METHOD._HEX)
      .slice(0, 5);
    return randomSalt;
  }

  async cryptoPwd(password: string, salt: string) {
    const hashPassword = crypto
      .createHash(config._HASH_METHOD._SHA256)
      .update(password)
      .digest(config._HASH_METHOD._HEX)
      .toUpperCase();
    const saltPassword = salt + hashPassword;
    return saltPassword;
  }

  /**
   * 產生 token
   * @param name
   * @returns
   */
  async _getToken(name: string) {
    try {
      const jwt = await this.jwtService.signAsync({
        name
      });
      return jwt;
    } catch (error) {
      throw new CustomerException(
        { code: configError._200004.code, msg: error.message },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * 解析 token
   * @param jwt
   * @returns
   */
  async _verifyToken(token: string): Promise<void> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });
      if (!decoded?.name) throw Error(configError._200009?.msg);
    } catch (err) {
      throw new CustomerException(
        {
          ...configError._200009,
          additional: { msg: err.message, isHide: true }
        },
        HttpStatus.FORBIDDEN
      );
    }
  }
  /**
   * 登入
   * @param req
   * @returns
   */
  async login(req: LoginDto): Promise<LoginResDto> {
    let connection;
    try {
      connection = await this.internalConn.getConnection();
      await connection.beginTransaction();
      // 判斷帳密是否符合
      const validateUserResp = await this.validateUser(req);
      const memberId = validateUserResp?.authMemberId;

      // const accessToken = await this._getToken(validateUserResp?.name);
      // const rToken = sha256Hash(
      //   validateUserResp?.name,
      //   process.env.JWT_REFRESH_TOKEN_SECRET
      // );

      const ttl = 3 * 60 * 60 * 1000; // 3hr
      const now = new Date().getTime() + ttl; // 過期時間為當前時間 + TTL（毫秒）;
      const buffer = [memberId, now.toString()];

      const pubKey = config._ENCRYPT_CODE.PUBLIC_KEY.replace(/\\n/g, '\n');

      const accessToken = crypto
        .publicEncrypt(pubKey, Buffer.from(buffer.join('|')))
        .toString(config._HASH_METHOD._BASE64);

      const refresh_ttl = 48 * 60 * 60 * 1000; // 48hr
      const refresh_now = new Date().getTime() + refresh_ttl; // 過期時間為當前時間 + TTL（毫秒）;
      const refresh_buffer = [memberId, refresh_now.toString()];

      const refreshToken = crypto
        .publicEncrypt(pubKey, Buffer.from(refresh_buffer.join('|')))
        .toString(config._HASH_METHOD._BASE64);

      // // 取得權限
      // const getMemberRoleInfo = [];

      // const authItems = getMemberRoleInfo.map((per) => {
      //   return per.permissionCode;
      // });

      // // 設定 rt 以及 at
      // await this.redisService.setCacheUserInfo(
      //   {
      //     authMemberId: authMemberId,
      //     name: validateUserResp?.name,
      //     account: req.act,
      //     password: req.pwd,
      //     isAdmin: validateUserResp.isAdmin,
      //     homePage: validateUserResp.homePage,
      //     token: accessToken,
      //     authPermission: [...authItems]
      //   },
      //   Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) // 2 hours
      // );

      // await this.redisService.setRefreshToken(
      //   {
      //     memberId: authMemberId,
      //     name: validateUserResp?.name,
      //     homePage: validateUserResp.homePage,
      //     account: req.act,
      //     token: rToken
      //   },
      //   Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) // 48 hours
      // );

      const loginResp = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        name: validateUserResp?.name
      };

      await this.authRepository.updateAuthMemberLoginTime(req.act);

      return loginResp;
    } catch (err) {
      await connection.rollback();
      throw new CustomerException(configError._200002, HttpStatus.OK);
    } finally {
      await connection.release();
    }
  }

  /**
   * 刷新token
   * @param req
   * @returns
   */
  // async refresh(headers): Promise<LoginResDto> {
  //   const refreshToken = headers['refresh-token'];

  //   const getUserInfo = await this.redisService.getCacheData(
  //     `${config.REDIS_KEY.RFTOKEN}:${refreshToken}`
  //   );

  //   // refresh token expired => out
  //   if (!getUserInfo?.memberId)
  //     throw new CustomerException(configError._200008, HttpStatus.FORBIDDEN);

  //   const memberId = getUserInfo?.memberId;
  //   const name = getUserInfo?.name;

  //   // 產生新 at
  //   const accessToken = await this._getToken(name);

  //   // 取得權限
  //   const getMemberRoleInfo = [];

  //   const authItems = getMemberRoleInfo.map((per) => {
  //     return per.permissionCode;
  //   });

  //   // 產生新 rt
  //   const rToken = sha256Hash(
  //     getUserInfo?.name,
  //     process.env.JWT_REFRESH_TOKEN_SECRET
  //   );

  //   // 重新存入at
  //   await this.redisService.setCacheUserInfo(
  //     {
  //       authMemberId: memberId,
  //       name: name,
  //       account: getUserInfo.act,
  //       password: getUserInfo.pwd,
  //       isAdmin: getUserInfo.isAdmin,
  //       homePage: getUserInfo.homePage,
  //       token: accessToken,
  //       authPermission: [...authItems]
  //     },
  //     Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) // 2 hours
  //   );

  //   // 因有使用的話要遞延，所以產新的 48 hr 的 rt
  //   await this.redisService.setRefreshToken(
  //     {
  //       memberId: getUserInfo?.memberId,
  //       name: getUserInfo?.name,
  //       homePage: getUserInfo.homePage,
  //       account: getUserInfo.act,
  //       token: rToken
  //     },
  //     Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) // 48 hours
  //   );

  //   // 刪除舊的 rt
  //   this.redisService.delCacheData(
  //     `${config.REDIS_KEY.RFTOKEN}:${refreshToken}`
  //   );

  //   const loginResp = {
  //     accessToken: accessToken,
  //     refreshToken: rToken
  //   };

  //   return loginResp;
  // }

  /**
   * 取得使用者資訊
   * @param headers
   * @returns
   */
  // async getUserInfo(headers): Promise<GetUserInfoRes> {
  //   const accessToken = headers.authorization;

  //   let parts = accessToken.split(' ');

  //   const getUserInfo = await this.redisService.getCacheData(
  //     `${config.REDIS_KEY.TOKEN}:${parts[1]}`
  //   );

  //   const name = getUserInfo?.name;
  //   const authItem = getUserInfo?.authPermission;

  //   const loginResp = {
  //     name: name,
  //     authItems: [...authItem],
  //     homePage: getUserInfo?.homePage ?? 'home',
  //     isAdmin: getUserInfo?.isAdmin
  //   };

  //   return loginResp;
  // }

  /**
   * 登出
   * @param headers
   * @returns
   */
  async logout(headers): Promise<object> {
    // const accessToken = headers['access-token'];
    // const refreshToken = headers['refresh-token'];

    // await this.redisService.delCacheData(
    //   `${config.REDIS_KEY.TOKEN}:${accessToken}`
    // );

    // await this.redisService.delCacheData(
    //   `${config.REDIS_KEY.RFTOKEN}:${refreshToken}`
    // );

    return {};
  }

  /**
   * 新增帳號
   * @param req
   * @returns
   */
  async addAuthMember(req) {
    // 檢查是否有重複帳號
    const searchDuplicateAccount =
      await this.authRepository.searchDuplicateAccount({
        account: req?.account
      });
    if (searchDuplicateAccount?.length)
      throw new CustomerException(configError._330001, HttpStatus.OK);

    // 密碼為8~20位數的英數混合。
    if (req?.pwd?.length < 6 || req?.pwd?.length > 20)
      throw new CustomerException(configError._330003, HttpStatus.OK);

    // 密碼不為英數混合 => 密碼為6~20位數的英數混合。
    const regex = new RegExp(/[^\w]/);
    if (regex.test(req?.pwd))
      throw new CustomerException(configError._330003, HttpStatus.OK);

    const salt = await this.genSalt();
    const saltPassword = cryptoPwd(req?.pwd, salt);
    const authMemberId = await this._generateNewId();

    let connection;
    try {
      connection = await this.internalConn.getConnection();
      await connection.beginTransaction();

      // 新增後台使用者
      await this.authRepository.addAccountTransaction(connection, {
        Auth_Member_ID: authMemberId,
        Account: req?.account,
        Auth_Name: req?.name,
        Auth_Password: saltPassword,
        Remark: req?.remark ? req?.remark : req?.pwd,
        Create_ID: 'system',
        Alter_ID: 'system',
        Salt: salt,
        Email: req?.email
      });
      await connection.commit();

      return { authMemberId: authMemberId, authMemberPWD: req?.pwd };
    } catch (err) {
      await connection.rollback();
      throw new CustomerException(configError._200002, HttpStatus.OK);
    } finally {
      await connection.release();
    }
  }

  /**
   * 更新登入時間
   * @param act
   * @returns
   */
  async tokenRefresh(
    headers: { authorization: string }
  ): Promise<LoginResDto> {
    const accessToken = headers.authorization;
    const refreshToken = headers['refresh-token'];

    if (!accessToken) {
      throw new CustomerException(configError._200008, HttpStatus.FORBIDDEN);
    }

    // 解析 accessToken
    const parts = accessToken.split(' ');
    const pareToken = parts[1];
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new CustomerException(configError._200008, HttpStatus.FORBIDDEN);
    }

    const privKey = config._ENCRYPT_CODE.PRIV_KEY;
    const cryptoData = crypto
      .privateDecrypt(privKey, Buffer.from(pareToken, 'base64'))
      .toString('utf-8');
    if (!cryptoData) {
      throw new CustomerException(configError._200008, HttpStatus.FORBIDDEN);
    }
    const tokenData = cryptoData.split('|');
    const memberId = tokenData[0];
    // const expiredTime = tokenData[1];

    // 解析 refreshToken
    if (!refreshToken) {
      throw new CustomerException(configError._200008, HttpStatus.FORBIDDEN);
    }
    const refreshParts = refreshToken.split(' ');
    if (refreshParts.length !== 2 || refreshParts[0] !== 'Bearer') {
      throw new CustomerException(configError._200008, HttpStatus.FORBIDDEN);
    }
    const refreshPareToken = refreshParts[1];
    const refreshCryptoData = crypto
      .privateDecrypt(privKey, Buffer.from(refreshPareToken, 'base64'))
      .toString('utf-8');
    if (!refreshCryptoData) {
      throw new CustomerException(configError._200008, HttpStatus.FORBIDDEN);
    }
    // const refreshTokenData = refreshCryptoData.split('|');
    // const refreshMemberId = refreshTokenData[0];
    // const refreshExpiredTime = refreshTokenData[1];

    // 建立新的 accessToken & refreshToken
    const ttl = 3 * 60 * 60 * 1000; // 3hr
    const now = new Date().getTime() + ttl; // 過期時間為當前時間 + TTL（毫秒）;
    const buffer = [memberId, now.toString()];

    const pubKey = config._ENCRYPT_CODE.PUBLIC_KEY.replace(/\\n/g, '\n');

    const newAccessToken = crypto
      .publicEncrypt(pubKey, Buffer.from(buffer.join('|')))
      .toString(config._HASH_METHOD._BASE64);

    const refresh_ttl = 48 * 60 * 60 * 1000; // 48hr
    const refresh_now = new Date().getTime() + refresh_ttl; // 過期時間為當前時間 + TTL（毫秒）;
    const refresh_buffer = [memberId, refresh_now.toString()];

    const newRefreshToken = crypto
      .publicEncrypt(pubKey, Buffer.from(refresh_buffer.join('|')))
      .toString(config._HASH_METHOD._BASE64);

    // 更新登入時間
    // await this.authRepository.updateAuthMemberLoginTime(name);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }
}
