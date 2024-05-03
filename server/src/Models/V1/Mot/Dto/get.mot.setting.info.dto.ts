import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class NegativeData {
  clusterType: string;
  conditional: string;
  setting: JSON;
}

export class Condiction {
  memberShipId: string;
  memberShipName: string;
  numFirst: number;
  numSec: number;
  amountStart: number;
  amountEnd: number;
}

export class SendSetting {
  @ApiProperty({
    title: '會籍'
  })
  memberShipId: string;

  @ApiProperty({
    title: '會籍名稱'
  })
  memberShipName: string;

  @ApiProperty({
    title: '測試發送通知分類'
  })
  notifyId: number[];

  @ApiProperty({
    title: 'sms 內容'
  })
  smsContent: string;

  @ApiProperty({
    title: 'app 推播 title'
  })
  appPushTitle: string;

  @ApiProperty({
    title: 'app 推播 內容'
  })
  appPushContent: string;

  @ApiProperty({
    title: '訊息匣縮圖'
  })
  msgImg: string;

  @ApiProperty({
    title: '訊息來源'
  })
  msgSource: string;

  @ApiProperty({
    title: '訊息來源下面的網址'
  })
  msgUrl: string;

  @ApiProperty({
    title: '訊息類型'
  })
  msgType: string;

  @ApiProperty({
    title: 'email title'
  })
  emailTitle: string;

  @ApiProperty({
    title: 'email 內容'
  })
  emailContent: string;

  @ApiProperty({
    title: '模板圖片 預設/自訂'
  })
  templatePhotoRdo: number;

  @ApiProperty({
    title: '模板圖片'
  })
  templatePhotoImg: string;

  @ApiProperty({
    title: '模板底色 預設/自訂'
  })
  templateColorRdo: number;

  @ApiProperty({
    title: '模板色碼'
  })
  templateColor: string;

  @ApiProperty({
    title: '內文按鈕 預設/自訂'
  })
  contentRdo: number;

  @ApiProperty({
    title: '按鈕底色 預設/自訂'
  })
  btnColorRdo: number;

  @ApiProperty({
    title: '按鈕底色'
  })
  btnColor: string;

  @ApiProperty({
    title: '按鈕文字顏色 預設/自訂'
  })
  btnWordRdo: number;

  @ApiProperty({
    title: '按鈕文字顏色'
  })
  btnWord: string;

  @ApiProperty({
    title: '按鈕文案 預設/自訂'
  })
  btnWordingRdo: number;

  @ApiProperty({
    title: '按鈕文案'
  })
  btnWording: string;

  @ApiProperty({
    title: '按鈕連結 預設/自訂'
  })
  btnLinkRto: number;

  @ApiProperty({
    title: '按鈕連結'
  })
  btnLink: string;
}

export class GetMotSettingInfoResp {
  @ApiProperty({
    title: '描述'
  })
  des: string;

  @ApiProperty({
    title: '發送方式'
  })
  sendMethod: string[];

  @ApiProperty({
    title: 'MOT事件及發送條件'
  })
  condiction: Condiction[];

  @ApiProperty({
    title: '發送內容設定',
    type: [SendSetting]
  })
  @Type(() => SendSetting)
  sendSetting: SendSetting[];

  @ApiProperty({
    title: '排除條件'
  })
  negativeData: NegativeData[];
}
