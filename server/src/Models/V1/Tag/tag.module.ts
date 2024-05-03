import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import { ConvertZip } from 'src/Utils/DataFrame/zip';
import { CommonService } from '../Common/common.service';
import { MemberModule } from '../Member/member.module';
import { MemberRepository } from '../Member/member.repository';
import { TagController } from './tag.controller';
import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';

@Module({
  imports: [MysqlModule, CommonModule, MemberModule, RedisModule],
  controllers: [TagController],
  providers: [
    TagService,
    ConvertZip,
    TagRepository,
    ConvertExcel,
    CommonService,
    MemberRepository,
    CsvDownloadExample
  ]
})
export class TagModule {}
