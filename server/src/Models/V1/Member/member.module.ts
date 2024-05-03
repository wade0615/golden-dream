import { Module } from '@nestjs/common';
import { ConfigApiModule } from 'src/Config/Api/config.module';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import { ConvertZip } from 'src/Utils/DataFrame/zip';
import { ChannelModule } from '../Channel/channel.module';
import { ChannelRepository } from '../Channel/channel.repository';
import { CommonService } from '../Common/common.service';
import { CouponRepository } from '../Coupon/coupon.repository';
import { MemberShipModule } from '../MemberShip/memberShip.module';
import { OrderRepository } from '../Order/order.repository';
import { TagRepository } from '../Tag/tag.repository';
import { MemberController } from './member.controller';
import { MemberRepository } from './member.repository';
import { MemberService } from './member.service';

@Module({
  imports: [
    MysqlModule,
    CommonModule,
    RedisModule,
    ConfigApiModule,
    MemberShipModule,
    ChannelModule
  ],
  controllers: [MemberController],
  providers: [
    MemberService,
    MemberRepository,
    ChannelRepository,
    CouponRepository,
    OrderRepository,
    TagRepository,
    CommonService,
    ConvertExcel,
    ConvertZip,
    CsvDownloadExample
  ],
  exports: [MemberService, MemberRepository]
})
export class MemberModule {}
