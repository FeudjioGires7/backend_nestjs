import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { BullModule } from '@nestjs/bull';
import { MailerProcessor } from './mailer.processor';


@Global()
@Module({
  providers: [MailerProcessor, MailerService],
  imports: [
    BullModule.registerQueue({
      name: 'mail-queue'
    })
  ],
  exports: [MailerService]
})
export class MailerModule {}