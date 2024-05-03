import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class ExportSendLogDto extends PartialType(IamObjectDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sendDate: string;
}
