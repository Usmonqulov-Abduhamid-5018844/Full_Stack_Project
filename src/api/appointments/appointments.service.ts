import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { Request } from 'express';
import { ERols } from 'src/common/enum';
import { UpdatePariensAppointmentDto } from './dto/updatePstiens-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAppointmentDto: CreateAppointmentDto, req: Request) {
    const patient_id = req['user'].id;
    try {
      const data = await this.prisma.appointments.create({
        data: { ...createAppointmentDto, patient_id },
      });
      return successRes(data, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.appointments.findMany();
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
      const data = await this.prisma.appointments.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException();
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
    req: Request,
  ) {
    const user = req['user'];
    try {
      const data = await this.prisma.appointments.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException();
      }
      if (
        data.doctor_id !== user.id &&
        user.role !== ERols.ADMIN &&
        user.role !== ERols.SUPPER_ADMIN
      ) {
        throw new ForbiddenException(
          'Bu appointmentni yangilashga huququngiz yetarliy emas!',
        );
      }
      const newData = await this.prisma.appointments.update({
        where: { id },
        data: { ...updateAppointmentDto },
      });
      return successRes(newData);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async patients(
    updatePariensAppointmentDto: UpdatePariensAppointmentDto,
    id: number,
    req: Request,
  ) {
    const user = req['user'];
    try {
      const data = await this.prisma.appointments.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException('Appointment not Fount');
      }
      if (data.patient_id !== user.id) {
        throw new ForbiddenException('Bu appointment sizga tegishli emas!');
      }
      const newData = await this.prisma.appointments.update({
        where: { id: data.id },
        data: { ...updatePariensAppointmentDto },
      });
      return successRes(newData);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
