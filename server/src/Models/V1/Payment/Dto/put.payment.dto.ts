import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdPaymentDto {
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
    example: 'BR',
    description: '付款方式代碼',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @ApiProperty({
    title: '付款方式名稱',
    example: '行動支付',
    description: '',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  paymentName: string;
}

export class DelPaymentDto {
  @ApiProperty({
    title: '付款方式id',
    example: 1,
    description: '流水號',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class SortPaymentDto {
  @ApiProperty({
    title: '付款順序',
    examples: ['AA', 'AB'],
    description: '透過id陣列做付款方式排序',
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  listSorts: string[];
}
