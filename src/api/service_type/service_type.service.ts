import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceTypeDto } from './dto/create-service_type.dto';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { UpdateServiceTypeDto } from './dto/update-service_type.dto';

@Injectable()
export class ServiceTypeService {
   constructor(private readonly prisma: PrismaService) {}
      async create(createServiceTypeDto: CreateServiceTypeDto) {
        try {
          const data = await this.prisma.service_type.create({
            data: { ...createServiceTypeDto},
          });
          return successRes(data, 201);
        } catch (error) {
          return ErrorHender(error);
        }
      }
    
      async findAll() {
        try {
          const data = await this.prisma.service_type.findMany();
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
          const data = await this.prisma.service_type.findUnique({ where: { id } });
          if (!data) {
            throw new NotFoundException();
          }
          return successRes(data);
        } catch (error) {
          return ErrorHender(error);
        }
      }
    
      async update(id: number, updateServiceTypeDto: UpdateServiceTypeDto) {
        try {
          const data = await this.prisma.service_type.findUnique({ where: { id } });
          if (!data) {
            throw new NotFoundException();
          }
          const newData = await this.prisma.service_type.update({
            where: { id },
            data: { ...updateServiceTypeDto },
          });
          return successRes(newData);
        } catch (error) {
          return ErrorHender(error);
        }
      }
    
      async remove(id: number) {
        try {
          const data = await this.prisma.service_type.findUnique({ where: { id } });
          if (!data) {
            throw new NotFoundException();
          }
          await this.prisma.service_type.delete({ where: { id } });
          return { message: 'Deleted', statusCode: 200 };
        } catch (error) {
          return ErrorHender(error);
        }
      }
}
