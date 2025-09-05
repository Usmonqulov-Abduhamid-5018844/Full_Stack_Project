import { Module } from '@nestjs/common';
import { DoctorSpecializationService } from './doctor_specialization.service';
import { DoctorSpecializationController } from './doctor_specialization.controller';

@Module({
  controllers: [DoctorSpecializationController],
  providers: [DoctorSpecializationService],
})
export class DoctorSpecializationModule {}
