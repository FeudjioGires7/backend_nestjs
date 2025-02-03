import { Module } from '@nestjs/common';
import { QueueService } from './Queue.service';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from 'src/mailer/mailer.module';
@Module({
  providers: [QueueService, MailerModule],
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      }
    }),
    BullModule.registerQueue({
      name: 'mail'
    })
  ]
})
export class QueueModule {}
