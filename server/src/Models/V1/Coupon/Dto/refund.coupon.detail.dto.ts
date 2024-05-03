import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class RefundCouponDetailDto {
  @ApiProperty({
    title: '交易序號 ID',
    example: 'C230811006',
    description: '兌換券交易序號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  iam: IamDto;
}
