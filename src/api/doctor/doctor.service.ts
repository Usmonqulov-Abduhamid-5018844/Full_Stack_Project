import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { PrismaService } from '../prisma/prisma.service';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';
import { OtpDoctorDto } from './dto/otp-doctor.dto';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { FileService } from '../file/file.service';
import { DoctorFileService } from '../doctor_file/doctor_file.service';
import { DoctorIdDto } from './dto/doctor_id.dto';
import { cretedDoctorDto } from './dto/creted-doctor.dto';
import { Token } from 'src/infrostructure/utils/Token';
import { ImageValidation } from 'src/common/pipe/image_validation.pipe';
import { Request } from 'express';
import { contains } from 'class-validator';

@Injectable()
export class DoctorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Otp: OtpGenerate,
    private readonly fileService: FileService,
    private readonly TokenGenerate: Token,
  ) {}

  async create(createDoctorDto: cretedDoctorDto) {
    const { phone } = createDoctorDto;
    try {
      const data = await this.prisma.doctors.findFirst({ where: { phone } });
      if (data) {
        throw new ConflictException('Alredy exists');
      }
      let otp = this.Otp.Generate(phone);
      return { otp, message: 'otp orqaliy shaxsingizni tasdiqlayng.' };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async verify(Otpdata: OtpDoctorDto) {
    const { phone, otp } = Otpdata;
    try {
      if (this.Otp.verify(phone, otp)) {
        const data = await this.prisma.doctors.create({ data: { phone } });
        return successRes(data, 201);
      } else {
        throw new BadRequestException('Otp expirns');
      }
    } catch (error) {
      console.log(error);

      return ErrorHender(error);
    }
  }
  async add_files(
    files: {
      passport_file?: Express.Multer.File[];
      diplom_file?: Express.Multer.File[];
      yatt_file?: Express.Multer.File[];
      sertifikat_file?: Express.Multer.File[];
      tibiy_varaqa_file?: Express.Multer.File[];
    },
    doctor: DoctorIdDto,
  ) {
    const { doctor_id } = doctor;
    const savetFiles: string[] = [];
    try {
      const data = await this.prisma.doctors.findFirst({
        where: { id: doctor_id },
      });
      if (!data) {
        throw new NotFoundException('doctot id not fount');
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
          "Malumotlaringiz muvofiyaqatliy O'zgartirildi. Admin 24 soat ichida ko'rib chiqadi va sizga xabar beriladi.",
        );
      } else {
        const cretDoctorfile = await this.prisma.doctor_file.create({
          data: { ...updateFiles, doctor_id },
        });
        return successRes(
          cretDoctorfile,
          201,
          "Malumotlaringiz muvofiyaqatliy saqlandi. Admin 24 soat ichida ko'rib chiqadi va sizga xabar beriladi.",
        );
      }
    } catch (error) {
      for (const f of savetFiles) {
        await this.fileService.deleteFile(f).catch(() => {});
      }
      return ErrorHender(error);
    }
  }

  async login(data: cretedDoctorDto) {
    try {
      const doctor = await this.prisma.doctors.findUnique({
        where: { phone: data.phone },
      });
      if (!doctor) {
        throw new NotFoundException('Doctor Not Fount');
      }
      if (!doctor.verified) {
        throw new BadRequestException(
          'Akkauntingia admin tomonidan tasdiqlanmagan',
        );
      }
      const AcsesToken = this.TokenGenerate.AcsesToken({
        id: doctor.id,
        role: doctor.role,
      });
      const RefreshToken = this.TokenGenerate.RefreshToken({
        id: doctor.id,
        role: doctor.role,
      });
      return { AcsesToken, RefreshToken };
    } catch (error) {
      return ErrorHender(error);
    }
  }
  async findAll(query: Record<string, any>) {
    const {
      first_name,
      last_name,
      phone,
      experience_years,
      bio,
      region,
      page = 1,
      limit = 10,
      sortBy = 'first_name',
      order = 'ASC',
      gender,
    } = query;
    try {
      const where: any = {};
      if (first_name) {
        where.file_name = { contains: first_name, mode: 'insensitive' };
      }
      if (last_name) {
        where.last_name = { contains: last_name, mode: 'insensitive' };
      }
      if (phone) {
        where.phone = { contains: phone, mode: 'insensitive' };
      }
      if (gender) {
        where.gender = { contains: gender, mode: 'insensitive' };
      }
      if (experience_years) {
        where.experience_years = {
          contains: experience_years,
          mode: 'insensitive',
        };
      }
      if (bio) {
        where.bio = { contains: bio, mode: 'insensitive' };
      }
      if (region) {
        where.region = { contains: region, mode: 'insensitive' };
      }

      const data = await this.prisma.doctors.findMany({
        where,
        orderBy: {
          [sortBy]: order.toLowerCase(),
        },
        skip: (page - 1) * limit,
        take: Number(limit),
        include: { Doctor_file: true, Wellet: true },
      });
      if (!data.length) {
        throw new NotFoundException();
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async doctor_active(id: number) {
    try {
      const data = await this.prisma.doctors.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not Fount Doctor id');
      }
      await this.prisma.doctors.update({
        where: { id: data.id },
        data: { verified: true },
      });
      await this.prisma.wellet.create({ data: { doctor_id: id } });
      return {
        message:
          'Akaunt akktivlashtirildi va Doctor uchun virtuval hamyon yaratildi.',
        statusCode: 200,
      };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.doctors.findUnique({
        where: { id },
        include: { Doctor_file: true, Wellet: true },
      });
      if (!data) {
        throw new NotFoundException('Not Fount Doctor id');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async doctorWorking(req: Request) {
    try {
      const userId = req['user'].id;

      const data = await this.prisma.doctors.findUnique({
        where: { id: userId },
      });
      if (!data) {
        throw new BadRequestException('Doktor id not fount');
      }
      if (data.isActive) {
        await this.prisma.doctors.update({
          where: { id: data.id },
          data: { isActive: false },
        });
      } else {
        await this.prisma.doctors.update({
          where: { id: data.id },
          data: { isActive: true },
        });
      }
      const updatedata = await this.prisma.doctors.findUnique({
        where: { id: data.id },
      });
      return successRes(updatedata);
    } catch (error) {
      console.log(error);
      return ErrorHender(error);
    }
  }

  async update(
    id: number,
    updateDoctorDto: UpdateDoctorDto,
    file?: Express.Multer.File,
  ) {
    try {
      const doctor = await this.prisma.doctors.findUnique({ where: { id } });
      if (!doctor) {
        throw new NotFoundException('Not Found Doctor id');
      }
      if (updateDoctorDto.phone) {
        const existPhone = await this.prisma.doctors.findUnique({
          where: { phone: updateDoctorDto.phone },
        });
        if (existPhone && existPhone.id !== id) {
          throw new ConflictException(
            "Bunday telefon raqam avval ro'yxatdan o'tgan",
          );
        }
      }

      let updateData: any = { ...updateDoctorDto };

      if (updateDoctorDto.date_of_birth) {
        updateData.date_of_birth = new Date(updateDoctorDto.date_of_birth);
      }

      if (updateDoctorDto.gender) {
        updateData.gender = updateDoctorDto.gender.toString();
      }
      if (updateDoctorDto.region) {
        updateData.region = updateDoctorDto.region.toString();
      }

      if (file && new ImageValidation().transform(file)) {
        const image = await this.fileService.createFile(file);
        updateData.image = image;

        if (doctor.image) {
          await this.fileService.deleteFile(doctor.image).catch(() => {});
        }
      }

      const updated = await this.prisma.doctors.update({
        where: { id },
        data: updateData,
      });

      return updated;
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number) {
    try {
      const doctor = await this.prisma.doctors.findUnique({ where: { id } });
      if (!doctor) {
        throw new NotFoundException('Not Found Doctor id');
      }
      await this.prisma.doctors.delete({ where: { id } });
      if (doctor.image) {
        if (await this.fileService.existFile(doctor.image)) {
          await this.fileService.deleteFile(doctor.image);
        }
      }
      return successRes(doctor);
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
