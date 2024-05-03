import { PartialType } from '@nestjs/swagger';
import { IamObjectDto } from 'src/Definition/Dto/iam.dto';

export class ReturnCouponDetailDto extends PartialType(IamObjectDto) {
  couponId: number;
}
