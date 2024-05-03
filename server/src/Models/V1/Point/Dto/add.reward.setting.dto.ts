import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength
} from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class AddRewardSettingtDto extends PartialType(IamObjectDto) {
  @ApiProperty({
    title: '活動編號',
    example: 'R230823001',
    description: '活動編號',
    required: false
  })
  @IsString()
  @IsOptional()
  rewardId: string;

  @ApiProperty({
    title: '通用渠道',
    example: 'Ch001',
    description: '通用渠道',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @ApiProperty({
    title: '活動名稱',
    example: '搶頭香活動',
    description: '活動名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  rewardName: string;

  @ApiProperty({
    title: '開始時間',
    example: 'yyyy/mm/dd HH:mm:ss',
    description: '開始時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    title: '結束時間',
    example: 'yyyy/mm/dd HH:mm:ss',
    description: '結束時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    title: '會籍',
    description: '會籍',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  memberShip: string[];

  @ApiProperty({
    title: '贈送積點',
    example: 99,
    description: '贈送積點',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  @Max(99999999)
  handselPoint: number;

  @ApiProperty({
    title: '積點效期',
    example: '積點預設效期0/指定天數1',
    description: '積點效期',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  activeStatus: number;

  @ApiProperty({
    title: '指定幾天',
    example: '3',
    description: '指定幾天',
    required: false
  })
  @IsNumber()
  @IsOptional()
  activeDay: number;

  @ApiProperty({
    title: '備註',
    example: '備註',
    description: '備註',
    required: false
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  remark: string;
}
