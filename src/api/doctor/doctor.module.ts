import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';
import { FileService } from '../file/file.service';
import { DoctorFileService } from '../doctor_file/doctor_file.service';
import { Token } from 'src/infrostructure/utils/Token';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService, OtpGenerate, FileService, Token],
})
export class DoctorModule {}
