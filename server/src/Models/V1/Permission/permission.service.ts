import { HttpStatus, Injectable } from '@nestjs/common';
import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { AuthService } from '../Auth/auth.service';
import {
  AddAccountDto,
  AddAccountRes,
  AddRoleDto,
  AddRoleRes,
  CopyAccountDto,
  CopyRoletDto,
  DeleteRoleDto,
  GetAccountDepartResp,
  GetAccountInfoResp,
  GetAccountListResp,
  GetRoleListRes,
  GetRolePermissionRes,
  UpdateAccountDto,
  UpdateRoleDto,
  UpdateRolePermissionDto,
  UpdateRoleStateDto,
  updateRoleListSort
} from './Dto';
import { PermissionRepository } from './permission.repository';

import { MetaDataCommon } from 'src/Definition/Dto/common';
import { ENUM_HOME_PAGE } from 'src/Definition/Enum/Permission/home.page.enum';
import { ROLE_ID } from 'src/Definition/Enum/Permission/role.id.enum';
import { AUTH_ITEM_TYPE } from 'src/Definition/Enum/auth.item.type';
import { getRandomString } from 'src/Utils/tools';
import {
  IS_ACTIVE_TYPE,
  STATE_TYPE
} from '../../../Definition/Enum/Permission/permission.role.enum';
import { GetAuthItemsResp } from './Dto/get.auth.item.res';

import moment = require('moment-timezone');

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly authService: AuthService
  ) {}

  /**
   * 驗證 帳號密碼
   * @param pwd
   * @param checkPwd
   * @returns
   */
  async _validateAccountPwd(pwd: string, checkPwd: string): Promise<object> {
    // 密碼為8~20位數的英數混合。
    if (pwd?.length < 8 || pwd?.length > 20)
      throw new CustomerException(configError._330003, HttpStatus.OK);

    // 密碼不為英數混合 => 密碼為8~20位數的英數混合。
    const regex = new RegExp(/[^\w]/);
    if (regex.test(pwd))
      throw new CustomerException(configError._330003, HttpStatus.OK);

    // 若 確認密碼與密碼不同 => 確認密碼與密碼不同，請重新輸入。
    if (pwd !== checkPwd)
      throw new CustomerException(configError._330004, HttpStatus.OK);
    return {};
  }

  /**
   * 建立新的帳號id
   * @returns
   */
  async _generateNewId(): Promise<string> {
    const latestAuthMemberId =
      await this.permissionRepository.getLatestAuthMemberId();

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
   * 檢核新增角色
   * @param roleList
   * @param roleId 編輯時必填
   * @returns
   */
  async _checkAddRole(roleList: string[], roleId?): Promise<object> {
    const checkResult = await this.permissionRepository.checkAddRole(
      roleList,
      roleId
    );

    if (checkResult.length)
      throw new CustomerException(configError._330001, HttpStatus.OK);

    return {};
  }

  /**
   * 取得帳號列表
   * @returns
   */
  async getAccountList(req): Promise<GetAccountListResp> {
    if (!req?.page || !req?.perPage) {
      req.page = 1;
      req.perPage = 20;
    }

    let getAllMemberRaw = await this.permissionRepository.getAuthMemberList(
      req
    );

    getAllMemberRaw = getAllMemberRaw?.map((x) => {
      const departList = x?.departList?.filter((x) => x?.brandId) ?? [];
      return {
        ...x,
        roleName: x?.roleName ?? '',
        departList
      };
    });

    const memberCount = await this.permissionRepository.getAuthMemberListCount(
      req
    );

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: memberCount,
      totalPage: Math.ceil(memberCount / req?.perPage)
    } as MetaDataCommon;

    const result = {
      metaData: metaData,
      memberList: getAllMemberRaw
    };

    return result;
  }

  /**
   * 取得帳號資訊
   * @param authMemberId
   * @returns
   */
  async getAccountInfo(authMemberId: string): Promise<GetAccountInfoResp> {
    // 查詢 單一帳號資訊
    const getMemberInfo = await this.permissionRepository.getMemberDetail(
      authMemberId
    );

    const getMemberRoleInfo = await this.permissionRepository.getMemberRoleInfo(
      authMemberId
    );

    const getMemDepartInfo = await this.permissionRepository.getMemDepartInfo(
      authMemberId
    );

    const depart = getMemDepartInfo.reduce((prev, curr) => {
      const temp = prev?.find((p) => p?.brandId === curr?.brandId);

      if (temp) {
        temp?.store?.push({
          storeId: curr?.storeId,
          storeName: curr?.storeName
        });
      } else {
        prev?.push({
          brandId: curr?.brandId,
          brandName: curr?.brandName,
          store: curr?.storeId
            ? [
                {
                  storeId: curr?.storeId,
                  storeName: curr?.storeName
                }
              ]
            : []
        });
      }

      return prev;
    }, []);

    return {
      authMemberId: getMemberInfo?.authMemberId,
      account: getMemberInfo?.account ?? '',
      authName: getMemberInfo?.name ?? '',
      email: getMemberInfo?.email ?? '',
      remark: getMemberInfo?.remark ?? '',
      createDate: getMemberInfo?.createDate ?? '',
      createName: getMemberInfo?.createName ?? '',
      alterDate: getMemberInfo?.alterDate ?? '',
      alterName: getMemberInfo?.alterName ?? '',
      roleList: getMemberRoleInfo,
      depart: depart
    };
  }

  /**
   * 取得帳號事業部選項
   * @returns
   */
  async getAccountDepart(): Promise<GetAccountDepartResp> {
    // 查詢 所有事業部名字
    const getAllDepartResp = await this.permissionRepository.getAllDepart();

    // 合併事業部資料
    const depart = getAllDepartResp?.reduce((prev, curr) => {
      const temp = prev?.find((p) => p?.brandId === curr?.brandId);

      if (temp) {
        temp?.store?.push({
          storeId: curr?.storeId,
          storeName: curr?.storeName
        });
      } else {
        prev?.push({
          brandId: curr?.brandId,
          brandName: curr?.brandName,
          store: curr?.storeId
            ? [
                {
                  storeId: curr?.storeId,
                  storeName: curr?.storeName
                }
              ]
            : []
        });
      }

      return prev;
    }, []);

    return {
      depart: depart
    };
  }

  /**
   * 編輯帳號
   * @param req
   * @returns
   */
  async updateAccount(req: UpdateAccountDto): Promise<object> {
    const authMemberId = req?.authMemberId;
    // 查詢 帳號是否重複
    const searchDuplicateAccount =
      await this.permissionRepository.searchDuplicateAccount({
        memberId: authMemberId
      });

    if (
      searchDuplicateAccount?.find(
        (account) => account?.account === req?.account
      )
    )
      throw new CustomerException(configError._330001, HttpStatus.OK);

    // 若有填密碼，則確認密碼為必填。
    if (req?.pwd && !req?.checkPwd)
      throw new CustomerException(configError._330002, HttpStatus.OK);

    // 若有填密碼
    let salt;
    let saltPassword;
    if (req?.pwd && req?.checkPwd) {
      // 驗證 編輯帳號密碼
      await this._validateAccountPwd(req?.pwd, req?.checkPwd);
      salt = await this.authService.genSalt();
      saltPassword = await this.authService.cryptoPwd(req?.pwd, salt);
    }

    const updateMemberSet = {
      Auth_Name: req?.authName,
      Auth_Password: saltPassword,
      Remark: req?.remark,
      Salt: salt,
      Alter_Date: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
      Alter_ID: req.iam.authMemberId,
      Email: req?.email
    };

    if (!saltPassword) {
      delete updateMemberSet.Auth_Password;
    }

    if (!salt) {
      delete updateMemberSet.Salt;
    }

    await this.permissionRepository.updateAccountTransaction(
      updateMemberSet,
      authMemberId,
      req
    );

    return {};
  }

  /**
   * 新增帳號
   * @param req
   * @returns
   */
  async addAccount(req: AddAccountDto): Promise<AddAccountRes> {
    const searchDuplicateAccount =
      await this.permissionRepository.searchDuplicateAccount({
        account: req?.account
      });

    if (searchDuplicateAccount?.length)
      throw new CustomerException(configError._330001, HttpStatus.OK);

    await this._validateAccountPwd(req?.pwd, req?.checkPwd);
    const salt = await this.authService.genSalt();
    const saltPassword = await this.authService.cryptoPwd(req?.pwd, salt);

    const authMemberId = await this._generateNewId();

    await this.permissionRepository.addAccountTransaction(
      {
        Auth_Member_ID: authMemberId,
        Account: req?.account,
        Auth_Name: req?.name,
        Auth_Password: saltPassword,
        Remark: req?.remark,
        Create_ID: req.iam.authMemberId,
        Alter_ID: req.iam.authMemberId,
        Salt: salt,
        Email: req?.email
      },
      req
    );

    return { authMemberId: authMemberId };
  }

  /**
   * 複製帳號
   * @param req
   * @returns
   */
  async copyAccount(req: CopyAccountDto): Promise<object> {
    const { copyAuthMemberId } = req;

    const getMemberInfo = await this.getAccountInfo(copyAuthMemberId);
    const getMemberDepartInfo =
      await this.permissionRepository.getMemDepartInfo(copyAuthMemberId);

    // Add account first
    const addNewMember = await this.addAccount(req);

    const newAccountMemberId = addNewMember.authMemberId;

    // update member detail
    const copyMemberSet = {
      Alter_ID: req.iam.authMemberId
    };

    const roleListMap = getMemberInfo.roleList.map((x) => {
      return x.roleId;
    });

    const departMap = getMemberDepartInfo.map((x) => {
      return x.departId;
    });

    const roleDepartSet = {
      roleList: [...roleListMap],
      departList: [...departMap]
    };

    await this.permissionRepository.updateAccountTransaction(
      copyMemberSet,
      newAccountMemberId,
      roleDepartSet
    );
    return { memberId: newAccountMemberId };
  }

  /**
   * 修改帳號狀態
   * @param memberId
   * @param state
   * @returns
   */
  async updateAccountState(req): Promise<object> {
    const authMemberId = req.authMemberId;
    // 修改帳號狀態
    await this.permissionRepository.updateAccount(
      {
        Disable: req.state,
        Alter_ID: req.iam.authMemberId
      },
      authMemberId
    );

    return {};
  }

  /**
   * 刪除帳號
   * @param memberId
   * @returns
   */
  async deleteAccount(req): Promise<object> {
    const authMemberId = req.authMemberId;
    // 軟刪除帳號
    await this.permissionRepository.updateAccount(
      {
        Is_Active: IS_ACTIVE_TYPE.DELETE,
        Alter_ID: req.iam.authMemberId
      },
      authMemberId
    );

    return {};
  }

  /**
   * 取得角色列表
   * @returns
   */
  async getRoleList(): Promise<GetRoleListRes[]> {
    const roleListRaw = await this.permissionRepository.getRoleList();

    const roleList = roleListRaw.reduce((acc, curr) => {
      const role = <GetRoleListRes>{};
      role.roleId = curr?.roleId;
      role.roleName = curr?.roleName;
      role.homePage = curr?.homePage;
      role.description = curr?.description;
      role.state = curr?.state;
      role.createDate = curr?.createDate;
      role.createName = curr?.createName;
      role.alterDate = curr?.alterDate;
      role.alterName = curr?.alterName;
      role.totalCount = curr?.totalCount;

      if (curr?.roleId === ROLE_ID.ADMIN) {
        acc.unshift(role);
        return acc;
      }
      acc.push(role);
      return acc;
    }, []);

    return roleList;
  }

  /**
   * 取得權限列表
   * @returns
   */
  async getAuthItems(): Promise<GetAuthItemsResp> {
    const rawData = await this.permissionRepository.getAuthItems();
    const authItems = [];

    const modules = rawData.filter((item) => {
      return item.permissionType === AUTH_ITEM_TYPE.MODULE;
    });
    const page = rawData.filter((item) => {
      return item.permissionType === AUTH_ITEM_TYPE.PAGE;
    });
    const fun = rawData.filter((item) => {
      return item.permissionType === AUTH_ITEM_TYPE.FUNCTION;
    });

    modules.forEach((module) => {
      authItems.push({
        permissionId: module.permissionId,
        permissionCode: module.permissionCode,
        permissionName: module.permissionName,
        child: []
      });
    });

    authItems.forEach((_module) => {
      page.forEach((_page) => {
        if (_module.permissionCode === _page.dependence) {
          _module.child.push({
            permissionId: _page.permissionId,
            permissionCode: _page.permissionCode,
            permissionName: _page.permissionName,
            child: []
          });
        }
      });
      _module.child.forEach((_children) => {
        fun.forEach((_fun) => {
          if (_children.permissionCode === _fun.dependence) {
            _children.child.push({
              permissionId: _fun.permissionId,
              permissionCode: _fun.permissionCode,
              permissionName: _fun.permissionName
            });
          }
        });
      });
    });

    return {
      authItem: authItems
    };
  }

  /**
   * 取得角色權限
   * @param roleId
   * @returns
   */
  async getRolePermissions(roleId: string): Promise<GetRolePermissionRes> {
    const roleItemsRaw = await this.permissionRepository.getRoleItems(roleId);
    const alterDate = roleItemsRaw.map((x) => {
      return x.alterDate;
    });

    const resultItems = roleItemsRaw?.map((x) => {
      return x?.permissionId;
    });

    return {
      alterDate: alterDate?.[0] ?? '',
      roleItem: resultItems
    };
  }

  /**
   * 修改角色
   * @param roleId
   * @returns
   */
  async updateRoleInfo(req: UpdateRoleDto): Promise<object> {
    const { roleId, roleName } = req;
    if (roleId === ROLE_ID.ADMIN)
      throw new CustomerException(configError._330007, HttpStatus.OK);

    //check roleName
    await this._checkAddRole([roleName], req?.roleId);

    if (
      !Object.values(ENUM_HOME_PAGE)?.includes(req?.homePage as ENUM_HOME_PAGE)
    )
      throw new CustomerException(configError._330006, HttpStatus.OK);

    const updateSet = {
      Role_Name: roleName,
      Alter_ID: req.iam.authMemberId,
      Home_Page: req?.homePage
    };
    await this.permissionRepository.updateRole(updateSet, roleId);

    return {};
  }

  /**
   * 修改角色排序
   * @param roleId
   * @returns
   */
  async updateRoleListSort(req: updateRoleListSort): Promise<object> {
    if (req?.listSorts.length == 0) {
      throw new CustomerException(configError._200007, HttpStatus.OK);
    }

    const roleList = await this.permissionRepository.getRoleList();

    // 判斷修改排序的數量是否為全部
    if (roleList?.length != req?.listSorts.length) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
    await this.permissionRepository.updateRoleListSortTransaction(req);

    return {};
  }

  /**
   * 修改角色權限
   * @param req
   * @returns
   */
  async updateRolePermissions(req: UpdateRolePermissionDto): Promise<object> {
    const { roleId } = req;

    //admin can't update auth items
    if (roleId === ROLE_ID.ADMIN)
      throw new CustomerException(configError._330007, HttpStatus.OK);

    //delete & add role Permissions
    await this.permissionRepository.updateRolePermissionsTransaction(req);

    return {};
  }

  /**
   * 軟刪除角色
   * @param req
   * @returns
   */
  async deleteRole(req: DeleteRoleDto): Promise<object> {
    const { roleId } = req;

    const updateSet = {
      Is_Active: IS_ACTIVE_TYPE.DELETE,
      Alter_ID: req.iam.authMemberId
    };

    await this.permissionRepository.updateRole(updateSet, roleId);
    return {};
  }

  /**
   * 變更角色狀態
   * @param req
   * @returns
   */
  async updateRoleState(req: UpdateRoleStateDto): Promise<object> {
    const { roleId } = req;
    if (roleId === ROLE_ID.ADMIN)
      throw new CustomerException(configError._330007, HttpStatus.OK);

    const updateSet = {
      Role_State: req.state,
      Alter_ID: req.iam.authMemberId
    };
    await this.permissionRepository.updateRole(updateSet, roleId);
    return {};
  }

  /**
   * 新增角色
   * @param req
   * @returns
   */
  async addRole(req: AddRoleDto): Promise<AddRoleRes> {
    //check roleName
    await this._checkAddRole([req?.roleName]);
    const roleId = getRandomString(20);

    const set = {
      Role_ID: roleId,
      Role_Name: req.roleName,
      Home_Page: req?.homePage,
      Role_State: STATE_TYPE.ACTIVE, // 預設為啟用
      Sort_Order: 0,
      Create_ID: req.iam.authMemberId,
      Alter_ID: req.iam.authMemberId
    };

    await this.permissionRepository.addAndCopyRole(set);

    return {
      roleId: roleId
    };
  }

  /**
   * 複製角色
   * @param req
   * @returns
   */
  async copyRole(req: CopyRoletDto): Promise<Record<string, never>> {
    const { copyRoleId } = req;
    if (copyRoleId === ROLE_ID.ADMIN)
      throw new CustomerException(configError._330007, HttpStatus.OK);

    const newRoleId = getRandomString(20);
    await this.permissionRepository.copyRole(req, newRoleId);

    return {};
  }
}
