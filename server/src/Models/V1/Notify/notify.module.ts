import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigApiService } from 'src/Config/Api/config.service';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import { ConvertZip } from 'src/Utils/DataFrame/zip';
import { ChannelRepository } from '../Channel/channel.repository';
import { CommonService } from '../Common/common.service';
import { CouponRepository } from '../Coupon/coupon.repository';
import { MemberModule } from '../Member/member.module';
import { MemberShipModule } from '../MemberShip/memberShip.module';
import { OrderRepository } from '../Order/order.repository';
import { TagRepository } from '../Tag/tag.repository';
import { NotifyController } from './notify.controller';
import { NotifyRepository } from './notify.repository';
import { NotifyService } from './notify.service';

@Module({
  imports: [
    MysqlModule,
    CommonModule,
    RedisModule,
    MemberShipModule,
    MemberModule
  ],
  controllers: [NotifyController],
  providers: [
    NotifyService,
    NotifyRepository,
    ChannelRepository,
    CouponRepository,
    ConfigApiService,
    OrderRepository,
    TagRepository,
    CommonService,
    ConfigService,
    ConvertExcel,
    ConvertZip,
    CsvDownloadExample
  ]
})
export class NotifyModule {}
