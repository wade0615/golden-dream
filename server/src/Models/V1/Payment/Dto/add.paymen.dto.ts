import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddPaymentDto {
  @ApiProperty({
    title: '付款方式代碼',
    example: 'AA',
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
