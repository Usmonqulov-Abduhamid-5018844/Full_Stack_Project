import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDoctorCardDto } from './dto/create-doctor_card.dto';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { Request } from 'express';
import { ERols } from 'src/common/enum';

@Injectable()
export class DoctorCardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDoctorCardDto: CreateDoctorCardDto, req: Request) {
    const doctor_id = req['user'].id;
    try {
      const data = await this.prisma.doctor_card.create({
        data: { ...createDoctorCardDto, doctor_id },
      });
      return successRes(data, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll(req: Request) {
    const user = req['user'];
    try {
      const where = user.role === ERols.DOCTOR ? { doctor_id: user.id } : {};

      const data = await this.prisma.doctor_card.findMany({ where });
      if (!data.length) {
        throw new NotFoundException('Doctor kartalari topilmadi');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number, req: Request) {
    const user = req['user'];
    try {
      const data = await this.prisma.doctor_card.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException('Doctor kartasi topilmadi');
      }
      const isOwner = data.doctor_id === user.id;
      const isAdmin = [ERols.ADMIN, ERols.SUPPER_ADMIN].includes(user.role);
      if (!isOwner && !isAdmin) {
        throw new ForbiddenException('Siz bu kartaga kira olmaysiz');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number, req: Request) {
    const user = req['user'];
    try {
      const data = await this.prisma.doctor_card.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException('Doctor kartasi topilmadi');
      }
      const isOwner = data.doctor_id === user.id;
      const isAdmin = [ERols.ADMIN, ERols.SUPPER_ADMIN].includes(user.role);
      if (!isOwner && !isAdmin) {
        throw new ForbiddenException("Siz bu kartani o'chira olmaysiz");
      }
      await this.prisma.doctor_card.delete({ where: { id } });

      return { message: 'Deleted', statusCode: 200 };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
