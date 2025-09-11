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
    req: Request,
  ) {
    const savetFiles: string[] = [];
    const fileFields = [
      'passport_file',
      'diplom_file',
      'yatt_file',
      'sertifikat_file',
      'tibiy_varaqa_file',
    ];
    const doctor_id = req['user'].id;

    try {
      const doctor = await this.prisma.doctors.findUnique({
        where: { id: doctor_id },
      });
      if (!doctor) throw new NotFoundException('Doctor not found');

      const doctor_files = await this.prisma.doctor_file.findFirst({
        where: { doctor_id },
      });
      const updateFiles: Record<string, string> = {};

      for (const field of fileFields) {
        if (files[field]?.length) {
          const file = await this.fileService.createFile(files[field][0]);
          savetFiles.push(file);
          updateFiles[field] = file;

          if (
            doctor_files &&
            doctor_files[field] &&
            (await this.fileService.existFile(doctor_files[field]))
          ) {
            try {
              await this.fileService.deleteFile(doctor_files[field]);
            } catch {}
          }
        }
      }

      let result: any = {};
      if (doctor_files) {
        result = await this.prisma.doctor_file.update({
          where: { id: doctor_files.id },
          data: updateFiles,
        });
        return successRes(
          result,
          200,
          "Malumotlaringiz muvaffaqiyatli o'zgartirildi.",
        );
      } else {
        result = await this.prisma.doctor_file.create({
          data: {
            passport_file: updateFiles.passport_file || '',
            diplom_file: updateFiles.diplom_file || '',
            yatt_file: updateFiles.yatt_file || '',
            sertifikat_file: updateFiles.sertifikat_file || '',
            tibiy_varaqa_file: updateFiles.tibiy_varaqa_file || '',
            doctor: doctor_id,
          },
        });

        return successRes(
          result,
          201,
          'Malumotlaringiz muvaffaqiyatli saqlandi.',
        );
      }
    } catch (error) {
      for (const f of savetFiles) {
        if (await this.fileService.existFile(f)) {
          await this.fileService.deleteFile(f).catch(() => {});
        }
      }
      return ErrorHender(error);
    }
  }

  async findAll(req: Request) {
    const user = req['user'];
    try {
      const where = user.role === ERols.DOCTOR ? { doctor_id: user.id } : {};

      const data = await this.prisma.doctor_file.findMany({ where });
      if (!data.length) {
        throw new NotFoundException();
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number, req: Request) {
    const user = req['user'];
    try {
      const data = await this.prisma.doctor_file.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException();
      }
      const isOwner = data.doctor_id === user.id;
      const isAdmin = [ERols.ADMIN, ERols.SUPPER_ADMIN].includes(user.role);
      if (!isOwner && !isAdmin) {
        throw new ForbiddenException(
          "Bu faylni ko'rish uchun sizda ruxsat yoq.",
        );
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number, req: Request) {
    const user = req['user'];
    try {
      const data = await this.prisma.doctor_file.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException();
      }
      const isOwner = data.doctor_id === user.id;
      const isAdmin = [ERols.ADMIN, ERols.SUPPER_ADMIN].includes(user.role);

      if (!isOwner && !isAdmin) {
        throw new ForbiddenException(
          "Bu faylni o'chirish uchun sizda ruxsat yoq.",
        );
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
