import { Module } from '@nestjs/common';
import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { MysqlModule } from '../../../Providers/Database/DatabaseMysql/mysql.module';
import { MemberRepository } from '../Member/member.repository';
import { TagRepository } from '../Tag/tag.repository';
import { CommonController } from './common.controller';
import { CommonRepository } from './common.repository';
import { CommonService } from './common.service';

@Module({
  imports: [MysqlModule, RedisModule],
  controllers: [CommonController],
  providers: [CommonRepository, CommonService, MemberRepository, TagRepository],
  exports: [CommonRepository]
})
export class CommonModule {}
