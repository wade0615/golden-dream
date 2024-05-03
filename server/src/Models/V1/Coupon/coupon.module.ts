import { Module } from '@nestjs/common';
import { ConfigApiModule } from 'src/Config/Api/config.module';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import { ConvertZip } from 'src/Utils/DataFrame/zip';
import { CommonService } from '../Common/common.service';
import { MemberModule } from '../Member/member.module';
import { MemberShipModule } from '../MemberShip/memberShip.module';
import { RewardCardModule } from '../RewardCard/reward.card.module';
import { RewardCardRepository } from '../RewardCard/reward.card.repository';
import { StoreModule } from '../Store/store.module';
import { StoreRepository } from '../Store/store.repository';
import { TagRepository } from '../Tag/tag.repository';
import { CouponController } from './coupon.controller';
import { CouponRepository } from './coupon.repository';
import { CouponService } from './coupon.service';

@Module({
  imports: [
    MysqlModule,
    CommonModule,
    RedisModule,
    ConfigApiModule,
    MemberShipModule,
    MemberModule,
    StoreModule,
    RewardCardModule
  ],
  controllers: [CouponController],
  providers: [
    CouponService,
    CouponRepository,
    StoreRepository,
    RewardCardRepository,
    CommonService,
    ConvertExcel,
    ConvertZip,
    CsvDownloadExample,
    TagRepository
  ],
  exports: [CouponService, CouponRepository]
})
export class CouponModule {}
