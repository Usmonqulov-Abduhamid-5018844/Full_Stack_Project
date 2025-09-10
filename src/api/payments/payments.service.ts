import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentCallbackDto } from './dto/create-payment.dto';
import { Request } from 'express';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { ERols } from 'src/common/enum';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(paymentCallbackDto: PaymentCallbackDto) {
    try {   
      const data =  await this.prisma.payments.create({data: paymentCallbackDto})
      return successRes(data, 201)
    } catch (error) {
      return ErrorHender(error)
    }
  }

  async findAll(req: Request) {
    const user = req['user'];
    try {
      let where: any = {};

      if (user.role === ERols.DOCTOR) {
        where = { doctor_id: user.id };
      } else if (user.role === ERols.PATIENTS) {
        where = { patients_id: user.id };
      }

      const data = await this.prisma.payments.findMany({ where });
      if (!data.length) {
        throw new NotFoundException('Payments not found');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
