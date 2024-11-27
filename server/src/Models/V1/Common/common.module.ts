import { Module } from '@nestjs/common';
// import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { MysqlModule } from '../../../Providers/Database/DatabaseMysql/mysql.module';
import { CommonController } from './common.controller';
import { CommonRepository } from './common.repository';
import { CommonService } from './common.service';

@Module({
  imports: [MysqlModule],
  controllers: [CommonController],
  providers: [CommonRepository, CommonService],
  exports: [CommonRepository]
})
export class CommonModule {}
