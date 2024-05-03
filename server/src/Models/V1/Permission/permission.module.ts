import { Module, forwardRef } from '@nestjs/common';

import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { ConfigApiModule } from '../../../Config/Api/config.module';
import { MysqlModule } from '../../../Providers/Database/DatabaseMysql/mysql.module';
import { AuthModule } from '../Auth/auth.module';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    MysqlModule,
    RedisModule,
    ConfigApiModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService, PermissionRepository]
})
export class PermissionModule {}
