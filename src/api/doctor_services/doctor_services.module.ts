import { Module } from '@nestjs/common';
import { DoctorServicesService } from './doctor_services.service';
import { DoctorServicesController } from './doctor_services.controller';

@Module({
  controllers: [DoctorServicesController],
  providers: [DoctorServicesService],
})
export class DoctorServicesModule {}
