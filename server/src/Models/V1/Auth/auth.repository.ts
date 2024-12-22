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
        bam.Auth_Member_ID AS authMemberId,
        bam.Auth_Name AS name,
        bam.Account AS account,
        bam.Auth_Password AS pswd,
        bam.Salt AS salt,
        bam.Disable AS disable
      FROM
        blog_auth_member bam
      WHERE bam.Account = ?
        AND bam.Is_Active = 1
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
      UPDATE blog_auth_member SET ?
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

  /**
   * 取得最新的後台人員ID
   *
   * @returns
   */
  async getLatestAuthMemberId(): Promise<string> {
    const sqlStr = `
      SELECT
        MAX(am.Create_Date), am.Auth_Member_ID as authMemberId
      FROM
        blog_auth_member am
      GROUP BY am.Auth_Member_ID
      ORDER BY MAX(am.Create_Date) DESC LIMIT 1;
    `;

    const result = await this.internalConn.query(sqlStr, []);

    return result?.[0]?.authMemberId ?? '00000';
  }

  /**
   * 檢查是否有重複帳號
   *
   * @param req
   * @returns
   */
  async searchDuplicateAccount(req): Promise<any> {
    const _account = this.internalConn.escape(req?.account);
    // const _memberId = this.internalConn.escape(req?.memberId);

    let sqlStr = '';
    if (req?.account)
      sqlStr += `
        SELECT
          Account as account
        FROM
          blog_auth_member
        WHERE Account = ${_account} AND Is_Active = 1`;

    // if (req?.memberId)
    //   sqlStr += `
    //     SELECT
    //       Account as account
    //     FROM
    //       Auth_Member
    //     WHERE Auth_Member_ID != ${_memberId} AND Is_Active = 1`;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  async addAccountTransaction(
    connection,
    dataset: {
      Auth_Member_ID: string;
      Account: string;
      Auth_Name: string;
      Auth_Password: string;
      Remark: string;
      Create_ID: string;
      Alter_ID: string;
      Salt: string;
      Email: string;
    }
  ) {
    const insertMemberSql = `
      INSERT INTO blog_auth_member SET ?
    `;

    await this.internalConn.transactionQuery(connection, insertMemberSql, [
      dataset
    ]);
    return {};
  }
}
