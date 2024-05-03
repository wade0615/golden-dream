import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class UpdateMotStateDto extends PartialType(IamObjectDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  state: boolean;
}
