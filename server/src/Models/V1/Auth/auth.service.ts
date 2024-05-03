import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
import { ENUM_MEMBER_SHIP_SETTING_STATUS_CODE } from 'src/Definition/Enum/MemberShip/member.ship.setting.status.enum';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import { secondsUntilEndOfDay, sha256Hash } from 'src/Utils/tools';
import { ConfigApiService } from '../../../Config/Api/config.service';
import { MemberShipService } from '../MemberShip/memberShip.service';
import { PermissionRepository } from '../Permission/permission.repository';
import { GetUserInfoRes, LoginResDto } from './Dto';
import { Age, Gender, GetDashBoardResp } from './Dto/get.dashbord.dto';
import { GetUserInfoInterface } from './Interface/get.user.info.interface';
import { AuthRepository } from './auth.repository';

import moment = require('moment-timezone');
const crypto = require('crypto');

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private apiConfigService: ConfigApiService,
    private redisService: RedisService,
    private permissionRepository: PermissionRepository,
    private memberShipService: MemberShipService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * 驗證User
   * @param account
   * @returns
   */
  async _validateUser(req): Promise<GetUserInfoInterface> {
    const getInfoFromActResp = await this.authRepository.getUserInfo(req.act);
    console.log(getInfoFromActResp?.disable);
    if (!getInfoFromActResp?.disable) {
      throw new CustomerException(configError._220026, HttpStatus.OK);
    }

    const saltHashPassword = await this.cryptoPwd(
      req?.pwd,
      getInfoFromActResp?.salt
    );

    if (
      !getInfoFromActResp?.account ||
      getInfoFromActResp?.pswwd != saltHashPassword
    ) {
      throw new CustomerException(configError._210001, HttpStatus.OK);
    }

    return getInfoFromActResp;
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
  async login(req): Promise<LoginResDto> {
    // 判斷帳密是否符合
    const validateUserResp = await this._validateUser(req);
    const authMemberId = validateUserResp?.authMemberId;

    const accessToken = await this._getToken(validateUserResp?.name);
    const rToken = sha256Hash(
      validateUserResp?.name,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    // 取得權限
    const getMemberRoleInfo =
      await this.permissionRepository.getMemberPermission(authMemberId);

    const authItems = getMemberRoleInfo.map((per) => {
      return per.permissionCode;
    });

    // 設定 rt 以及 at
    await this.redisService.setCacheUserInfo(
      {
        authMemberId: authMemberId,
        name: validateUserResp?.name,
        account: req.act,
        password: req.pwd,
        isAdmin: validateUserResp.isAdmin,
        homePage: validateUserResp.homePage,
        token: accessToken,
        authPermission: [...authItems]
      },
      Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) // 2 hours
    );

    await this.redisService.setRefreshToken(
      {
        memberId: authMemberId,
        name: validateUserResp?.name,
        homePage: validateUserResp.homePage,
        account: req.act,
        token: rToken
      },
      Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) // 48 hours
    );

    const loginResp = {
      accessToken: accessToken,
      refreshToken: rToken,
      name: validateUserResp?.name
    };

    await this.authRepository.updateAuthMemberLoginTime(req.act);

    return loginResp;
  }

  /**
   * 刷新token
   * @param req
   * @returns
   */
  async refresh(headers): Promise<LoginResDto> {
    const refreshToken = headers['refresh-token'];

    const getUserInfo = await this.redisService.getCacheData(
      `${config.REDIS_KEY.RFTOKEN}:${refreshToken}`
    );

    // refresh token expired => out
    if (!getUserInfo?.memberId)
      throw new CustomerException(configError._200008, HttpStatus.FORBIDDEN);

    const memberId = getUserInfo?.memberId;
    const name = getUserInfo?.name;

    // 產生新 at
    const accessToken = await this._getToken(name);

    // 取得權限
    const getMemberRoleInfo =
      await this.permissionRepository.getMemberPermission(memberId);

    const authItems = getMemberRoleInfo.map((per) => {
      return per.permissionCode;
    });

    // 產生新 rt
    const rToken = sha256Hash(
      getUserInfo?.name,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    // 重新存入at
    await this.redisService.setCacheUserInfo(
      {
        authMemberId: memberId,
        name: name,
        account: getUserInfo.act,
        password: getUserInfo.pwd,
        isAdmin: getUserInfo.isAdmin,
        homePage: getUserInfo.homePage,
        token: accessToken,
        authPermission: [...authItems]
      },
      Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) // 2 hours
    );

    // 因有使用的話要遞延，所以產新的 48 hr 的 rt
    await this.redisService.setRefreshToken(
      {
        memberId: getUserInfo?.memberId,
        name: getUserInfo?.name,
        homePage: getUserInfo.homePage,
        account: getUserInfo.act,
        token: rToken
      },
      Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) // 48 hours
    );

    // 刪除舊的 rt
    this.redisService.delCacheData(
      `${config.REDIS_KEY.RFTOKEN}:${refreshToken}`
    );

    const loginResp = {
      accessToken: accessToken,
      refreshToken: rToken
    };

    return loginResp;
  }

  /**
   * 取得使用者資訊
   * @param headers
   * @returns
   */
  async getUserInfo(headers): Promise<GetUserInfoRes> {
    const accessToken = headers.authorization;

    let parts = accessToken.split(' ');

    const getUserInfo = await this.redisService.getCacheData(
      `${config.REDIS_KEY.TOKEN}:${parts[1]}`
    );

    const name = getUserInfo?.name;
    const authItem = getUserInfo?.authPermission;

    const loginResp = {
      name: name,
      authItems: [...authItem],
      homePage: getUserInfo?.homePage ?? 'home',
      isAdmin: getUserInfo?.isAdmin
    };

    return loginResp;
  }

  /**
   * 登出
   * @param headers
   * @returns
   */
  async logout(headers): Promise<object> {
    const accessToken = headers['access-token'];
    const refreshToken = headers['refresh-token'];

    await this.redisService.delCacheData(
      `${config.REDIS_KEY.TOKEN}:${accessToken}`
    );

    await this.redisService.delCacheData(
      `${config.REDIS_KEY.RFTOKEN}:${refreshToken}`
    );

    return {};
  }

  /**
   * dashboard 資訊
   * @returns
   */
  async getDashboard(): Promise<GetDashBoardResp> {
    // 為截止至前一日的會員資料
    let result = <GetDashBoardResp>{};
    const today = moment()
      .tz(process.env.TIME_ZONE)
      .format(process.env.DATE_ONLY);

    result = await this.redisService.getCacheData(
      `${today}-${config.REDIS_KEY.DASHBOARD}`
    );
    if (result) return result;

    // 會籍
    const activeMemberShipId = (
      await this.memberShipService.getMemberShipSettingList()
    )?.settingList?.find(
      (x) => x.settingStatus === ENUM_MEMBER_SHIP_SETTING_STATUS_CODE.EFFECTIVE
    );
    const memberShipInfo = (
      await this.memberShipService.getMemberSettingParameter(activeMemberShipId)
    )?.memberShipList;

    // 取得 dashBoard 資訊
    const dashboardInfo = await this.authRepository.getDashboardInfo(
      memberShipInfo
    );

    /** 取得比例 */
    const getRate = (count: string) => {
      const rate = ((Number(count) / dashboardInfo?.totalMember) * 100).toFixed(
        2
      );

      if (rate.endsWith('.00')) return Math.round(Number(rate));
      return Number(rate);
    };

    // 會籍佔比
    const memberShip = Object.keys(dashboardInfo).reduce((acc, curr) => {
      const singleMemberShip = memberShipInfo.find((item) =>
        item.value.includes(curr)
      );
      if (singleMemberShip) {
        acc.push({
          rate: `${singleMemberShip?.label} ${getRate(dashboardInfo[curr])}%`,
          count: Number(dashboardInfo[curr])
        });
      }
      return acc;
    }, []);

    const gender = <Gender>{};
    gender.male = getRate(dashboardInfo?.maleCount);
    gender.female = getRate(dashboardInfo?.femaleCount);
    gender.other = getRate(dashboardInfo?.otherCount);

    const age = <Age>{};
    age[20] = getRate(dashboardInfo?.age20BelowCount);
    age[21] = getRate(dashboardInfo?.age21To30Count);
    age[31] = getRate(dashboardInfo?.age31To40Count);
    age[41] = getRate(dashboardInfo?.age41To50Count);
    age[51] = getRate(dashboardInfo?.age51To60Count);
    age[60] = getRate(dashboardInfo?.age60AboveCount);

    result = <GetDashBoardResp>{};
    result.totalMember = dashboardInfo?.totalMember;
    result.memberShip = memberShip;
    result.gender = gender;
    result.age = age;

    this.redisService.setCacheData(
      `${today}-${config.REDIS_KEY.DASHBOARD}`,
      result,
      secondsUntilEndOfDay()
    );

    return result;
  }
}
