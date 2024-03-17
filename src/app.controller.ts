import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Payout } from 'types/Payout';
import { UserAggregate } from 'types/UserAggregate';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api/v1/users/:userId')
  getUserAggregate(@Param('userId') userId: string): UserAggregate {
    const userAggregate = this.appService.getUserAggregateById(userId);
    if (userAggregate.userId === null) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    return userAggregate;
  }

  @Get('/api/v1/payouts')
  async getPayouts(): Promise<Array<Payout>> {
    return this.appService.getPayouts();
  }
}
