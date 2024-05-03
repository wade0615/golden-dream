import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  VERSION_NEUTRAL
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';
import {
  AddAccountDto,
  AddRoleDto,
  AddRoleRes,
  CopyAccountDto,
  CopyRoletDto,
  DeleteAccountDto,
  DeleteRoleDto,
  GetAccountDepartResp,
  GetAccountInfoDto,
  GetAccountInfoResp,
  GetAccountListDto,
  GetAccountListResp,
  GetRoleListRes,
  GetRolePermissionDto,
  GetRolePermissionRes,
  UpdateAccountDto,
  UpdateAccountStateDto,
  UpdateRoleDto,
  UpdateRolePermissionDto,
  UpdateRoleStateDto,
  updateRoleListSort
} from './Dto';
import { GetAuthItemsResp } from './Dto/get.auth.item.res';
import { GetAuthItemsDto } from './Dto/get.permission.dto';
import { PermissionService } from './permission.service';

@ApiTags('permission')
@Controller({
  version: VERSION_NEUTRAL,
  path: 'permission'
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * 取得帳號列表
   * @param req
   * @returns
   */
  @Post(apiPath.permission.getAccountList)
  @ApiOperation({
    summary: '取得帳號列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'get account list successful',
    type: GetAccountListResp
  })
  async getAccountList(
    @Body() body: GetAccountListDto
  ): Promise<GetAccountListResp> {
    const data = await this.permissionService.getAccountList(body);
    return data;
  }

  /**
   * 取得帳號資訊
   * @returns
   */
  @Post(apiPath.permission.getAccountInfo)
  @ApiOperation({
    summary: '取得帳號資訊'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'get account info',
    type: GetAccountInfoResp
  })
  async getAccountInfo(
    @Body() body: GetAccountInfoDto
  ): Promise<GetAccountInfoResp> {
    const { authMemberId } = body;
    const result = await this.permissionService.getAccountInfo(authMemberId);

    return result;
  }

  /**
   * 取得事業部選項
   * @returns
   */
  @Get(apiPath.permission.getAccountDepart)
  @ApiOperation({
    summary: '取得事業部選項'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'get account depart info',
    type: GetAccountDepartResp
  })
  async getAccountDepart(): Promise<GetAccountDepartResp> {
    const result = await this.permissionService.getAccountDepart();

    return result;
  }

  /**
   * 新增帳號
   * @param body
   * @returns
   */
  @Post(apiPath.permission.addAccount)
  @ApiOperation({
    summary: '新增後台帳號'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'add account successful'
  })
  async addAccount(@Body() body: AddAccountDto): Promise<object> {
    const result = await this.permissionService.addAccount(body);

    return result;
  }

  /**
   * 複製帳號
   * @param body
   * @returns
   */
  @Post(apiPath.permission.copyAccount)
  @ApiOperation({
    summary: '複製後台帳號'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'add account successful'
  })
  async copyAccount(@Body() body: CopyAccountDto): Promise<object> {
    const result = await this.permissionService.copyAccount(body);

    return result;
  }

  /**
   * 編輯帳號
   * @returns
   */
  @Patch(apiPath.permission.updateAccount)
  @ApiOperation({
    summary: '修改帳號內容'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'update account successful'
  })
  async updateAccount(@Body() body: UpdateAccountDto): Promise<object> {
    const result = await this.permissionService.updateAccount(body);

    return result;
  }

  /**
   * 修改帳號狀態
   * @param body
   * @returns
   */
  @Patch(apiPath.permission.updateAccountState)
  @ApiOperation({
    summary: '修改帳號狀態'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'add account successful'
  })
  async updateAccountState(
    @Body() body: UpdateAccountStateDto
  ): Promise<object> {
    const result = await this.permissionService.updateAccountState(body);

    return result;
  }

  /**
   * 軟刪除帳號
   * @param body
   * @returns
   */
  @Delete(apiPath.permission.deleteAccount)
  async deleteAccount(@Body() body: DeleteAccountDto): Promise<object> {
    const result = await this.permissionService.deleteAccount(body);

    return result;
  }

  /**
   * 取得角色列表
   * @returns
   */
  @Get(apiPath.permission.getRoleList)
  @ApiOperation({
    summary: '取得角色列表'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'add account successful',
    type: [GetRoleListRes]
  })
  async getRoleList(): Promise<GetRoleListRes[]> {
    const result = await this.permissionService.getRoleList();

    return result;
  }

  /**
   * 取得權限列表
   * @returns
   */
  @Get(apiPath.permission.getAuthItems)
  @ApiOperation({
    summary: '取得所有權限清單'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'get all permission successful',
    type: GetAuthItemsDto
  })
  async getAuthItems(): Promise<GetAuthItemsResp> {
    const result = await this.permissionService.getAuthItems();

    return result;
  }

  /**
   * 取得角色權限
   * @returns
   */
  @Post(apiPath.permission.getRolePermissions)
  @ApiOperation({
    summary: '取得角色權限'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'get role permission successful'
  })
  async getRolePermissions(
    @Body() body: GetRolePermissionDto
  ): Promise<GetRolePermissionRes> {
    const { roleId } = body;
    const result = await this.permissionService.getRolePermissions(roleId);

    return result;
  }

  /**
   * 修改角色
   * @returns
   */
  @Patch(apiPath.permission.updateRoleInfo)
  @ApiOperation({
    summary: '編輯角色'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'update role successful'
  })
  async updateRoleInfo(@Body() body: UpdateRoleDto): Promise<object> {
    const result = await this.permissionService.updateRoleInfo(body);

    return result;
  }

  /**
   * 修改角色排序
   * @returns
   */
  @Patch(apiPath.permission.updateRoleListSort)
  @ApiOperation({
    summary: '編輯角色清單排序'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'update role list sort successful'
  })
  async updateRoleListSort(@Body() body: updateRoleListSort): Promise<object> {
    const result = await this.permissionService.updateRoleListSort(body);

    return result;
  }

  /**
   * 修改角色權限
   * @returns
   */
  @Patch(apiPath.permission.updateRolePermissions)
  @ApiOperation({
    summary: '編輯角色權限'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'update role permission successful'
  })
  async updateRolePermissions(
    @Body() body: UpdateRolePermissionDto
  ): Promise<object> {
    const result = await this.permissionService.updateRolePermissions(body);

    return result;
  }

  /**
   * 變更角色狀態
   * @returns
   */
  @Patch(apiPath.permission.updateRoleState)
  @ApiOperation({
    summary: '編輯角色狀態'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'update role state successful'
  })
  async deleteRole(@Body() body: UpdateRoleStateDto): Promise<object> {
    const result = await this.permissionService.updateRoleState(body);

    return result;
  }

  /**
   * 軟刪除角色
   * @returns
   */
  @Delete(apiPath.permission.deleteRole)
  @ApiOperation({
    summary: '刪除角色'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'role delete successful'
  })
  async updateRoleState(@Body() body: DeleteRoleDto): Promise<object> {
    const result = await this.permissionService.deleteRole(body);

    return result;
  }

  /**
   * 新增角色
   * @returns
   */
  @Post(apiPath.permission.addRole)
  @ApiOperation({
    summary: '新增角色'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'add role successful'
  })
  async addRole(@Body() body: AddRoleDto): Promise<AddRoleRes> {
    const result = await this.permissionService.addRole(body);

    return result;
  }

  /**
   * 複製角色
   * @returns
   */
  @Post(apiPath.permission.copyRole)
  @ApiOperation({
    summary: '複製角色'
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'copy role successful'
  })
  async copyRole(@Body() body: CopyRoletDto): Promise<Record<string, never>> {
    const result = await this.permissionService.copyRole(body);

    return result;
  }
}
