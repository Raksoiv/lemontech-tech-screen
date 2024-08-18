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

  async create(createSubscriptionDto: CreateSubscriptionDto, userJwt: User) {
    const user = await this.userService.findOne(userJwt.id);
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

    const subscriptions = await this.subscriptionRepository.findBy({
      target: target,
      user: user,
    });
    if (subscriptions.length > 0) {
      return subscriptions;
    }
    const subscription = this.subscriptionRepository.create();
    subscription.user = user;
    subscription.target = target;
    await this.subscriptionRepository.save(subscription);

    return [subscription];
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

  // remove(id: number) {
  //   return `This action removes a #${id} subscription`;
  // }
}
