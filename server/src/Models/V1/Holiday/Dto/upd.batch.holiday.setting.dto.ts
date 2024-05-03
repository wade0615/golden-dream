import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class UpdBatchHolidaySettingDto {
  @ApiProperty({
    title: '年度',
    example: '2023',
    description: '年度',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  year: string;

  iam: IamDto;
}
