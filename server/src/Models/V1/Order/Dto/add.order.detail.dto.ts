import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class AddOrderDetailDto {
  @ApiProperty({
    title: '交易時間',
    default: '2023-06-26T15:03:38.000Z',
    description: '交易時間',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  transactionTime: string;

  @ApiProperty({
    title: '交易類型',
    default: 'SALE',
    description: '交易類型，SALE: 銷售; RETURN: 退貨',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  transactionType: string;

  @ApiProperty({
    title: '交易序號',
    default: '12345677889123124',
    description: '交易序號，25碼以內',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  transactionCode: string;

  @ApiProperty({
    title: '手機國碼',
    default: '+886',
    description: '手機國碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mobileCountryCode: string;

  @ApiProperty({
    title: '手機號碼',
    default: '912345678',
    description: '手機號碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({
    title: '品牌編號',
    default: '1000',
    description: '依品牌代號設定',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({
    title: '門市編號',
    default: '1000',
    description: '依門市代號設定',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({
    title: '付款方式',
    default: '1',
    description: '依支付方式設定',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  paymentSeq: number;

  @ApiProperty({
    title: '訂單金額',
    default: '1000',
    description: '訂單金額',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    title: '發票',
    default: 'TXGHXD1012',
    description: '發票，限10碼英數字',
    required: false
  })
  @IsString()
  @IsOptional()
  invoiceNumber: string;

  @ApiProperty({
    title: '備註',
    default: '',
    description: '備註',
    required: false
  })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty({
    title: '用餐方式',
    default: 'DINE_IN',
    description: '用餐方式，DINE_IN：內用; TAKE_OUT：外帶',
    required: false
  })
  @IsString()
  @IsOptional()
  mealType: string;

  iam: IamDto;
}
