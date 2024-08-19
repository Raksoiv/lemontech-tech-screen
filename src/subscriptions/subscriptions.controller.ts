import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  ValidationPipe,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(ValidationPipe) createSubscriptionDto: CreateSubscriptionDto,
    @Request() req: any,
  ) {
    return this.subscriptionsService.create(createSubscriptionDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Request() req: any) {
    return this.subscriptionsService.remove(id, req.user);
  }

  // @Get()
  // findAll() {
  //   return this.subscriptionsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.subscriptionsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  // ) {
  //   return this.subscriptionsService.update(+id, updateSubscriptionDto);
  // }
}
