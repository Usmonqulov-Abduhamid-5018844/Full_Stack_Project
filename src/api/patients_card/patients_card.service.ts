import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientsCardDto } from './dto/create-patients_card.dto';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';

@Injectable()
export class PatientsCardService {
  constructor(private readonly prisma: PrismaService) {}
 
   async create(createPatientsCardDto: CreatePatientsCardDto, req: Request) {
     const patients_id = req['user'].id;
     try {
       const data = await this.prisma.patients_card.create({
         data: { ...createPatientsCardDto, patients_id },
       });
       return successRes(data, 201);
     } catch (error) {
       return ErrorHender(error);
     }
   }
 
   async findAll() {
     try {
       const data = await this.prisma.patients_card.findMany();
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
       const data = await this.prisma.patients_card.findUnique({
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
 
   async remove(id: number) {
     try {
       const data = await this.prisma.patients_card.findUnique({
         where: { id },
       });
       if (!data) {
         throw new NotFoundException();
       }
       await this.prisma.patients_card.delete({ where: { id } });
       return { message: 'Deleted', statusCode: 200 };
     } catch (error) {
       return ErrorHender(error);
     }
   }
}
