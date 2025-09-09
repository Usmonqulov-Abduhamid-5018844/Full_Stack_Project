import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorSpecializationDto } from './dto/create-doctor_specialization.dto';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';

@Injectable()
export class DoctorSpecializationService {
 constructor(private readonly prisma: PrismaService) {}
    async create(createDoctorSpecializationDto: CreateDoctorSpecializationDto, req: Record<string, any>) {
      const doctor_id = req["user"].id
      try {
        const data = await this.prisma.doctor_specialization.create({
          data: { ...createDoctorSpecializationDto, doctor_id},
        });
        return successRes(data, 201);
      } catch (error) {
        return ErrorHender(error);
      }
    }
  
    async findAll() {
      try {
        const data = await this.prisma.doctor_specialization.findMany();
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
        const data = await this.prisma.doctor_specialization.findUnique({ where: { id } });
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
        const data = await this.prisma.doctor_specialization.findUnique({ where: { id } });
        if (!data) {
          throw new NotFoundException();
        }
        await this.prisma.doctor_specialization.delete({ where: { id } });
        return { message: 'Deleted', statusCode: 200 };
      } catch (error) {
        return ErrorHender(error);
      }
    }
}
