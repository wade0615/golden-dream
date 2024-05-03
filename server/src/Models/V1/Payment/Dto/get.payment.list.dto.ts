import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetPaymentListDto {
  @ApiProperty({
    title: '付款方式id',
    example: 1,
    description: '流水號',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    title: '付款方式代碼',
    example: 'AA',
    description: '付款方式代碼',
    required: true,
  })
  @IsString()
  paymentId: string;

  @ApiProperty({
    title: '付款方式名稱',
    example: '行動支付',
    description: '付款方式代碼',
    required: true,
  })
  @IsString()
  paymentName: string;

  @ApiProperty({
    title: '建立時間',
    example: '2023-07-14T02:18:12.000Z',
    description: '建立時間',
  })
  @IsBoolean()
  @IsOptional()
  createDate: boolean;

  @ApiProperty({
    title: '建立人員',
    example: 'Tommy',
    description: '建立人員',
  })
  @IsBoolean()
  @IsOptional()
  createName: boolean;

  @ApiProperty({
    title: '更新時間',
    example: '2023-07-14T02:18:12.000Z',
    description: '更新時間',
  })
  @IsBoolean()
  @IsOptional()
  alterDate: boolean;

  @ApiProperty({
    title: '更新人員',
    example: 'Tommy',
    description: '更新人員',
  })
  @IsBoolean()
  @IsOptional()
  alterName: boolean;
}
