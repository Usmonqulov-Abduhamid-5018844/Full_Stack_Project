import { Injectable } from '@nestjs/common';
import { CreateTibbiyKorikDto } from './dto/create-tibbiy_korik.dto';
import { UpdateTibbiyKorikDto } from './dto/update-tibbiy_korik.dto';

@Injectable()
export class TibbiyKorikService {
  create(createTibbiyKorikDto: CreateTibbiyKorikDto) {
    return 'This action adds a new tibbiyKorik';
  }

  findAll() {
    return `This action returns all tibbiyKorik`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tibbiyKorik`;
  }

  update(id: number, updateTibbiyKorikDto: UpdateTibbiyKorikDto) {
    return `This action updates a #${id} tibbiyKorik`;
  }

  remove(id: number) {
    return `This action removes a #${id} tibbiyKorik`;
  }
}
