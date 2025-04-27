import { Module } from '@nestjs/common';
import { TSO_Controller } from './tso.controller';
import { TSO_Repository } from './tso.repository';
import { TSO_Service } from './tso.service';

import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
// import { FirebaseModule } from 'src/Providers/Database/Firestore/firebase.module';

@Module({
  imports: [MysqlModule],
  controllers: [TSO_Controller],
  providers: [TSO_Repository, TSO_Service]
})
export class TSO_Module {}
