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
import { ImageValidation } from 'src/common/pipe/image_validation';

@Injectable()
export class PatientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Otp: OtpGenerate,
    private readonly fileService: FileService,
    private readonly tokenGenerate: Token,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const { phone } = createPatientDto;
    try {
      const data = await this.prisma.patients.findFirst({ where: { phone } });
      if (data) {
        throw new ConflictException('Alredy exists');
      }
      let otp = this.Otp.Generate(phone);
      return { otp, message: 'otp orqaliy shaxsingizni tasdiqlayng.' };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async verify(Otpdata: OtppatiensDto) {
    const { phone, otp } = Otpdata;
    try {
      if (this.Otp.verify(phone, otp)) {
        const data = await this.prisma.patients.create({ data: { phone } });
        return successRes(data, 201);
      } else {
        throw new BadRequestException('Otp expirns');
      }
    } catch (error) {
      console.log(error);

      return ErrorHender(error);
    }
  }

  async login(data: CreatePatientDto) {
    try {
      const Data = await this.prisma.patients.findFirst({
        where: { phone: data.phone },
      });
      if (!Data) {
        throw new NotFoundException('user id Not Fount');
      }
      const AcsesToken = this.tokenGenerate.AcsesToken({
        id: Data.id,
        role: Data.role,
      });
      const RefreshToken = this.tokenGenerate.RefreshToken({
        id: Data.id,
        role: Data.role,
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
