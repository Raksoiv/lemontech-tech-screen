import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Target, TargetType } from './entities/target.entity';
import { Repository } from 'typeorm';
import { dateConstants, liveScoreConstants } from '../constants';

@Injectable()
export class TargetsService {
  constructor(
    @InjectRepository(Target)
    private targetRepository: Repository<Target>,
  ) {}

  async get_events(id: number) {
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

    return events;
  }

  async findAllActiveSubscriptions() {
    return await this.targetRepository
      .createQueryBuilder('target')
      .leftJoinAndSelect('target.subscriptions', 'subscription')
      .where('subscription.active = true')
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
