import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamDto } from 'src/Definition/Dto/iam.dto';

export class DelClusterSettingDto {
  @ApiProperty({
    title: '分群編號',
    example: 'C000000001',
    description: '分群編號',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  clusterId: string;

  iam: IamDto;
}
