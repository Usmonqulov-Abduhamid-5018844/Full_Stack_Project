import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';

@Injectable()
export class SpecializationService {
    constructor(private readonly prisma: PrismaService) {}
    async create(createSpecializationDto: CreateSpecializationDto) {
      try {
        const data = await this.prisma.specialization.create({
          data: { ...createSpecializationDto},
        });
        return successRes(data, 201);
      } catch (error) {
        return ErrorHender(error);
      }
    }
  
    async findAll() {
      try {
        const data = await this.prisma.specialization.findMany();
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
        const data = await this.prisma.specialization.findUnique({ where: { id } });
        if (!data) {
          throw new NotFoundException();
        }
        return successRes(data);
      } catch (error) {
        return ErrorHender(error);
      }
    }
  
    async update(id: number, updateSpecializationDto: UpdateSpecializationDto) {
      try {
        const data = await this.prisma.specialization.findUnique({ where: { id } });
        if (!data) {
          throw new NotFoundException();
        }
        const newData = await this.prisma.specialization.update({
          where: { id },
          data: { ...updateSpecializationDto },
        });
        return successRes(newData);
      } catch (error) {
        return ErrorHender(error);
      }
    }
  
    async remove(id: number) {
      try {
        const data = await this.prisma.specialization.findUnique({ where: { id } });
        if (!data) {
          throw new NotFoundException();
        }
        await this.prisma.specialization.delete({ where: { id } });
        return { message: 'Deleted', statusCode: 200 };
      } catch (error) {
        return ErrorHender(error);
      }
    }
}
