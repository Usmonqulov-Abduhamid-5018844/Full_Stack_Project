import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorScheduleDto } from './dto/create-doctor_schedule.dto';
import { UpdateDoctorScheduleDto } from './dto/update-doctor_schedule.dto';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';

@Injectable()
export class DoctorSchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDoctorScheduleDto: CreateDoctorScheduleDto, req: Request) {
    const doctor_id = Number(req['user'].id)
    try {
      let newData: any = {...createDoctorScheduleDto}
      if(createDoctorScheduleDto.day_of_week){
       newData.day_of_week = createDoctorScheduleDto.day_of_week.toString();

      } 
      const data = await this.prisma.doctor_schedules.create({
        data: { ...newData, doctor_id },
      });
      return successRes(data, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }
  async findAll() {
    try {
      const data = await this.prisma.doctor_schedules.findMany();
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
      const data = await this.prisma.doctor_schedules.findUnique({
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
  async update(id: number, updateDoctorScheduleDto: UpdateDoctorScheduleDto) {
    try {
      const data = await this.prisma.doctor_schedules.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException();
      }
      let NewData:any = {...updateDoctorScheduleDto}
      if(updateDoctorScheduleDto.day_of_week){
        NewData.day_of_week = updateDoctorScheduleDto.day_of_week.toString()
      }
      const newData = await this.prisma.doctor_schedules.update({
        where: { id },
        data: { ...NewData },
      });
      return successRes(newData)

    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.doctor_schedules.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException();
      }
      await this.prisma.doctor_schedules.delete({ where: { id } });
      return { message: 'Deleted', statusCode: 200 };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
