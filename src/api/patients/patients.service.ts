import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OtpGenerate } from 'src/infrostructure/otp_generet/otp_generate';
import { FileService } from '../file/file.service';
import { Token } from 'src/infrostructure/utils/Token';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { OtppatiensDto } from './dto/otp-patient.dto';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { ImageValidation } from 'src/common/pipe/image_validation.pipe';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class PatientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Otp: OtpGenerate,
    private readonly fileService: FileService,
    private readonly tokenGenerate: Token,
    private readonly mail: MailService,
  ) {}

 async verify(Otpdata: OtppatiensDto) {
  const { phone, otp, email } = Otpdata;

  try {
    let user = await this.prisma.patients.findFirst({
      where: { phone, email },
    });

    if (!this.Otp.verify(`${phone + email}`, otp)) {
      throw new BadRequestException("Otp noto'g'ri yoki vaqti tugagan");
    }

    if (!user) {
      user = await this.prisma.patients.create({
        data: { phone, email},
      });
    }

    const AcsesToken = this.tokenGenerate.AcsesToken({
      id: user.id,
      role: user.role,
    });

    const RefreshToken = this.tokenGenerate.RefreshToken({
      id: user.id,
      role: user.role,
    });

    return { AcsesToken, RefreshToken };
  } catch (error) {
    return ErrorHender(error);
  }
}


  async login(data: CreatePatientDto) {
    const { email, phone } = data;
    try {
      let otp = this.Otp.Generate(`${phone + email}`);
      await this.mail.sendMail(
        email,
        'Tasdiqlash xabari',
        `<div><h3>Ushbu kodni hech kimga bermayng uni faqat firibgarlar so'raydi Kod:<h1><b>${otp}</b></h1><h3></div>`,
      );
      return {
        message: `Tasdiqlash uchun quyidagi emailga ${email} habar yuborildi.`,
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

      const data = await this.prisma.patients.findMany({
        where,
        orderBy: {
          [sortBy]: order.toLowerCase(),
        },
        skip: (page - 1) * limit,
        take: Number(limit),
      });
      if (!data.length) {
        throw new NotFoundException('Not Fount users');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.patients.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not fount user by id');
      }
      return successRes(data);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async update(
    id: number,
    updatePatientDto: UpdatePatientDto,
    file: Express.Multer.File,
  ) {
    try {
      const data = await this.prisma.patients.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not Fount by id');
      }
      if (updatePatientDto.phone) {
        const existPhone = await this.prisma.patients.findUnique({
          where: { phone: updatePatientDto.phone },
        });
        if (existPhone && existPhone.id !== id) {
          throw new ConflictException(
            "Bunday telefon raqam avval ro'yxatdan o'tgan",
          );
        }
      }

      let update: any = { ...updatePatientDto };
      if (file && new ImageValidation().transform(file)) {
        let image = await this.fileService.createFile(file);
        update.image = image;
      }
      if (updatePatientDto.gender) {
        update.gender = updatePatientDto.gender.toString();
      }
      const updateUser = await this.prisma.patients.update({
        where: { id },
        data: { ...update },
      });

      return successRes(updateUser);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.patients.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException('Not Fount by id');
      }
      await this.prisma.patients.delete({ where: { id } });
      return { message: 'Deleted', statuscode: 200 };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
