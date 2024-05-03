import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { ChannelRepository } from '../Channel/channel.repository';
import { CouponRepository } from '../Coupon/coupon.repository';
import { MemberShipController } from './memberShip.controller';
import { MemberShipRepository } from './memberShip.repository';
import { MemberShipService } from './memberShip.service';

@Module({
  imports: [MysqlModule, CommonModule, RedisModule],
  controllers: [MemberShipController],
  providers: [
    MemberShipService,
    MemberShipRepository,
    CouponRepository,
    ChannelRepository
  ],
  exports: [MemberShipService, MemberShipRepository]
})
export class MemberShipModule {}
