import { Module } from '@nestjs/common';
import { BrandRepository } from 'src/Models/V1/Brand/brand.repository';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { ChannelController } from './channel.controller';
import { ChannelRepository } from './channel.repository';
import { ChannelService } from './channel.service';

@Module({
  imports: [MysqlModule, CommonModule],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelRepository, BrandRepository],
  exports: [ChannelRepository]
})
export class ChannelModule {}
