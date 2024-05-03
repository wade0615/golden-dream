import { Module } from '@nestjs/common';
import { ConfigKafkaModule } from 'src/Config/Database/Kafka/config.module';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { ChannelModule } from '../Channel/channel.module';
import { CouponModule } from '../Coupon/coupon.module';
import { MemberModule } from '../Member/member.module';
import { MemberShipModule } from '../MemberShip/memberShip.module';
import { OnmService } from './data.sync.service';

@Module({
  imports: [
    MysqlModule,
    CommonModule,
    ConfigKafkaModule,
    MemberModule,
    MemberShipModule,
    CouponModule,
    ChannelModule
  ],
  providers: [OnmService]
})
export class DataSyncModule {}
