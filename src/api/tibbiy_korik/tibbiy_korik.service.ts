import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateTibbiyKorikDto } from './dto/create-tibbiy_korik.dto';
import { UpdateTibbiyKorikDto } from './dto/update-tibbiy_korik.dto';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { Request } from 'express';

@Injectable()
export class TibbiyKorikService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTibbiyKorikDto: CreateTibbiyKorikDto, req:Request) {
    const doctor_id = req["user"].id
    try {
      const patients = await this.prisma.patients.findUnique({where: {id: createTibbiyKorikDto.patients_id}})

      if(!patients){
        throw new NotFoundException("patients_id not fount")
      }

      const data = await this.prisma.tibbiy_korik.create({
        data: { ...createTibbiyKorikDto, doctor_id },
      });
      return successRes(data, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.tibbiy_korik.findMany();
      if (!data.length) {
        throw new NotAcceptableException();
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.tibbiy_korik.findUnique({ where: { id } });
      if (!data) {
        throw new NotAcceptableException();
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async update(id: number, updateTibbiyKorikDto: UpdateTibbiyKorikDto) {
    try {
      const data = await this.prisma.tibbiy_korik.findUnique({ where: { id } });
      if (!data) {
        throw new NotAcceptableException();
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
        throw new NotAcceptableException();
      }
      await this.prisma.tibbiy_korik.delete({ where: { id } });
      return { message: 'Deleted', statusCode: 200 };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
