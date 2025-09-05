import { Injectable } from '@nestjs/common';
import { CreateDoctorSpecializationDto } from './dto/create-doctor_specialization.dto';
import { UpdateDoctorSpecializationDto } from './dto/update-doctor_specialization.dto';

@Injectable()
export class DoctorSpecializationService {
  create(createDoctorSpecializationDto: CreateDoctorSpecializationDto) {
    return 'This action adds a new doctorSpecialization';
  }

  findAll() {
    return `This action returns all doctorSpecialization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorSpecialization`;
  }

  update(id: number, updateDoctorSpecializationDto: UpdateDoctorSpecializationDto) {
    return `This action updates a #${id} doctorSpecialization`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorSpecialization`;
  }
}
