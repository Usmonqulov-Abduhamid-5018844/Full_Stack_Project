import { Module } from '@nestjs/common';
import { DoctorFileService } from './doctor_file.service';
import { DoctorFileController } from './doctor_file.controller';

@Module({
  controllers: [DoctorFileController],
  providers: [DoctorFileService],
})
export class DoctorFileModule {}
