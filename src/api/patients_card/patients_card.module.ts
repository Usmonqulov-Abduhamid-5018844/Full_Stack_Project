import { Module } from '@nestjs/common';
import { PatientsCardService } from './patients_card.service';
import { PatientsCardController } from './patients_card.controller';

@Module({
  controllers: [PatientsCardController],
  providers: [PatientsCardService],
})
export class PatientsCardModule {}
