import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTibbiyKorikDto } from './dto/create-tibbiy_korik.dto';
import { UpdateTibbiyKorikDto } from './dto/update-tibbiy_korik.dto';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { Request } from 'express';
import { ERols } from 'src/common/enum';
import { useContainer } from 'class-validator';

@Injectable()
export class TibbiyKorikService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTibbiyKorikDto: CreateTibbiyKorikDto, req: Request) {
    const doctor_id = req['user'].id;
    try {
      const patients = await this.prisma.patients.findUnique({
        where: { id: createTibbiyKorikDto.patients_id },
      });

      if (!patients) {
        throw new NotFoundException('patients_id topilmadi');
      }

      const data = await this.prisma.tibbiy_korik.create({
        data: { ...createTibbiyKorikDto, doctor_id },
      });
      return successRes(data, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll(req: Request) {
    const user = req['user'];
    try {
      let data: any = [];
      const isAdmin = [ERols.ADMIN, ERols.SUPPER_ADMIN].includes(user.role);
      if (isAdmin) {
        data = await this.prisma.tibbiy_korik.findMany({
          include: { Patients: true, doctor: true },
        });
      }
      const where =
        user.role === ERols.DOCTOR
          ? { doctor_id: user.id }
          : { patients_id: user.id };
      if (where) {
        data = await this.prisma.tibbiy_korik.findMany({
          where,
          include: { Patients: true, doctor: true },
        });
      }
      if (!data.length) {
        throw new NotFoundException();
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number, req:Request) {
    const user = req["user"]
    try {
      const data = await this.prisma.tibbiy_korik.findUnique({
        where: { id },
        include: { Patients: true, doctor: true },
      });
      if (!data) {
        throw new NotFoundException();
      }
      const isOwner = data.doctor_id === user.id 
      const isAdmin = [ERols.ADMIN,ERols.SUPPER_ADMIN].includes(user.role)
      if(!isOwner && !isAdmin){
        throw new ForbiddenException("Bu malumotni ko'rish uchun sizda ruxsat yetarliy emas")
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async update(id: number, updateTibbiyKorikDto: UpdateTibbiyKorikDto,req:Request ) {
    const user = req["user"]
    try {
      const data = await this.prisma.tibbiy_korik.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException();
      }
      if(user.id !== data.doctor_id){
        throw new ForbiddenException("Bu malumotni O'zgartirish uchun sizda ruxsat yetarliy emas")
      }
      const newData = await this.prisma.tibbiy_korik.update({
        where: { id },
        data: { ...updateTibbiyKorikDto },
      });
      return successRes(newData);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.tibbiy_korik.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException();
      }
      await this.prisma.tibbiy_korik.delete({ where: { id } });
      return { message: 'Deleted', statusCode: 200 };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
