import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';
import { FileService } from '../file/file.service';
import { Token } from 'src/infrostructure/utils/Token';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, OtpGenerate, FileService, Token],
})
export class PatientsModule {}
