import { Module } from '@nestjs/common';
import { WelletService } from './wellet.service';
import { WelletController } from './wellet.controller';

@Module({
  controllers: [WelletController],
  providers: [WelletService],
})
export class WelletModule {}
