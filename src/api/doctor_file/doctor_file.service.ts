import { Injectable } from '@nestjs/common';
import { CreateDoctorFileDto } from './dto/create-doctor_file.dto';
import { UpdateDoctorFileDto } from './dto/update-doctor_file.dto';

@Injectable()
export class DoctorFileService {
  create(createDoctorFileDto: CreateDoctorFileDto) {
    return 'This action adds a new doctorFile';
  }

  findAll() {
    return `This action returns all doctorFile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorFile`;
  }

  update(id: number, updateDoctorFileDto: UpdateDoctorFileDto) {
    return `This action updates a #${id} doctorFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorFile`;
  }
}
