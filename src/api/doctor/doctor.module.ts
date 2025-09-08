import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService, OtpGenerate],
})
export class DoctorModule {}
