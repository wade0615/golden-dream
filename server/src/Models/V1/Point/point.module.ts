import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import { BrandModule } from '../Brand/brand.module';
import { ChannelRepository } from '../Channel/channel.repository';
import { CommonService } from '../Common/common.service';
import { CouponRepository } from '../Coupon/coupon.repository';
import { MealPeriodModule } from '../MealPeriod/meal.period.module';
import { MemberRepository } from '../Member/member.repository';
import { MemberShipModule } from '../MemberShip/memberShip.module';
import { StoreRepository } from '../Store/store.repository';
import { TagRepository } from '../Tag/tag.repository';
import { PointController } from './point.controller';
import { PointRepository } from './point.repository';
import { PointService } from './point.service';

@Module({
  imports: [
    MysqlModule,
    CommonModule,
    RedisModule,
    BrandModule,
    MemberShipModule,
    MealPeriodModule
  ],
  controllers: [PointController],
  providers: [
    PointService,
    PointRepository,
    ChannelRepository,
    CouponRepository,
    MemberRepository,
    StoreRepository,
    TagRepository,
    CsvDownloadExample,
    ConvertExcel,
    CommonService
  ]
})
export class PointModule {}
