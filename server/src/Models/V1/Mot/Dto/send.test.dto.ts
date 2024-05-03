import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { EventDto } from './event.dto';

export class SendTestDto extends PartialType(EventDto) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  memberShipId: string;
}
