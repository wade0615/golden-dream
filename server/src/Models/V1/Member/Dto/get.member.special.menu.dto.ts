import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { MenuCommon } from 'src/Definition/Dto/common';

export class GetMemberSpecialTypeMenuDto {
  @ApiProperty({
    title: '狀態',
    example: '',
    description: '是否啟用，OPEN:是; CLOSE:否; 空值:全部',
    required: false
  })
  @IsString()
  @IsOptional()
  state: string;
}

export class GetMemberSpecialTypeMenuResp {
  @ApiProperty({ type: [MenuCommon] })
  list: MenuCommon[];
}
