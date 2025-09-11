import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { Request } from 'express';
import { ERols } from 'src/common/enum';

@Injectable()
export class SpecializationService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createSpecializationDto: CreateSpecializationDto, req: Request) {
    const user = req['user'];
    try {
      const Checket = await this.prisma.doctor_specialization.findFirst({
        where: {
          doctor_id: user.id,
          specialization: {
            name: createSpecializationDto.name,
          },
        },
        select: {
          id: true,
        },
      });
      if (Checket) {
        throw new ConflictException('Bunday spetsaliz name sizda mavjud.');
      }
      let spetsalize = await this.prisma.specialization.findFirst({
        where: { name: createSpecializationDto.name },
      });
      if (!spetsalize) {
        spetsalize = await this.prisma.specialization.create({
          data: { ...createSpecializationDto },
        });
      }

      await this.prisma.doctor_specialization.create({
        data: {
          doctor_id: user.id,
          specialization_id: spetsalize.id,
        },
      });

      return successRes(spetsalize, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll(req: Request) {
    const user = req['user'];
    try {
      const isDoctor = user.role === ERols.DOCTOR;

      const data = await this.prisma.specialization.findMany({
        where: isDoctor
          ? { Doctor_specialization: { some: { doctor_id: user.id } } }
          : {},
        include: {
          Doctor_specialization: isDoctor
            ? { where: { doctor_id: user.id } }
            : true,
        },
      });
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
      const data = await this.prisma.specialization.findUnique({
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

  async remove(id: number, req: Request) {
    const user = req['user'];
    try {
      const data = await this.prisma.specialization.findUnique({
        where: { id },
        include: { Doctor_specialization: true },
      });
      if (!data?.Doctor_specialization.length) {
        throw new NotFoundException('Specialization topilmadi');
      }
      const isOwner = data.Doctor_specialization.some(
        (i) => i.doctor_id === user.id,
      );
      const isAdmin = [ERols.ADMIN, ERols.SUPPER_ADMIN].includes(user.role);
      if (!isOwner && !isAdmin) {
        throw new ForbiddenException(
          "Siz bu malumotlarni o'chirish huquqiga ega emassiz!",
        );
      }
      if (isAdmin) {
        await this.prisma.specialization.delete({ where: { id } });
      } else {
        await this.prisma.doctor_specialization.deleteMany({
          where: {
            doctor_id: user.id,
            specialization_id: id,
          },
        });
      }

      return { message: 'Deleted', statusCode: 200 };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
