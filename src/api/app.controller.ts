import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getRoot() {
    return { message: 'Backend is running 🚀' };
  }
  @Get('test')
  @Throttle({ default: { limit: 5, ttl: 60 } })
  test() {
    return { msg: 'ok' };
  }
}
