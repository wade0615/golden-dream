import { Module } from '@nestjs/common';
import { ConfigApiModule } from 'src/Config/Api/config.module';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import { ConvertZip } from 'src/Utils/DataFrame/zip';
import { BrandRepository } from '../Brand/brand.repository';
import { ChannelRepository } from '../Channel/channel.repository';
import { CommonService } from '../Common/common.service';
import { CouponRepository } from '../Coupon/coupon.repository';
import { CouponService } from '../Coupon/coupon.service';
import { MemberModule } from '../Member/member.module';
import { MemberShipModule } from '../MemberShip/memberShip.module';
import { OrderRepository } from '../Order/order.repository';
import { StoreRepository } from '../Store/store.repository';
import { TagRepository } from '../Tag/tag.repository';
import { RewardCardController } from './reward.card.controller';
import { RewardCardRepository } from './reward.card.repository';
import { RewardCardService } from './reward.card.service';

@Module({
  imports: [
    MysqlModule,
    CommonModule,
    RedisModule,
    ConfigApiModule,
    MemberShipModule,
    MemberModule
  ],
  controllers: [RewardCardController],
  providers: [
    RewardCardService,
    RewardCardRepository,
    CouponService,
    CouponRepository,
    ConvertExcel,
    ConvertZip,
    CommonService,
    StoreRepository,
    BrandRepository,
    ChannelRepository,
    OrderRepository,
    TagRepository,
    CsvDownloadExample
  ]
})
export class RewardCardModule {}
