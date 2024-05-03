import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class GetMotClusterInfoDto extends PartialType(IamObjectDto) {
  @ApiProperty({
    title: '分群ID',
    example: 'CL0001',
    description: '分群ID',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  clusterId: string;
}

export class GetMotClusterInfoResp {
  clusterName: string;
  action: string;
  clusterDescription: string;
  motSendStatus: string;
  startDate: string;
  endDate: string;
  sendDay: number;
  sendTime: string;
  sendDayBefore: number;
  sendTarget: string;
  fileUrl: string;
  fileName: string;
  sendMethod: string[];
  peopleCount: number;
  positiveData: ClusterData[];
  negativeData: ClusterData[];
  clusterSendContent: ClusterSendContent;
}

export class ClusterData {
  clusterType: string;
  conditional: string;
  setting: JSON;
}

export class ClusterSendContent {
  notifyId: number[];
  smsContent: string;
  appPushTitle: string;
  appPushContent: string;
  msgImg: string;
  msgSource: number;
  msgUrl: string;
  msgType: number;
  emailTitle: string;
  emailContent: string;
  templatePhotoRdo: number;
  templatePhotoImg: string;
  templateColorRdo: number;
  templateColor: string;
  contentRdo: number;
  btnColorRdo: number;
  btnColor: string;
  btnWordRdo: number;
  btnWord: string;
  btnWordingRdo: number;
  btnWording: string;
  btnLinkRto: number;
  btnLink: string;
}
