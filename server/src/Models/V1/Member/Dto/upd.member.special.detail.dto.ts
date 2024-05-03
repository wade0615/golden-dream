import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdMemberSpecialDetailDto {
  @ApiProperty({
    title: '特殊類型流水號',
    example: '1',
    description: '特殊類型流水號',
    required: false
  })
  @IsNumber()
  @IsOptional()
  specialId: number;

  @ApiProperty({
    title: '特殊類型名稱',
    example: '秘密客',
    description: '特殊類型名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  typeName: string;

  @ApiProperty({
    title: '是否可回饋積點',
    example: 'true',
    description: '是否可回饋積點，true:是; false:否',
    required: true
  })
  @IsBoolean()
  @IsNotEmpty()
  isEarnPoints: boolean;

  @ApiProperty({
    title: '是否可升降等',
    example: 'true',
    description: '是否可升降等，true:是; false:否',
    required: true
  })
  @IsBoolean()
  @IsNotEmpty()
  isPromoteRank: boolean;

  @ApiProperty({
    title: '狀態',
    example: 'true',
    description: '是否啟用，true:是; false:否',
    required: true
  })
  @IsBoolean()
  @IsNotEmpty()
  state: boolean;

  iam: IamDto;
}
