import { Module } from '@nestjs/common';
import { TargetsService } from './targets.service';
import { TargetsController } from './targets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Target } from './entities/target.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Target]), UsersModule],
  controllers: [TargetsController],
  providers: [TargetsService],
  exports: [TypeOrmModule, TargetsService],
})
export class TargetsModule {}
