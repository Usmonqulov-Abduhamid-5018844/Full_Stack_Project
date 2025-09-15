import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { Request } from 'express';
import { ERols } from 'src/common/enum';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, req: Request) {
    const user = req['user'];

    const { doctor_id, patients_id } = createCommentDto;
    try {
      const doctor = await this.prisma.doctors.findUnique({
        where: { id: doctor_id },
      });
      const patient = await this.prisma.patients.findUnique({
        where: { id: patients_id },
      });

      if (!doctor)
        throw new NotFoundException(`Doctor with id ${doctor_id} not found`);
      if (!patient)
        throw new NotFoundException(`Patient with id ${patients_id} not found`);

      if (user.role !== createCommentDto.sender) {
        throw new BadRequestException(
          `Siz ${createCommentDto.sender} sifatida xabar yuborolmaysiz`,
        );
      }

      if (createCommentDto.sender === ERols.DOCTOR) {
        if (
          user.role !== ERols.DOCTOR ||
          user.id !== createCommentDto.doctor_id
        ) {
          throw new BadRequestException(
            `Siz boshqa doctor nomidan xabar yuborolmaysiz`,
          );
        }
      } else if (createCommentDto.sender === ERols.PATIENTS) {
        if (
          user.role !== ERols.PATIENTS ||
          user.id !== createCommentDto.patients_id
        ) {
          throw new BadRequestException(
            `Siz boshqa patient nomidan xabar yuborolmaysiz`,
          );
        }
      } else {
        throw new BadRequestException(`Sender noto'g'ri`);
      }
      const now = new Date()
      const comments = await this.prisma.comment.findMany({
        where: {
          doctor_id,
          patients_id,
          created_at: {
            gte: new Date(now.getFullYear(), now.getMonth(), 1),
            lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
          },
          star: { not: null },
        },
      });

      if (comments.length) {
        throw new BadRequestException(
          'Siz bu doctor uchun shu oyda reyting qoldirgansiz',
        );
      }

      const data = await this.prisma.comment.create({ data: createCommentDto });

      const patientComments = await this.prisma.comment.findMany({
        where: { sender: ERols.PATIENTS },
        select: { star: true, doctor_id: true },
      });

      const doctorMap: Record<number, { total: number; count: number }> = {};

      patientComments.forEach((c) => {
        if (c.star != null) {
          if (!doctorMap[c.doctor_id]) {
            doctorMap[c.doctor_id] = { total: 0, count: 0 };
          }
          doctorMap[c.doctor_id].total += c.star;
          doctorMap[c.doctor_id].count += 1;
        }
      });

      for (const doctorId of Object.keys(doctorMap)) {
        const { total, count } = doctorMap[doctorId];
        const avgReyting = parseFloat((total / count).toFixed(1));
        await this.prisma.doctors.update({
          where: { id: Number(doctorId) },
          data: {
            reyting: avgReyting,
            reyting_count: count,
          },
        });
      }

      return successRes(data, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll(query: Record<string, any>) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'star',
      order = 'ASC',
      doctor_id,
      patients_id,
    } = query;
    try {
      let where: any = {};
      if (doctor_id) {
        where.doctor_id = Number(doctor_id);
      }
      if (patients_id) {
        where.patients_id = Number(patients_id);
      }
      const total = await this.prisma.comment.count({where})

      const data = await this.prisma.comment.findMany({
        where,
        orderBy: {
          [sortBy]: order.toLowerCase() as 'asc' | 'desc',
        },
        skip: (page - 1) * limit,
        take: Number(limit),
      });

      if (!data.length) {
        throw new NotFoundException();
      }
      return successRes({
        total,
        page: Number(page),
        limit: Number(limit),
        data
      });
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.comment.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not Fount by id');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.comment.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not fount by id');
      }
      await this.prisma.comment.delete({ where: { id: data.id } });
      return { message: 'Deleted', statusCode: 200 };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
