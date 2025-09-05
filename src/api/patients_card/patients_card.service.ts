import { Injectable } from '@nestjs/common';
import { CreatePatientsCardDto } from './dto/create-patients_card.dto';
import { UpdatePatientsCardDto } from './dto/update-patients_card.dto';

@Injectable()
export class PatientsCardService {
  create(createPatientsCardDto: CreatePatientsCardDto) {
    return 'This action adds a new patientsCard';
  }

  findAll() {
    return `This action returns all patientsCard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patientsCard`;
  }

  update(id: number, updatePatientsCardDto: UpdatePatientsCardDto) {
    return `This action updates a #${id} patientsCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} patientsCard`;
  }
}
