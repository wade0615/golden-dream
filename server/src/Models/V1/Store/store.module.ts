import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { StoreController } from './store.controller';
import { StoreRepository } from './store.repository';
import { StoreService } from './store.service';

@Module({
  imports: [MysqlModule, CommonModule],
  controllers: [StoreController],
  providers: [StoreService, StoreRepository],
  exports: [StoreRepository]
})
export class StoreModule {}
