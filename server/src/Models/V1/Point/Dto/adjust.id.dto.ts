import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class AdjustIdDto extends PartialType(IamObjectDto) {
  @ApiProperty({
    title: '積點調整編號',
    example: 'A1111',
    description: '積點調整編號',
    required: false
  })
  @IsString()
  @IsOptional()
  adjustId: string;
}
