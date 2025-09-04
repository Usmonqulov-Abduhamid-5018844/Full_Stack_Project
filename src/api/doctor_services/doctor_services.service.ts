import { Injectable } from '@nestjs/common';
import { CreateDoctorServiceDto } from './dto/create-doctor_service.dto';
import { UpdateDoctorServiceDto } from './dto/update-doctor_service.dto';

@Injectable()
export class DoctorServicesService {
  create(createDoctorServiceDto: CreateDoctorServiceDto) {
    return 'This action adds a new doctorService';
  }

  findAll() {
    return `This action returns all doctorServices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorService`;
  }

  update(id: number, updateDoctorServiceDto: UpdateDoctorServiceDto) {
    return `This action updates a #${id} doctorService`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorService`;
  }
}
