import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private userService: UsersService,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, userJwt: User) {
    const user = await this.userService.findOne(userJwt.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    const subscriptions = await this.subscriptionRepository.findBy({
      path: createSubscriptionDto.path,
      user: user,
    });
    if (subscriptions.length > 0) {
      return subscriptions;
    }
    const subscription = this.subscriptionRepository.create(
      createSubscriptionDto,
    );
    subscription.user = user;
    return this.subscriptionRepository.save(subscription);
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
