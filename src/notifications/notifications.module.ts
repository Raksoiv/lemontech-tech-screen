import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TargetsModule } from '../targets/targets.module';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [TargetsModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
