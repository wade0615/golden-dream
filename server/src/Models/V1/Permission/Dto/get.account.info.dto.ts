import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { GetMemRoleInfo } from '../Interface/get.user.info.interface';

export class GetAccountInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  authMemberId: string;
}

export class Role {
  @ApiProperty({
    title: '角色id'
  })
  roleId: string;
  @ApiProperty({
    title: '名稱id'
  })
  name: string;
}

class Depart {
  brandId: string;
  brandName: string;
  store: Store[];
}

class Store {
  storeId: string;
  storeName: string;
}

export class GetAccountInfoResp {
  @ApiProperty({
    title: '後台auth member id'
  })
  authMemberId: string;

  @ApiProperty({
    title: '帳號'
  })
  account: string;

  @ApiProperty({
    title: '名稱'
  })
  authName: string;

  @ApiProperty({
    title: '備註'
  })
  remark: string;

  @ApiProperty({
    title: '建立時間'
  })
  createDate: string;

  @ApiProperty({
    title: '建立人員'
  })
  createName: string;

  @ApiProperty({
    title: '建立時間'
  })
  alterDate: string;

  @ApiProperty({
    title: '修改人員'
  })
  alterName: string;

  @ApiProperty({
    title: 'email'
  })
  email: string;

  @ApiProperty({
    type: [Role],
    title: '帳號角色'
  })
  roleList: GetMemRoleInfo[];

  @ApiProperty({
    title: '所屬單位'
  })
  depart: Depart[];
}
