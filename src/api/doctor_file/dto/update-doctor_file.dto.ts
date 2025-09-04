import { PartialType } from '@nestjs/swagger';
import { CreateDoctorFileDto } from './create-doctor_file.dto';

export class UpdateDoctorFileDto extends PartialType(CreateDoctorFileDto) {}
