import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { Request } from 'express';
import { successRes } from 'src/infrostructure/utils/succesResponse';

@Injectable()
export class WelletService {
  constructor(private readonly prisma: PrismaService) {}

  async find(req: Request) {
    const user = req['user'];
    try {
      const data = await this.prisma.wellet.findFirst({ where: { doctor_id: user.id } });
      if (!data) {
        throw new NotFoundException('hamyon mavjud emas');
      }

      return successRes({ ...data, balance: data.balance.toNumber() });
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
