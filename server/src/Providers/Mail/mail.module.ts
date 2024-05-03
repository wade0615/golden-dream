import { Module } from '@nestjs/common';
import { MailProvider } from './mail.provider';

@Module({
  imports: [],
  providers: [MailProvider],
  exports: [MailProvider]
})
export class MailModule {}
