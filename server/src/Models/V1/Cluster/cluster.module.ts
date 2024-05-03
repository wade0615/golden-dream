import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { CommonService } from '../Common/common.service';
import { MemberModule } from '../Member/member.module';
import { MotRepository } from '../Mot/mot.repository';
import { TagModule } from '../Tag/tag.module';
import { TagRepository } from '../Tag/tag.repository';
import { ClusterSettingService } from './Setting/cluster.setting.service';
import { ClusterController } from './cluster.controller';
import { ClusterRepository } from './cluster.repository';
import { ClusterService } from './cluster.service';

@Module({
  imports: [MysqlModule, CommonModule, RedisModule, MemberModule, TagModule],
  controllers: [ClusterController],
  providers: [
    ClusterService,
    ClusterRepository,
    CommonService,
    ClusterSettingService,
    TagRepository,
    MotRepository
  ]
})
export class ClusterModule {}
