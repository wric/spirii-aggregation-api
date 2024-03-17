import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UserAggregate } from 'types/UserAggregate';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/users/:userId')
  getUserAggregate(@Param('userId') userId: string): UserAggregate {
    return this.appService.getUserAggregate(userId);
  }
}
