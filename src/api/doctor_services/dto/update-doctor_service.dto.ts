import { PartialType } from '@nestjs/swagger';
import { CreateDoctorServiceDto } from './create-doctor_service.dto';

export class UpdateDoctorServiceDto extends PartialType(CreateDoctorServiceDto) {}
