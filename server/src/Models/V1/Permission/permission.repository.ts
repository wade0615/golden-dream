import { HttpStatus, Injectable } from '@nestjs/common';
import configError from 'src/Config/error.message.config';
import { SEARCH_ACTION_TYPES } from 'src/Definition/Enum/Common/search.action.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from '../../../Providers/Database/DatabaseMysql/mysql.provider';
import { CopyRoletDto } from './Dto';
import { GetAllDepartInterface } from './Interface/get.all.depart.interface';
import { GetAuthInterface } from './Interface/get.auth.item.interface';
import {
  GetRoleItems,
  GetRoleListInterface
} from './Interface/get.role.list.interface';
import {
  GetAuthMemberListInterface,
  GetMemDepartInfo,
  GetMemRoleInfo,
  GetMemberDetail
} from './Interface/get.user.info.interface';

/**
 *
 * @class
 */
@Injectable()
export class PermissionRepository {
  constructor(private internalConn: MysqlProvider) {}

  async getAuthMemberList(req): Promise<GetAuthMemberListInterface[]> {
    const _search = this.internalConn.escape(req?.search);
    const _memberRole = this.internalConn.escape(req?.roleId);
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);

    let sqlStr = `
      SELECT
        distinct ap.Auth_Member_ID as authMemberId,
        ap.Auth_Name as authName,
        ap.Account as account,
        ap.Disable as state,
        ap.Create_Date as createDate,
        IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = ap.Create_ID), 'system') as createName,
        ap.Alter_Date as alterDate,
        IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = ap.Alter_ID), 'system') as alterName,
        ap.Last_Login_Date as lastLoginDate,
        ar.Role_Name as roleName,
        JSON_ARRAYAGG(JSON_OBJECT("brandId", b.Brand_ID, "brandName", b.Brand_Name)) departList
      FROM
        Auth_Member ap
      LEFT JOIN Map_Auth_Mem_Role mamr ON mamr.Member_ID = ap.Auth_Member_ID AND mamr.Is_Active = 1
      LEFT JOIN Auth_Role ar ON ar.Role_ID = mamr.Role_ID
      LEFT JOIN Map_Auth_Mem_Depart mamp ON mamp.Member_ID = ap.Auth_Member_ID AND mamp.Is_Active = 1
      LEFT JOIN Store s ON s.Store_ID = mamp.Depart_ID
      LEFT JOIN Brand b ON b.Brand_ID = s.Brand_ID
      WHERE ap.Is_Active = 1
    `;

    // 精準搜尋名稱/名稱/品牌名稱
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MEMBER_NAME:
          sqlStr += ` AND ap.Auth_Name = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.ACCOUNT:
          sqlStr += ` AND ap.Account = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.BRAND_NAME:
          sqlStr += ` AND b.Brand_Name = ${_search}`;
          break;
      }
    }

    // 角色
    if (req?.roleId) {
      sqlStr += ` AND mamr.Role_ID = ${_memberRole}`;
    }

    sqlStr += ` GROUP BY ap.Auth_Member_ID ORDER BY ap.Create_Date DESC`;
    sqlStr += ` LIMIT ${_start}, ${_limit}`;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  async getAuthMemberListCount(req): Promise<number> {
    const _search = this.internalConn.escape(req?.search);
    const _memberRole = this.internalConn.escape(req?.roleId);

    let sqlStr = `
      SELECT
        COUNT(DISTINCT ap.Auth_Member_ID) as authMemberCount
      FROM
        Auth_Member ap
      LEFT JOIN Map_Auth_Mem_Role mamr ON mamr.Member_ID = ap.Auth_Member_ID AND mamr.Is_Active = 1
      LEFT JOIN Map_Auth_Mem_Depart mamp ON mamp.Member_ID = ap.Auth_Member_ID AND mamp.Is_Active = 1
      LEFT JOIN Store s ON s.Store_ID = mamp.Depart_ID
      LEFT JOIN Brand b ON b.Brand_ID = s.Brand_ID
      WHERE ap.Is_Active = 1
    `;

    // 精準搜尋名稱/名稱/品牌名稱
    if (req?.search) {
      switch (req?.searchType) {
        case SEARCH_ACTION_TYPES.MEMBER_NAME:
          sqlStr += ` AND ap.Auth_Name = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.ACCOUNT:
          sqlStr += ` AND ap.Account = ${_search}`;
          break;
        case SEARCH_ACTION_TYPES.BRAND_NAME:
          sqlStr += ` AND b.Brand_Name = ${_search}`;
          break;
      }
    }

    // 角色
    if (req?.roleId) {
      sqlStr += ` AND mamr.Role_ID = ${_memberRole}`;
    }

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result[0]?.authMemberCount ?? 0;
  }

  async getLatestAuthMemberId(): Promise<string> {
    const sqlStr = `
      SELECT
        MAX(am.Create_Date), am.Auth_Member_ID as authMemberId
      FROM
        Auth_Member am
      GROUP BY am.Auth_Member_ID
      ORDER BY MAX(am.Create_Date) DESC LIMIT 1
    `;

    const result = await this.internalConn.query(sqlStr, []);

    return result[0].authMemberId ?? '00000';
  }

  async getMemDepartInfo(id: string): Promise<GetMemDepartInfo[]> {
    const sqlStr = `
      SELECT
        mamp.Depart_ID  as departId,
        s.Store_Name as storeName,
        s.Store_ID as storeId,
        b.Brand_Name as brandName,
        b.Brand_ID as brandId
      FROM
        Map_Auth_Mem_Depart mamp
      LEFT JOIN Store s ON s.Store_ID = mamp.Depart_ID
      LEFT JOIN Brand b ON b.Brand_ID = s.Brand_ID
      WHERE mamp.Member_ID = ? AND mamp.Is_Active = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [id])) ?? [];

    return result;
  }

  async getMemberDetail(id: string): Promise<GetMemberDetail> {
    const sqlStr = `
      SELECT
        ap.Auth_Member_ID as authMemberId,
        ap.Account as account,
        ap.Auth_Name as name,
        ap.Disable as state,
        ap.Remark as remark,
        ap.Create_Date as createDate,
        ap.Email as email,
        IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = ap.Create_ID), 'system') as createName,
        ap.Alter_Date as alterDate,
        IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = ap.Alter_ID), 'system') as alterName,
        ap.Last_Login_Date as lastLoginDate
      FROM
        Auth_Member ap
      WHERE ap.Auth_Member_ID = ? AND ap.Is_Active = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [id])) ?? [];

    return result[0] ?? '';
  }

  async getMemberRoleInfo(id: string): Promise<GetMemRoleInfo[]> {
    const sqlStr = `
      SELECT
        mamr.Role_Id as roleId,
        ar.Role_Name as roleName
      FROM
        Map_Auth_Mem_Role mamr
      JOIN Auth_Role ar ON ar.Role_ID = mamr.Role_ID
      WHERE mamr.Member_ID = ? AND mamr.Is_Active = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [id])) ?? [];

    return result;
  }

  async getAllDepart(): Promise<GetAllDepartInterface> {
    const sqlStr = `
      SELECT
        store.Store_ID as storeId,
        store.Store_Name as storeName,
        brand.Brand_ID  as brandId,
        brand.Brand_Name  as brandName
      FROM
        iEat_CRM.Brand as brand
      LEFT JOIN iEat_CRM.Store store ON store.Brand_ID = brand.Brand_ID
      WHERE brand.Is_Active = 1 AND store.Is_Active = 1
      ORDER BY brand.Sort_Order
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  async searchDuplicateAccount(req): Promise<any> {
    const _account = this.internalConn.escape(req?.account);
    const _memberId = this.internalConn.escape(req?.memberId);

    let sqlStr = '';
    if (req?.account)
      sqlStr += `
        SELECT
          Account as account
        FROM
          Auth_Member
        WHERE Account = ${_account} AND Is_Active = 1`;

    if (req?.memberId)
      sqlStr += `
        SELECT
          Account as account
        FROM
          Auth_Member
        WHERE Auth_Member_ID != ${_memberId}  AND Is_Active = 1`;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  async updateAccount(set, id: string[]): Promise<void> {
    const updateSqlStr = `UPDATE Auth_Member SET ? WHERE Auth_Member_ID IN (?)`;

    await this.internalConn.query(updateSqlStr, [set, id]);
  }

  async getRoleList(): Promise<GetRoleListInterface[]> {
    const sqlStr = `
      SELECT
        role.Role_ID as roleId,
        role.Role_Name as roleName,
        role.Role_Description as description,
        role.Home_Page as homePage,
        role.Role_State as state,
        role.Create_Date as createDate,
        IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = role.Create_ID), 'system') as createName,
        role.Alter_Date as alterDate,
        IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = role.Alter_ID), 'system') as alterName,
        IFNULL(mr.Total_Count, 0) as totalCount
      FROM
        Auth_Role role
      LEFT JOIN (
        SELECT
          count(1) as Total_Count,
          Role_ID
        FROM
          Map_Auth_Mem_Role
        WHERE Is_Active = 1
        GROUP BY Role_ID) mr ON mr.Role_ID = role.Role_ID
      WHERE Is_Active = 1
      ORDER BY role.Sort_Order, role.Create_Date DESC

    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  async getAuthItems(): Promise<GetAuthInterface[]> {
    const sqlStr = `
      SELECT
        ap.Permission_ID as permissionId,
        ap.Permission_Code as permissionCode,
        ap.Permission_Name as permissionName,
        ap.Permission_Type as permissionType,
        Dependence as dependence
      FROM
        Auth_Permission ap
      WHERE Is_Active = 1
      ORDER BY CAST(Permission_ID AS unsigned)
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  async addRole(roleSet): Promise<void> {
    const sqlStr = `INSERT INTO Auth_Role SET ?`;

    await this.internalConn.query(sqlStr, [roleSet]);
  }

  async getRoleItems(roleId): Promise<GetRoleItems[]> {
    const sqlStr = `
      SELECT
        DISTINCT marp.Permission_ID as permissionId,
        marp.Alter_Date as alterDate
      FROM
        Map_Auth_Role_Permission marp
      INNER JOIN Auth_Permission ap ON ap.Permission_ID = marp.Permission_ID AND ap.Is_Active = 1
      WHERE marp.Is_Active = 1 AND marp.Role_ID = ?
    `;

    const result = (await this.internalConn.query(sqlStr, [roleId])) ?? [];

    return result;
  }

  async deleteRole(roleIdList): Promise<void> {
    const sqlStr = `DELETE FROM Auth_Role  WHERE Role_ID IN ?`;

    await this.internalConn.query(sqlStr, [roleIdList]);
  }

  async updateRole(set, roleId): Promise<void> {
    const updateSql = `UPDATE Auth_Role SET ?, Alter_Date = CURRENT_TIMESTAMP WHERE Role_ID = ?`;
    await this.internalConn.query(updateSql, [set, roleId]);
  }

  async checkAddRole(roleList, roleId): Promise<[]> {
    const roleListSplit = roleList.toString();
    const _roleId = this.internalConn.escape(roleId);

    let sqlStr = `
      SELECT
        Role_Name
      FROM
        Auth_Role
      WHERE Role_Name in (?)
    `;

    if (roleId) sqlStr += ` AND Role_ID != ${_roleId}`;

    const result =
      (await this.internalConn.query(sqlStr, [roleListSplit])) ?? [];

    return result;
  }

  async getMemberPermission(memberId) {
    const sqlStr = `
      SELECT
        marp.Permission_ID as permissionId,
        ap.Permission_Code as permissionCode
      FROM
        Map_Auth_Mem_Role mamr
      LEFT JOIN Map_Auth_Role_Permission marp ON mamr.Role_ID = marp.Role_ID AND marp.Is_Active = 1
      LEFT JOIN Auth_Permission ap ON ap.Permission_ID = marp.Permission_ID AND ap.Is_Active = 1
      LEFT JOIN Auth_Role ar ON ar.Role_ID = mamr.Role_ID AND Role_State = 1
      WHERE mamr.Member_ID = ?
        AND mamr.Is_Active= 1
        AND marp.Permission_ID IS NOT NULL
    `;

    const result = (await this.internalConn.query(sqlStr, [memberId])) ?? [];
    return result;
  }

  async addAndCopyRole(set): Promise<void> {
    const sqlStr = `INSERT INTO Auth_Role SET ?`;

    await this.internalConn.query(sqlStr, [set]);
  }

  async updateAccountTransaction(
    set,
    authMemberId: string,
    req
  ): Promise<void> {
    const connection = await this.internalConn.getConnection();
    const _authMemberId = this.internalConn.escape(authMemberId);
    const _updName = this.internalConn.escape(req.iam.authMemberId);
    try {
      await connection.beginTransaction();
      // 更新帳號
      const updateSqlStr = `UPDATE Auth_Member SET ? WHERE Auth_Member_ID = ${_authMemberId}`;

      await connection.query(updateSqlStr, [set]);

      // 刪掉該角色所有權限
      const delRoleSql = `
        UPDATE Map_Auth_Mem_Role
        SET Is_Active = 0
        WHERE Member_ID = ?`;
      await this.internalConn.query(delRoleSql, [authMemberId]);
      // 新增腳色權限
      for (const role of req.roleList) {
        const _roleId = this.internalConn.escape(role);
        const insertSql = `
      INSERT INTO
        Map_Auth_Mem_Role (Member_ID, Role_ID,  Map_State, Is_Active, Create_ID)
        VALUES (${_authMemberId}, ${_roleId}, 1, 1, ${_updName})
      ON DUPLICATE KEY UPDATE
        Map_State = 1,
        Is_Active = 1;
    `;
        await this.internalConn.query(insertSql, []);
      }
      // 更新門市
      const delDepartSql = `
      UPDATE Map_Auth_Mem_Depart
      SET Is_Active = 0
      WHERE Member_ID = ?`;
      await this.internalConn.query(delDepartSql, [authMemberId]);
      // 新增腳色權限
      for (const depart of req.departmentList) {
        const _departId = this.internalConn.escape(depart);
        const insertSql = `
      INSERT INTO
        Map_Auth_Mem_Depart (Member_ID, Depart_ID,  Map_State, Is_Active, Create_ID)
        VALUES (${_authMemberId}, ${_departId}, 1, 1, ${_updName})
      ON DUPLICATE KEY UPDATE
        Map_State = 1,
        Is_Active = 1;
    `;
        await this.internalConn.query(insertSql, []);
      }
      await connection.commit();
      await connection.release();
    } catch (err) {
      await connection.release();
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }

  async addAccountTransaction(set, req): Promise<void> {
    const authMemberId = set.Auth_Member_ID;
    const roleList = req?.roleList;
    const departList = req?.departmentList;
    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 建立會員資料
      const insertMemberSql = `INSERT INTO Auth_Member SET ?`;
      await connection.query(insertMemberSql, [set]);

      // 加入角色
      const insertRoleMemberMapSql = `INSERT INTO Map_Auth_Mem_Role SET ?`;
      for (const role of roleList) {
        const tempSet = {
          Member_ID: authMemberId,
          Role_ID: role,
          Map_State: 1,
          Create_ID: req.iam.authMemberId
        };
        await connection.query(insertRoleMemberMapSql, [tempSet]);
      }

      // 加入門市
      const insertDepartMemberMapSql = `INSERT INTO Map_Auth_Mem_Depart SET ?`;
      for (const depart of departList) {
        const tempSet = {
          Member_ID: authMemberId,
          Depart_ID: depart,
          Map_State: 1,
          Create_ID: req.iam.authMemberId
        };
        await connection.query(insertDepartMemberMapSql, [tempSet]);
      }

      await connection.commit();
      await connection.release();
    } catch (err) {
      await connection.release();
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }

  async updateRolePermissionsTransaction(req): Promise<void> {
    const _roleId = this.internalConn.escape(req?.roleId);
    const _createName = this.internalConn.escape(req.iam.authMemberId);

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 刪掉該角色所有權限
      const delSql = `
      UPDATE Map_Auth_Role_Permission
      SET Is_Active = 0
      WHERE Role_ID = ${_roleId}`;
      await this.internalConn.query(delSql, []);

      let insertSql = '';
      // 新增腳色權限
      for (const permission of req.permissionList) {
        const _permissionId = this.internalConn.escape(permission);
        insertSql += `
      INSERT INTO
        Map_Auth_Role_Permission (Role_ID, Permission_ID,  Map_State, Is_Active, Create_ID)
        VALUES (${_roleId}, ${_permissionId}, 1, 1, ${_createName})
      ON DUPLICATE KEY UPDATE
        Map_State = 1,
        Is_Active = 1;
    `;
      }
      if (insertSql) await this.internalConn.query(insertSql, []);
      await connection.commit();
      await connection.release();
    } catch (err) {
      await connection.release();
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }

  async updateRoleListSortTransaction(req): Promise<void> {
    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      let rank = 0;
      const updateSql = `
      UPDATE Auth_Role SET ? WHERE Role_ID = ?
    `;

      for (const roleId of req?.listSorts) {
        const set = {
          Sort_Order: rank,
          Alter_ID: req.iam.authMemberId
        };

        await this.internalConn.query(updateSql, [set, roleId]);

        rank++;
      }

      await connection.commit();
      await connection.release();
    } catch (err) {
      await connection.release();
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }

  /**
   * 複製角色
   * @param copyRoleId 欲複製的角色編號
   * @param newRoleId 新的角色編號
   */
  async copyRole(req: CopyRoletDto, newRoleId: string): Promise<void> {
    const _copyRoleId = this.internalConn.escape(req?.copyRoleId);
    const _newRoleId = this.internalConn.escape(newRoleId);
    const _createId = this.internalConn.escape(req?.iam?.authMemberId);

    const queryStr = /* sql */ `
UPDATE Map_Auth_Role_Permission
SET Is_Active = 0
WHERE Role_ID = ${_newRoleId};

SET @name = (SELECT Role_Name FROM Auth_Role WHERE Role_ID = ${_copyRoleId});
SET @number = (SELECT COUNT(1) FROM Auth_Role WHERE Role_Name LIKE CONCAT(@name,'%') AND Is_Active = 1);
SET @copyNumber= IF(@number=1,'',@number-1);

INSERT INTO Auth_Role
(Role_ID, Role_Name, Home_Page, Sort_Order, Create_ID, Alter_ID)
SELECT ${_newRoleId}, CONCAT(@name,'-複製',@copyNumber), Home_Page, 0, ${_createId}, ${_createId}
FROM Auth_Role
WHERE Role_ID = ${_copyRoleId};

INSERT INTO Map_Auth_Role_Permission
(Role_ID, Permission_ID, Map_State, Create_ID, Alter_ID)
SELECT ${_newRoleId}, Permission_ID, Map_State, ${_createId}, ${_createId}
FROM Map_Auth_Role_Permission
WHERE Role_ID = ${_copyRoleId};
`;

    await this.internalConn.query(queryStr);

    return;
  }
}
