import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { liveScoreConstants } from '../constants';
import { Target, TargetType } from '../targets/entities/target.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Target)
    private targetRepository: Repository<Target>,
    private userService: UsersService,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, userJwt: any) {
    const user = await this.userService.findOne(userJwt.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Check if the target exist else create it
    var target = await this.targetRepository.findOneBy({
      path: createSubscriptionDto.path,
    });
    if (!target) {
      target = this.targetRepository.create({
        path: createSubscriptionDto.path,
        sType: createSubscriptionDto.type,
      } as DeepPartial<Target>);
      await this.targetRepository.save(target);
    }

    let subscription = await this.subscriptionRepository.findOneBy({
      target: target,
      user: user,
    });
    if (subscription) {
      await this.subscriptionRepository.update(subscription.id, {
        active: true,
      });
      subscription.active = true;
      return subscription;
    }
    subscription = this.subscriptionRepository.create();
    subscription.user = user;
    subscription.target = target;
    await this.subscriptionRepository.save(subscription);

    return subscription;
  }

  async remove(id: number, userJwt: any) {
    const user = await this.userService.findOne(userJwt.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    // const subscription = await this.subscriptionRepository.findOneBy({ id });
    const subscription = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.user', 'user')
      .where('subscription.id = :id', { id })
      .getOne();
    if (!subscription) {
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);
    } else if (subscription.user.id !== user.id) {
      throw new UnauthorizedException();
    } else if (subscription.active) {
      await this.subscriptionRepository.update(subscription.id, {
        active: false,
      });
      subscription.active = false;
    }

    return subscription;
  }

  // findAll() {
  //   return `This action returns all subscriptions`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} subscription`;
  // }

  // update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
  //   return `This action updates a #${id} subscription`;
  // }
}
