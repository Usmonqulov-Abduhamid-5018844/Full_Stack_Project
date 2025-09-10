import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { PrismaService } from '../prisma/prisma.service';
import { FileService } from '../file/file.service';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { Request } from 'express';
import { ERols } from 'src/common/enum';

@Injectable()
export class DoctorFileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}
  async create(
    files: {
      passport_file?: Express.Multer.File[];
      diplom_file?: Express.Multer.File[];
      yatt_file?: Express.Multer.File[];
      sertifikat_file?: Express.Multer.File[];
      tibiy_varaqa_file?: Express.Multer.File[];
    },
    req: Record<string, any>,
  ) {
    const savetFiles: string[] = [];
    try {
      const doctor_id = req['user'].id;
      const data = await this.prisma.doctors.findFirst({
        where: { id: doctor_id },
      });
      if (!data) {
        throw new NotFoundException('doctot not fount');
      }
      const doctor_files = await this.prisma.doctor_file.findFirst({
        where: { doctor_id },
      });
      const updateFiles: any = {};

      if (files.diplom_file?.length) {
        const file = await this.fileService.createFile(files.diplom_file[0]);
        savetFiles.push(file);
        updateFiles.diplom_file = file;
        if (doctor_files && doctor_files.diplom_file) {
          await this.fileService.deleteFile(doctor_files.diplom_file);
        }
      }
      if (files.passport_file?.length) {
        const file = await this.fileService.createFile(files.passport_file[0]);
        savetFiles.push(file);
        updateFiles.passport_file = file;
        if (doctor_files && doctor_files.passport_file) {
          await this.fileService.deleteFile(doctor_files.passport_file);
        }
      }
      if (files.sertifikat_file?.length) {
        const file = await this.fileService.createFile(
          files.sertifikat_file[0],
        );
        savetFiles.push(file);
        updateFiles.sertifikat_file = file;
        if (doctor_files && doctor_files.sertifikat_file) {
          await this.fileService.deleteFile(doctor_files.sertifikat_file);
        }
      }
      if (files.tibiy_varaqa_file?.length) {
        const file = await this.fileService.createFile(
          files.tibiy_varaqa_file[0],
        );
        savetFiles.push(file);
        updateFiles.tibiy_varaqa_file = file;
        if (doctor_files && doctor_files.tibiy_varaqa_file) {
          await this.fileService.deleteFile(doctor_files.tibiy_varaqa_file);
        }
      }
      if (files.yatt_file?.length) {
        const file = await this.fileService.createFile(files.yatt_file[0]);
        savetFiles.push(file);
        updateFiles.yatt_file = file;
        if (doctor_files && doctor_files.yatt_file) {
          await this.fileService.deleteFile(doctor_files.yatt_file);
        }
      }
      if (doctor_files) {
        const updateDoctorFile = await this.prisma.doctor_file.update({
          where: { id: doctor_files.id },
          data: { ...updateFiles },
        });
        return successRes(
          updateDoctorFile,
          200,
          "Malumotlaringiz muvofiyaqatliy O'zgartirildi.",
        );
      } else {
        const cretDoctorfile = await this.prisma.doctor_file.create({
          data: { ...updateFiles, doctor_id },
        });
        return successRes(
          cretDoctorfile,
          201,
          'Malumotlaringiz muvofiyaqatliy saqlandi.',
        );
      }
    } catch (error) {
      for (const f of savetFiles) {
        await this.fileService.deleteFile(f).catch(() => {});
      }
      return ErrorHender(error);
    }
  }
  async findAll(req: Request) {
    const user = req["user"]
    try {
      const where = user.role === ERols.DOCTOR ? {doctor_id: user.id} : {}

      const data = await this.prisma.doctor_file.findMany({where});
      if (!data.length) {
        throw new NotFoundException();
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number, req: Request) {
    const user = req["user"]
    try {

      const data = await this.prisma.doctor_file.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException();
      }
      const isOwner = data.doctor_id === user.id
      const isAdmin = [ERols.ADMIN, ERols.SUPPER_ADMIN].includes(user.role)
      if(!isOwner && !isAdmin){
        throw new ForbiddenException("Bu faylni ko'rish uchun sizda ruxsat yoq.")
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number, req: Request) {
    const user = req["user"]
    try {
      const data = await this.prisma.doctor_file.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException();
      }
      const isOwner = data.doctor_id === user.id
      const isAdmin = [ERols.ADMIN,ERols.SUPPER_ADMIN].includes(user.role)

      if(!isOwner && !isAdmin){
        throw new ForbiddenException("Bu faylni o'chirish uchun sizda ruxsat yoq.")
      }

      const fileFields = [
        'diplom_file',
        'passport_file',
        'sertifikat_file',
        'tibiy_varaqa_file',
        'yatt_file',
      ];

      for (const field of fileFields) {
        const filePath = data[field];
        if (filePath && (await this.fileService.existFile(filePath))) {
          await this.fileService.deleteFile(filePath);
        }
      }

      await this.prisma.doctor_file.delete({ where: { id } });

      return { message: 'Deleted', statusCode: 200 };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
