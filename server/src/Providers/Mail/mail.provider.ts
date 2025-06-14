import { Injectable } from '@nestjs/common';
import { ELK_LEVEL } from 'src/Definition/Enum/elk.level.enum';
import { ELKLogObj } from 'src/Definition/Interface/Log/print.log.elk.third.party.interface';
import { LogService } from 'src/Utils/log.service';

const nodemailer = require('nodemailer');
const logService = new LogService();

@Injectable()
export class MailProvider {
  constructor() {}

  async sendEmail(to, subject, html) {
    try {
      const transporter = await nodemailer.createTransport({
        host: 'email-smtp.ap-northeast-1.amazonaws.com',
        port: 587,
        secure: false,
        auth: {
          user: '',
          pass: ''
        }
      });

      await transporter.sendMail({
        from: `系統通知 <services@semple.com>`,
        to,
        subject: subject,
        html
      });

      const elkLogObj = <ELKLogObj>{};
      elkLogObj.level = ELK_LEVEL.INFO;
      elkLogObj.timing = 'sendEmail';
      elkLogObj.service = process.env.APP_NAME;
      elkLogObj.emailTo = to;
      elkLogObj.emailContent = html?.replace(/\s/g, '');
      logService.printELKLog(elkLogObj);
    } catch (error) {
      const elkLogObj = <ELKLogObj>{};
      elkLogObj.level = ELK_LEVEL.WARN;
      elkLogObj.timing = 'sendEmail';
      elkLogObj.service = process.env.APP_NAME;
      elkLogObj.emailTo = to;
      elkLogObj.emailContent = html?.replace(/\s/g, '');
      elkLogObj.msg = error?.message;
      logService.printELKLog(elkLogObj);
    }
  }
}
