import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorServiceDto } from './dto/create-doctor_service.dto';
import { UpdateDoctorServiceDto } from './dto/update-doctor_service.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';

@Injectable()
export class DoctorServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDoctorServiceDto: CreateDoctorServiceDto, req:Request) {
    const doctor_id = req["user"].id
    try {
      const data = await this.prisma.doctor_services.create({
        data: { ...createDoctorServiceDto, doctor_id },
      });
      return successRes(data, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.doctor_services.findMany();
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
      const data = await this.prisma.doctor_services.findUnique({
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

  async update(id: number, updateDoctorServiceDto: UpdateDoctorServiceDto) {
    try {
      const data = await this.prisma.doctor_services.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException();
      }
      const newData = await this.prisma.doctor_services.update({
        where: { id },
        data: { ...updateDoctorServiceDto },
      });
      return successRes(newData);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.doctor_services.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException();
      }
      await this.prisma.doctor_services.delete({ where: { id } });
      return { message: 'Deleted', statusCode: 200 };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
