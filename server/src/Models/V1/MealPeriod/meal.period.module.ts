import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { MealPeriodController } from './meal.period.controller';
import { MealPeriodRepository } from './meal.period.repository';
import { MealPeriodService } from './meal.period.service';

@Module({
  imports: [MysqlModule, CommonModule],
  controllers: [MealPeriodController],
  providers: [MealPeriodService, MealPeriodRepository],
  exports: [MealPeriodService, MealPeriodRepository]
})
export class MealPeriodModule {}
