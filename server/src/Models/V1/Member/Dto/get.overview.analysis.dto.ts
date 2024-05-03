import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetOverviewAnalysisDto {
  @ApiProperty({
    title: '消費品牌名稱',
    example: 'TT',
    description: '消費品牌名稱',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;
}

export class ConsumptionBrand {
  @ApiProperty({
    title: '消費品牌名稱',
    example: 'TT',
    description: '消費品牌名稱'
  })
  brandName: string;

  @ApiProperty({
    title: '消費品牌次數',
    example: '1',
    description: '消費品牌次數'
  })
  brandCount: number;

  @ApiProperty({
    title: '最近消費日',
    example: '2023/01/06',
    description: '最近消費日'
  })
  consumptionDate: string;
}

export class ConsumptionCommodity {
  @ApiProperty({
    title: '消費商品名稱',
    example: '牛排',
    description: '消費商品名稱'
  })
  commodityName: string;

  @ApiProperty({
    title: '消費商品次數',
    example: '1',
    description: '消費商品次數'
  })
  commodityCount: number;

  @ApiProperty({
    title: '最近消費日',
    example: '2023/01/06',
    description: '最近消費日'
  })
  consumptionDate: string;
}

export class ConsumptionElectronicCoupon {
  @ApiProperty({
    title: '消費商品名稱',
    example: '牛排',
    description: '消費商品名稱'
  })
  electronicCouponName: string;

  @ApiProperty({
    title: '電子票券次數',
    example: '1',
    description: '電子票券次數'
  })
  electronicCouponCount: number;

  @ApiProperty({
    title: '最近消費日',
    example: '2023/01/06',
    description: '最近消費日'
  })
  consumptionDate: string;
}

export class OverviewAnalysisMemberShipDetail {
  @ApiProperty({
    title: '會籍名稱',
    example: '金卡',
    description: '會籍名稱'
  })
  memberShipName: string;

  @ApiProperty({
    title: '晉升條件',
    example: '晉升',
    description: '晉升條件'
  })
  memberShipMethodsName: string;

  @ApiProperty({
    title: '消費次數',
    example: '1',
    description: '差異消費次數'
  })
  consumptionCount: number;

  @ApiProperty({
    title: '差額',
    example: '8000',
    description: '差額'
  })
  consumptionAmount: number;
}

export class OverviewAnalysisPointDetail {
  @ApiProperty({
    title: '剩餘可使用積點',
    example: '200',
    description: '剩餘可使用積點'
  })
  lastPoint: number;

  @ApiProperty({
    title: '即將到期積點',
    example: '100',
    description: '即將到期積點'
  })
  expiringPoint: number;
}

export class OverviewAnalysisConsumptionDetail {
  @ApiProperty({
    title: '年度消費次數',
    example: '3',
    description: '年度消費次數'
  })
  consumptionCount: number;

  @ApiProperty({
    title: '年度消費金額',
    example: '10000',
    description: '年度消費金額'
  })
  consumptionAmount: number;
}

export class Analysis {
  @ApiProperty({ type: [ConsumptionBrand] })
  consumptionBrand: ConsumptionBrand[];

  @ApiProperty({ type: [ConsumptionCommodity] })
  consumptionCommodity: ConsumptionCommodity[];

  @ApiProperty({ type: [ConsumptionElectronicCoupon] })
  consumptionElectronicCoupon: ConsumptionElectronicCoupon[];

  @ApiProperty({ type: OverviewAnalysisMemberShipDetail })
  memberShipDetail: OverviewAnalysisMemberShipDetail;

  @ApiProperty({ type: OverviewAnalysisPointDetail })
  pointDetail: OverviewAnalysisPointDetail;

  @ApiProperty({ type: OverviewAnalysisConsumptionDetail })
  consumptionDetail: OverviewAnalysisConsumptionDetail;
}

export class GetOverviewAnalysisResp {
  @ApiProperty({
    title: '會員卡號',
    example: 'i123456789',
    description: '會員卡號'
  })
  memberCardId: string;

  @ApiProperty({
    title: '生日',
    example: '2023/01/01',
    description: '生日日期',
    required: true
  })
  birthday: string;

  @ApiProperty({
    title: '性別',
    example: 'M',
    description: 'M: 男, F:女, S:保密'
  })
  gender: string;

  @ApiProperty({
    title: '個人推薦碼',
    example: 'HouHouGPT',
    description: '推薦碼'
  })
  referralCode: string;

  @ApiProperty({
    title: '會籍開始日期',
    example: '',
    description: '會籍開始日期'
  })
  memberShipStartDate: string;

  @ApiProperty({
    title: '會籍起始日期',
    example: '',
    description: '會籍起始日期'
  })
  memberShipEndDate: string;

  @ApiProperty({
    title: '註冊時間',
    example: '2023/06/19 16:50:54',
    description: '會員創建的時間'
  })
  registerDate: string;

  @ApiProperty({
    title: '註冊渠道',
    example: '',
    description: '註冊渠道'
  })
  registerChannel: string;

  @ApiProperty({
    title: '開通渠道',
    example: '',
    description: '開通渠道'
  })
  openChannel: string;

  @ApiProperty({
    title: '居住地址',
    example: '',
    description: '居住地址'
  })
  address: string;

  @ApiProperty({
    title: '郵遞區號',
    example: '211',
    description: '郵遞區號'
  })
  zipCode: string;

  @ApiProperty({
    title: '縣市代碼',
    example: '7001',
    description: '縣市代碼'
  })
  cityCode: string;

  @ApiProperty({
    title: '電子郵件',
    example: '17Life@gmail.com',
    description: 'E-mail'
  })
  email: string;

  @ApiProperty({
    title: '標籤名稱',
    examples: ['標籤名稱1', '標籤名稱2'],
    description: '會員所擁有的標籤'
  })
  tagNames: string[];

  @ApiProperty({ type: Analysis })
  analysis: Analysis;
}
