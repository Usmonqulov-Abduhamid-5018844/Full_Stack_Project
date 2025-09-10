import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorCardDto } from './dto/create-doctor_card.dto';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { Request } from 'express';

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

  async findAll() {
    try {
      const data = await this.prisma.doctor_card.findMany();
      if (!data.length) {
        throw new NotFoundException();
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.doctor_card.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException();
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.doctor_card.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException();
      }
      await this.prisma.doctor_card.delete({ where: { id } });
      return { message: 'Deleted', statusCode: 200 };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
