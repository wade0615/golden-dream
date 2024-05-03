import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { BrandRepository } from '../Brand/brand.repository';
import { ChannelRepository } from '../Channel/channel.repository';
import { StoreRepository } from '../Store/store.repository';
import { CommodityController } from './commodity.controller';
import { CommodityRepository } from './commodity.repository';
import { CommodityService } from './commodity.service';

@Module({
  imports: [MysqlModule, CommonModule],
  controllers: [CommodityController],
  providers: [
    CommodityService,
    CommodityRepository,
    ChannelRepository,
    BrandRepository,
    StoreRepository
  ]
})
export class CommodityModule {}
