import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TargetsModule } from '../targets/targets.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TargetsModule],
  providers: [NotificationsService],
})
export class NotificationsModule {}
