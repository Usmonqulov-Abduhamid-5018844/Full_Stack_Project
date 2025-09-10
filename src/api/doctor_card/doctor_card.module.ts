import { Module } from '@nestjs/common';
import { DoctorCardService } from './doctor_card.service';
import { DoctorCardController } from './doctor_card.controller';

@Module({
  controllers: [DoctorCardController],
  providers: [DoctorCardService],
})
export class DoctorCardModule {}
