import { Injectable } from '@nestjs/common';
import { CreateDoctorCardDto } from './dto/create-doctor_card.dto';
import { UpdateDoctorCardDto } from './dto/update-doctor_card.dto';

@Injectable()
export class DoctorCardService {
  create(createDoctorCardDto: CreateDoctorCardDto) {
    return 'This action adds a new doctorCard';
  }

  findAll() {
    return `This action returns all doctorCard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorCard`;
  }

  update(id: number, updateDoctorCardDto: UpdateDoctorCardDto) {
    return `This action updates a #${id} doctorCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorCard`;
  }
}
