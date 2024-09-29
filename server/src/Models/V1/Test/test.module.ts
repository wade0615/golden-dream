import { Module } from '@nestjs/common';
import { TestController } from './test.controller';

import { FirebaseModule } from 'src/Providers/Database/Firestore/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [TestController]
})
export class TestModule {}
