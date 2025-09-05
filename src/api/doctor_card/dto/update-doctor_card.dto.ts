import { PartialType } from '@nestjs/swagger';
import { CreateDoctorCardDto } from './create-doctor_card.dto';

export class UpdateDoctorCardDto extends PartialType(CreateDoctorCardDto) {}
