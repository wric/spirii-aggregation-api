import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
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
  async getUserAggregate(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<UserAggregate> {
    // TODO: handle exception here.
    const { parsedStartDate, parsedEndDate } = this.validateStardAndEndDate(
      startDate,
      endDate,
    );

    const userAggregate = await this.appService.getUserAggregateById(
      userId,
      parsedStartDate,
      parsedEndDate,
    );

    if (userAggregate.userId === null) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return userAggregate;
  }

  @Get('/api/v1/payouts')
  async getPayouts(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Array<Payout>> {
    // TODO: handle exception here.
    const { parsedStartDate, parsedEndDate } = this.validateStardAndEndDate(
      startDate,
      endDate,
    );

    const payouts = this.appService.getPayouts(parsedStartDate, parsedEndDate);
    return payouts;
  }

  validateStardAndEndDate(
    startDate: string,
    endDate: string,
  ): { parsedStartDate: Date; parsedEndDate: Date } {
    let parsedStartDate: Date;
    try {
      parsedStartDate = new Date(startDate);
    } catch {
      throw Error('invalid startDate');
    }

    let parsedEndDate: Date;
    try {
      parsedEndDate = new Date(endDate);
    } catch {
      throw Error('invalid endDate');
    }

    if (parsedStartDate >= parsedEndDate) {
      throw Error('endDate must be after startDate');
    }

    return { parsedStartDate, parsedEndDate };
  }
}
