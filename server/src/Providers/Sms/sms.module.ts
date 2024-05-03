import { Module } from '@nestjs/common';
import { SmsProvider } from './sms.provider';

@Module({
  imports: [],
  providers: [SmsProvider],
  exports: [SmsProvider]
})
export class SmsModule {}
