import { Module } from '@nestjs/common';
import { ConfigRedisModule } from 'src/Config/Database/Redis/config.module';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigRedisModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
