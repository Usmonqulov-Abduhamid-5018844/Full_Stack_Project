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
import { DoctorIdDto } from './dto/doctor_id.dto';
import { cretedDoctorDto } from './dto/creted-doctor.dto';
import { Token } from 'src/infrostructure/utils/Token';
import { ImageValidation } from 'src/common/pipe/image_validation.pipe';
import { Request } from 'express';
import { MailService } from 'src/common/mail/mail.service';
import { log } from 'console';
import { StatusDto } from './dto/status-doctor.dto';
import { EStatus } from 'src/common/enum';

@Injectable()
export class DoctorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Otp: OtpGenerate,
    private readonly fileService: FileService,
    private readonly TokenGenerate: Token,
    private readonly mail: MailService,
  ) {}

  async verify(Otpdata: OtpDoctorDto) {
    const { phone, otp } = Otpdata;
    try {
      const doctor = await this.prisma.doctors.findFirst({
        where: { phone },
      });
      if (!this.Otp.verify(`${phone}`, otp)) {
        throw new BadRequestException(`Otp noto'g'ri yoki vaxti tugagan`);
      }

      if (doctor && doctor.step === 'finish' && doctor.verified === true) {
        const AcsesToken = this.TokenGenerate.AcsesToken({
          id: doctor.id,
          role: doctor.role,
        });
        const RefreshToken = this.TokenGenerate.RefreshToken({
          id: doctor.id,
          role: doctor.role,
        });
        return { AcsesToken, RefreshToken };
      }
      if (doctor && doctor.step === 'pending') {
        throw new BadRequestException(
          'Akkauntingiz admin tomonidan tasdiqlanmagan',
        );
      }
      if (doctor && doctor.step === 'block') {
        throw new BadRequestException('Siz Admin tomonidan bloklangansiz.');
      }
      if (doctor && doctor.step === 'files') {
        throw new BadRequestException(
          `Siz Kerakliy fayillaringizni kiritmadingiz. Siznin ID raqamingiz ${doctor.id}`,
        );
      }
      if (!doctor) {
        const data = await this.prisma.doctors.create({
          data: { phone, step: 'files' },
        });
        return successRes(
          data,
          201,
          'Malumotlaringiz tasdiqlandi keyingi qadamda kerakliy fayillardi kiriting.',
        );
      }
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async add_files(
    files: Record<string, Express.Multer.File[]>,
    doctor: DoctorIdDto,
  ) {
    const { doctor_id } = doctor;
    const fileFields = [
      'passport_file',
      'diplom_file',
      'yatt_file',
      'sertifikat_file',
      'tibiy_varaqa_file',
    ] as const;

    const uploadedFiles: Partial<Record<(typeof fileFields)[number], string>> =
      {};

    try {
      const doctorData = await this.prisma.doctors.findUnique({
        where: { id: doctor_id },
      });
      if (!doctorData) throw new NotFoundException('Doctor id topilmadi.');

      const doctor_files = await this.prisma.doctor_file.findFirst({
        where: { doctor_id: doctorData.id },
      });

      const uploadPromises = fileFields.map(async (field) => {
        const f = files[field];
        if (!f?.length) return null;

        const fileUrl = await this.fileService.createFile(f[0]);
        uploadedFiles[field] = fileUrl;
        return fileUrl;
      });

      await Promise.all(uploadPromises);

      const result = await this.prisma.$transaction(async (tx) => {
        if (doctor_files) {
          const dataToUpdate: Record<string, any> = {};
          for (const k of Object.keys(uploadedFiles)) {
            dataToUpdate[k] = (uploadedFiles as any)[k];
          }
          return await tx.doctor_file.update({
            where: { id: doctor_files.id },
            data: dataToUpdate,
          });
        } else {
          const createData: any = {
            doctor_id: doctorData.id,
          };
          for (const field of fileFields) {
            createData[field] = (uploadedFiles as any)[field] ?? null;
          }
          const created = await tx.doctor_file.create({ data: createData });

          await tx.doctors.update({
            where: { id: doctorData.id },
            data: { step: 'pending' },
          });

          return created;
        }
      });

      if (doctor_files) {
        const deleteOldPromises = Object.entries(uploadedFiles).map(
          async ([field, newUrl]) => {
            const oldUrl = (doctor_files as any)[field];
            if (oldUrl && oldUrl !== newUrl) {
              try {
                const exist = await this.fileService.existFile(oldUrl);
                if (exist) await this.fileService.deleteFile(oldUrl);
              } catch (err) {
                console.error('Old file delete error:', err);
              }
            }
          },
        );
        await Promise.all(deleteOldPromises);
      }

      return successRes(
        result,
        doctor_files ? 200 : 201,
        doctor_files
          ? "Ma'lumotlaringiz o'zgartirildi. Admin 24 soat ichida tekshiradi."
          : "Ma'lumotlaringiz saqlandi. Admin 24 soat ichida tekshiradi.",
      );
    } catch (error) {
      const cleanupPromises = Object.values(uploadedFiles).map(async (f) => {
        try {
          if (await this.fileService.existFile(f)) {
            await this.fileService.deleteFile(f);
          }
        } catch (err) {
          console.error('Cleanup error:', err);
        }
      });
      await Promise.all(cleanupPromises);
      return ErrorHender(error);
    }
  }

  async login(data: cretedDoctorDto) {
    const { phone } = data;
    try {
      let otp = this.Otp.Generate(`${phone}`);
      // await this.mail.sendMail(
      //   email,
      //   'Tasdiqlash xabari',
      //   `<div><h3>Ushbu kodni hech kimga bermayng uni faqat firibgarlar so'raydi Kod:<h1><b>${otp}</b></h1><h3></div>`,
      // );
      // return {
      //   message: `Tasdiqlash uchun quyidagi emailga ${email} habar yuborildi.`,
      // };
      return {
        message: `Tasdiqlash uchun quyidagi  ${otp} habar yuborildi.`,
        statusCode: 200,
      };
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
      sortBy = 'id',
      order = 'DESC',
      gender,
    } = query;

    try {
      const where: any = {};
      if (first_name)
        where.first_name = { contains: first_name, mode: 'insensitive' };
      if (last_name)
        where.last_name = { contains: last_name, mode: 'insensitive' };
      if (phone) where.phone = { contains: phone, mode: 'insensitive' };
      if (gender) where.gender = { contains: gender, mode: 'insensitive' };
      if (experience_years)
        where.experience_years = {
          contains: experience_years,
          mode: 'insensitive',
        };
      if (bio) where.bio = { contains: bio, mode: 'insensitive' };
      if (region) where.region = { contains: region, mode: 'insensitive' };

      const total = await this.prisma.doctors.count({ where });

      const data = await this.prisma.doctors.findMany({
        where,
        orderBy: { [sortBy]: order.toLowerCase() },
        skip: (page - 1) * limit,
        take: Number(limit),
        include: {
          Doctor_file: true,
          Wellet: {
            select: {
              id: true,
              balance: true,
            },
          },
          Doctor_specialization: {
            select: {
              specialization: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!data.length) {
        throw new NotFoundException('Doctors not found');
      }

      return successRes({
        total,
        page: Number(page),
        limit: Number(limit),
        data,
      });
    } catch (error) {
      return ErrorHender(error);
    }
  }
  async finished(query: Record<string, any>) {
    const {
      first_name,
      last_name,
      phone,
      experience_years,
      bio,
      region,
      page = 1,
      limit = 10,
      sortBy = 'id',
      order = 'DESC',
      gender,
    } = query;

    try {
      const where: any = {};
      if (first_name)
        where.first_name = { contains: first_name, mode: 'insensitive' };
      if (last_name)
        where.last_name = { contains: last_name, mode: 'insensitive' };
      if (phone) where.phone = { contains: phone, mode: 'insensitive' };
      if (gender) where.gender = { contains: gender, mode: 'insensitive' };
      if (experience_years)
        where.experience_years = {
          contains: experience_years,
          mode: 'insensitive',
        };
      if (bio) where.bio = { contains: bio, mode: 'insensitive' };
      if (region) where.region = { contains: region, mode: 'insensitive' };

      where.verified = true;

      const total = await this.prisma.doctors.count({ where });

      const data = await this.prisma.doctors.findMany({
        where,
        orderBy: { [sortBy]: order.toLowerCase() },
        skip: (page - 1) * limit,
        take: Number(limit),
        include: {
          Doctor_file: {
            select: {
              id: true,
              diplom_file: true,
              passport_file: true,
              yatt_file: true,
              sertifikat_file: true,
              tibiy_varaqa_file: true,
            },
          },
          Wellet: {
            select: {
              id: true,
              balance: true,
            },
          },
          Doctor_specialization: {
            select: {
              specialization: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!data.length) {
        throw new NotFoundException('Doctors not found');
      }

      return successRes({
        total,
        page: Number(page),
        limit: Number(limit),
        data,
      });
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async doctor_active(id: number, statusDto: StatusDto) {
    try {
      const data = await this.prisma.doctors.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not Fount Doctor id');
      }
      if (statusDto.status === EStatus.BLOCK) {
        await this.prisma.doctors.update({
          where: { id: data.id },
          data: { verified: false, step: EStatus.BLOCK },
        });
        return {message: "Doctor bloklandi"}
      } else if (statusDto.status === EStatus.FINISH) {
        await this.prisma.doctors.update({
          where: { id: data.id },
          data: { verified: true, step: EStatus.FINISH },
        });
      }

      const wallet = await this.prisma.wellet.findUnique({
        where: { doctor_id: id },
      });
      if (!wallet && statusDto.status === EStatus.FINISH ) {
        await this.prisma.wellet.create({ data: { doctor_id: id } });
      }
      return {
        message:
          'Akkaunt aktivlashtirildi va Doctor uchun virtuval hamyon tayyor.',
        statusCode: 200
      };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.doctors.findUnique({
        where: { id },
        include: {
          Doctor_file: true,
          Wellet: true,
          doctor_schedules: true,
          Doctor_specialization: {
            select: {
              specialization: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
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
