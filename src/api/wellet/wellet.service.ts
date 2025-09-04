import { Injectable } from '@nestjs/common';
import { CreateWelletDto } from './dto/create-wellet.dto';
import { UpdateWelletDto } from './dto/update-wellet.dto';

@Injectable()
export class WelletService {
  create(createWelletDto: CreateWelletDto) {
    return 'This action adds a new wellet';
  }

  findAll() {
    return `This action returns all wellet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wellet`;
  }

  update(id: number, updateWelletDto: UpdateWelletDto) {
    return `This action updates a #${id} wellet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wellet`;
  }
}
