import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import { ConvertZip } from 'src/Utils/DataFrame/zip';
import { AuthRepository } from '../Auth/auth.repository';
import { CommonService } from '../Common/common.service';
import { MemberModule } from '../Member/member.module';
import { MemberRepository } from '../Member/member.repository';
import { MotRepository } from '../Mot/mot.repository';
import { TagModule } from '../Tag/tag.module';
import { TagRepository } from '../Tag/tag.repository';
import { ReportController } from './report.controller';
import { ReportRepository } from './report.repository';
import { ReportService } from './report.service';

@Module({
  imports: [MysqlModule, CommonModule, MemberModule, RedisModule, TagModule],
  controllers: [ReportController],
  providers: [
    ReportService,
    ConvertZip,
    ReportRepository,
    ConvertExcel,
    CommonService,
    MemberRepository,
    TagRepository,
    AuthRepository,
    MotRepository
  ]
})
export class ReportModule {}
