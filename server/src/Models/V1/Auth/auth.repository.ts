import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../../../Providers/Database/DatabaseMysql/mysql.provider';
import { ValueLable } from '../MemberShip/Dto/get.member.setting.parameter.dto';
import { GetDashBoardInfoResp } from './Interface/get.dashbord.info.interface';
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
   * 取得 dashBoard 資訊
   */
  async getDashboardInfo(
    memberShip: ValueLable[]
  ): Promise<GetDashBoardInfoResp> {
    const memberShipClauses = memberShip
      .map(
        (x) =>
          `SUM(CASE WHEN Membership_Status = '${x?.value}' THEN 1 ELSE 0 END) ${x?.value}`
      )
      .join(',\n');

    const sqlStr = /* sql */ `
SELECT
    COUNT(1) totalMember,
    ${memberShipClauses},
    SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) maleCount,
    SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) femaleCount,
    SUM(CASE WHEN gender = 'S' THEN 1 ELSE 0 END) otherCount,
    SUM(CASE WHEN YEAR(CURDATE()) - YEAR(birthday) <= 20 THEN 1 ELSE 0 END) age20BelowCount,
    SUM(CASE WHEN YEAR(CURDATE()) - YEAR(birthday) BETWEEN 21 AND 30 THEN 1 ELSE 0 END) age21To30Count,
    SUM(CASE WHEN YEAR(CURDATE()) - YEAR(birthday) BETWEEN 31 AND 40 THEN 1 ELSE 0 END) age31To40Count,
    SUM(CASE WHEN YEAR(CURDATE()) - YEAR(birthday) BETWEEN 41 AND 50 THEN 1 ELSE 0 END) age41To50Count,
    SUM(CASE WHEN YEAR(CURDATE()) - YEAR(birthday) BETWEEN 51 AND 60 THEN 1 ELSE 0 END) age51To60Count,
    SUM(CASE WHEN YEAR(CURDATE()) - YEAR(birthday) > 60 THEN 1 ELSE 0 END) age60AboveCount
FROM IEat_Member
WHERE Create_Date < CURDATE() AND Is_Active = 1`;

    const result = (await this.internalConn.query(sqlStr)) ?? [];

    return result?.[0];
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
