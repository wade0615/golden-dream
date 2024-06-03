import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../../../Providers/Database/DatabaseMysql/mysql.provider';
import { GetUserDetailResp } from './Interface/get.user.detail.interface';
import { GetUserInfoInterface } from './Interface/get.user.info.interface';
import moment = require('moment-timezone');

/**
 * @class
 */
@Injectable()
export class AuthRepository {
  constructor(private internalConn: MysqlProvider) {}

  async getUserInfo(account): Promise<GetUserInfoInterface> {
    const sqlStr = `
      SELECT
        Auth_Member_ID as authMemberId,
        Auth_Name as name,
        Account as account,
        Auth_Password as pswwd,
        Salt as salt,
        Auth_Member.Is_Admin as isAdmin,
        ar.Home_Page as homePage,
        Auth_Member.Disable disable
      FROM
        Auth_Member
      INNER JOIN Map_Auth_Mem_Role mamr ON mamr.Member_ID = Auth_Member.Auth_Member_ID
      INNER JOIN Auth_Role ar ON ar.Role_ID = mamr.Role_ID
      WHERE Account = ?
        AND Auth_Member.Is_Active = 1
      LIMIT 1
    `;

    const result = (await this.internalConn.query(sqlStr, [account])) ?? [];

    return result?.[0];
  }

  async updateAuthMemberLoginTime(account): Promise<void> {
    const set = {
      Last_Login_Date: moment().utc().format('YYYY-MM-DD HH:mm:ss')
    };

    const sqlStr = `
      UPDATE Auth_Member SET ?
      WHERE Account = ?
    `;

    await this.internalConn.query(sqlStr, [set, account]);
  }

  /**
   * 取得後台人員詳情資料
   *
   * @param authMemberId
   * @returns
   */
  async getUserDetail(authMemberId: string): Promise<GetUserDetailResp> {
    const sqlStr = `
    SELECT
      Email as email
    FROM
      Auth_Member
    WHERE Is_Active = 1
      AND Auth_Member_ID = ?
    `;

    const result = await this.internalConn.query(sqlStr, [authMemberId]);

    return result?.[0];
  }
}
