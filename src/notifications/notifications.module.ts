import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TargetsModule } from '../targets/targets.module';
import { NotificationsController } from './notifications.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TargetsModule, CacheModule.register()],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
