import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    const { doctor_id, patients_id } = createCommentDto;
    try {
      const doctor = await this.prisma.doctors.findUnique({
        where: { id: doctor_id },
      });
      const patient = await this.prisma.patients.findUnique({
        where: { id: patients_id },
      });

      if (!doctor || !patient) {
        throw new NotFoundException('doctor_id or patients_id Not fount');
      }
      const data = await this.prisma.comment.create({ data: createCommentDto });
      return successRes(data, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.comment.findMany();
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
