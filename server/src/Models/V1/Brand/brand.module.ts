import { Module } from '@nestjs/common';
import { ChannelRepository } from 'src/Models/V1/Channel/channel.repository';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { StoreRepository } from 'src/Models/V1/Store/store.repository';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { BrandController } from './brand.controller';
import { BrandRepository } from './brand.repository';
import { BrandService } from './brand.service';

@Module({
  imports: [MysqlModule, CommonModule],
  controllers: [BrandController],
  providers: [
    BrandService,
    BrandRepository,
    ChannelRepository,
    StoreRepository
  ],
  exports: [BrandService, BrandRepository]
})
export class BrandModule {}
