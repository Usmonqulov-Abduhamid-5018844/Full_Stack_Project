import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceTypeDto } from './dto/create-service_type.dto';
import { PrismaService } from '../prisma/prisma.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { UpdateServiceTypeDto } from './dto/update-service_type.dto';
import { Request } from 'express';
import { ERols } from 'src/common/enum';

@Injectable()
export class ServiceTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceTypeDto: CreateServiceTypeDto, req: Request) {
    const user = req['user'];
    const { price, service_name } = createServiceTypeDto;

    try {
      let serviceType = await this.prisma.service_type.findFirst({
        where: { service_name },
      });

      if (serviceType) {
        const exists = await this.prisma.doctor_services.findFirst({
          where: {
            doctor_id: user.id,
            service_type_id: serviceType.id,
          },
          select: { id: true },
        });

        if (exists) {
          throw new ConflictException('Sizda bu service allaqachon mavjud.');
        }
      } else {
        serviceType = await this.prisma.service_type.create({
          data: { service_name },
        });
      }

      const doctorService = await this.prisma.doctor_services.create({
        data: {
          doctor_id: user.id,
          service_type_id: serviceType.id,
          price,
        },
      });

      return successRes(
        {
          ...doctorService,
          service_type: serviceType,
        },
        201,
      );
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll(req: Request) {
    const user = req['user'];
    try {
      const isDoctor = user.role === ERols.DOCTOR;

      const data = await this.prisma.service_type.findMany({
        where: isDoctor
          ? { doctor_services: { some: { doctor_id: user.id } } }
          : {},
        include: {
          doctor_services: isDoctor
            ? {
                where: { doctor_id: user.id },
                select: { id: true, price: true },
              }
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
      const data = await this.prisma.service_type.findUnique({
        where: { id },
        include: { doctor_services: { select: { id: true, price: true } } },
      });
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
    updateServiceTypeDto: UpdateServiceTypeDto,
    req: Request,
  ) {
    const user = req['user'];
    try {
      const data = await this.prisma.service_type.findUnique({
        where: { id },
        include: { doctor_services: true },
      });

      if (!data?.doctor_services.length) {
        throw new NotFoundException('Sizda bunday service mavjud emas');
      }

      const doctorService = data.doctor_services.find(
        (i) => i.doctor_id === user.id,
      );
      const isAdmin = [ERols.ADMIN, ERols.SUPPER_ADMIN].includes(user.role);

      if (!doctorService && !isAdmin) {
        throw new ForbiddenException("Siz bu serviceni o'zgartira olmaysiz!");
      }

        let updatedServiceType: any = {};
      if (doctorService && updateServiceTypeDto.price) {
        updatedServiceType = await this.prisma.doctor_services.update({
          where: { id: doctorService.id },
          data: { price: updateServiceTypeDto.price },
        });
      }

      if (doctorService && updateServiceTypeDto.service_name) {
        throw new ForbiddenException(
          "Siz service_name ni o'zgartira olmaysiz!",
        );
      }


      if (isAdmin && updateServiceTypeDto.service_name) {
        updatedServiceType = await this.prisma.service_type.update({
          where: { id },
          data: {
            ...(updateServiceTypeDto.service_name && {
              service_name: updateServiceTypeDto.service_name,
            }),
          },
        });
      }

      return successRes(
        {
          ...(updatedServiceType || {}),
        },
        200,
        'Service updated successfully',
      );
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number, req: Request) {
    const user = req['user'];
    try {
      const data = await this.prisma.service_type.findUnique({
        where: { id },
        include: { doctor_services: true },
      });

      if (!data?.doctor_services.length) {
        throw new NotFoundException('Service topilmadi');
      }

      const isOwner = data.doctor_services.some((i) => i.doctor_id === user.id);
      const isAdmin = [ERols.ADMIN, ERols.SUPPER_ADMIN].includes(user.role);

      if (!isOwner && !isAdmin) {
        throw new ForbiddenException("Siz bu serviceni o'chira olmaysiz!");
      }
      if (isAdmin) {
        await this.prisma.service_type.delete({ where: { id } });
      } else {
        const doctorService = data.doctor_services.find(
          (i) => i.doctor_id === user.id,
        );
        if (!doctorService) {
          throw new ForbiddenException("Siz bu serviceni o'chira olmaysiz!");
        }
        await this.prisma.doctor_services.delete({
          where: { id: doctorService.id },
        });
      }

      return { message: 'Deleted', statusCode: 200 };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
