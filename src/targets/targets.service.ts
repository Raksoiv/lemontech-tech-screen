import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Target, TargetType } from './entities/target.entity';
import { Repository } from 'typeorm';
import {
  cacheConstants,
  dateConstants,
  liveScoreConstants,
} from '../constants';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TargetsService {
  constructor(
    @InjectRepository(Target)
    private targetRepository: Repository<Target>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async get_events(id: number) {
    // Check if events for the target are cached
    const cachedEvents = await this.cacheManager.get<any[]>(
      `${cacheConstants.EVENTS_CACHE_KEY}${id}`,
    );
    if (cachedEvents) {
      return cachedEvents;
    }

    const target = await this.targetRepository.findOneBy({ id });
    if (!target) {
      throw new HttpException('Target not found', HttpStatus.NOT_FOUND);
    }

    const events: any[] = [];

    if (target.sType === TargetType.TEAM) {
      const response = await fetch(
        liveScoreConstants.TEAM_API_GEN(target.path),
      );
      const data = await response.json();

      for (const stage of data.Stages) {
        for (const event of stage.Events) {
          const date_str = event.Esd.toString();
          const today = dateConstants.CHILEAN_DATE();
          const todayStr = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;

          if (date_str.startsWith(todayStr)) {
            events.push(event.Eid);
          }
        }
      }
    }

    // Cache the events for the target
    await this.cacheManager.set(
      `${cacheConstants.EVENTS_CACHE_KEY}${id}`,
      events,
      cacheConstants.EVENTS_CACHE_TTL,
    );

    return events;
  }

  async findAllActiveSubscriptions() {
    return await this.targetRepository
      .createQueryBuilder('target')
      .leftJoinAndSelect('target.subscriptions', 'subscription')
      .where('subscription.active = true')
      .getMany();
  }

  async findAllActiveUserSubscriptions(userId: number) {
    return await this.targetRepository
      .createQueryBuilder('target')
      .leftJoinAndSelect('target.subscriptions', 'subscription')
      .where('subscription.active = true')
      .andWhere('subscription.userId = :userId', { userId })
      .getMany();
  }

  // create(createTargetDto: CreateTargetDto) {
  //   return 'This action adds a new target';
  // }

  // findAll() {
  //   return `This action returns all targets`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} target`;
  // }

  // update(id: number, updateTargetDto: UpdateTargetDto) {
  //   return `This action updates a #${id} target`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} target`;
  // }
}
