import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class DownloadReportExportDto {
  @ApiProperty({
    title: '匯出編號',
    example: 'EX00001',
    description: '匯出編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  exportId: string;

  iam: IamDto;
}

export class DownloadReportExportResp {
  @ApiProperty({
    title: '下載網址',
    default: 'https://localhost/',
    description: '下載網址'
  })
  url: string;
}
