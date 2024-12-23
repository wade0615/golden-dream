import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
// import { FirebaseModule } from 'src/Providers/Database/Firestore/firebase.module';

@Module({
  imports: [MysqlModule],
  controllers: [CategoryController],
  providers: [CategoryRepository, CategoryService]
})
export class CategoryModule {}
