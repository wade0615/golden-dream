import { Module } from '@nestjs/common';
import { ConfigMysqlModule } from '../../../Config/Database/Mysql/config.module';
import { MysqlProvider } from './mysql.provider';

@Module({
  imports: [ConfigMysqlModule],
  providers: [MysqlProvider],
  exports: [MysqlProvider],
})
export class MysqlModule {}
