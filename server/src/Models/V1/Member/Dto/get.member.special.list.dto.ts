import { ApiProperty } from '@nestjs/swagger';

export class GetMemberSpecialListResp {
  @ApiProperty({
    title: '特殊類型流水號',
    example: '1',
    description: '特殊類型流水號'
  })
  specialId: number;

  @ApiProperty({
    title: '特殊類型名稱',
    example: '秘密客',
    description: '特殊類型名稱'
  })
  typeName: string;

  @ApiProperty({
    title: '是否可回饋積點',
    example: 'true',
    description: '是否可回饋積點，true:是; false:否'
  })
  isEarnPoints: boolean;

  @ApiProperty({
    title: '是否可升降等',
    example: 'true',
    description: '是否可升降等，true:是; false:否'
  })
  isPromoteRank: boolean;

  @ApiProperty({
    title: '狀態',
    example: 'true',
    description: '是否啟用，true:是; false:否'
  })
  state: boolean;

  @ApiProperty({
    title: '建立時間',
    example: '2023-07-13T07:16:14.000Z',
    description: '建立時間'
  })
  createTime: string;

  @ApiProperty({
    title: '建立人員',
    example: 'Wright',
    description: '建立人員'
  })
  createName: string;

  @ApiProperty({
    title: '更新時間',
    example: '2023-07-13T07:16:14.000Z',
    description: '更新時間'
  })
  alterTime: string;

  @ApiProperty({
    title: '更新人員',
    example: 'Wright',
    description: '更新人員'
  })
  alterName: string;
}
