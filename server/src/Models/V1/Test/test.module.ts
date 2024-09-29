import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestRepository } from './test.repository';
import { TestService } from './test.service';

import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
// import { FirebaseModule } from 'src/Providers/Database/Firestore/firebase.module';

@Module({
  imports: [MysqlModule],
  controllers: [TestController],
  providers: [TestRepository, TestService]
})
export class TestModule {}
