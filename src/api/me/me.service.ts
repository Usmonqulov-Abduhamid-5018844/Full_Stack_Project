import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ERols } from 'src/common/enum';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';

@Injectable()
export class MeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(req: Request) {
    const user = req['user'];

    try {
      let data: any = {};
      if (user.role === ERols.ADMIN || user.role === ERols.SUPPER_ADMIN) {
        data = await this.prisma.admins.findUnique({ where: { id: user.id } });
      } else if (user.role === ERols.DOCTOR) {
        data = await this.prisma.doctors.findUnique({
          where: { id: user.id },
          include: {
            Wellet: {
              select:{
                balance:true,
                id: true
              }
            },
           Doctor_file: true,
           Doctor_card: true
          }
        });
      } else {
        data = await this.prisma.patients.findUnique({
          where: { id: user.id },include: {
              Patients_card: true
          }
        });
      }

      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
