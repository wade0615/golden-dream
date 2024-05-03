import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class WriteOffCouponDetailDto {
  @ApiProperty({
    title: '門市 ID',
    example: 'S2212290072',
    description: '依照門市管理設定',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({
    title: '兌換券核銷類型',
    example: 'WRITE_OFF',
    description: 'WRITE_OFF: 核銷; CANCEL_WRITE_OFF: 取消核銷',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  methods: string;

  @ApiProperty({
    title: '兌換 ID',
    examples: ['R23081700001', 'R23081700002'],
    description: '兌換編碼',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  redeemIds: string[];

  iam: IamDto;
}
