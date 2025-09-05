import { PartialType } from '@nestjs/swagger';
import { CreatePatientsCardDto } from './create-patients_card.dto';

export class UpdatePatientsCardDto extends PartialType(CreatePatientsCardDto) {}
