import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import { HolidayController } from './holiday.controller';
import { HolidayRepository } from './holiday.repository';
import { HolidayService } from './holiday.service';

@Module({
  imports: [MysqlModule, CommonModule],
  controllers: [HolidayController],
  providers: [
    HolidayService,
    HolidayRepository,
    ConvertExcel,
    CsvDownloadExample
  ]
})
export class HolidayModule {}
