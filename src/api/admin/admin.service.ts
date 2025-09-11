import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { successRes } from 'src/infrostructure/utils/succesResponse';
import { LoginAdminDto } from './dto/login-admin.dto';
import { Token } from 'src/infrostructure/utils/Token';
import { FileService } from '../file/file.service';
import { ImageValidation } from 'src/common/pipe/image_validation.pipe';

@Injectable()
export class AdminService {
  constructor(
    private readonly TokenGenerate: Token,
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const { full_name, phone, password } = createAdminDto;
    try {
      const data = await this.prisma.admins.findFirst({
        where: { phone },
      });
      if (data) {
        throw new ConflictException('Alredy exists');
      }
      const heshpass = bcrypt.hashSync(password, 10);
      const newdata = await this.prisma.admins.create({
        data: { ...createAdminDto, password: heshpass },
      });

      return successRes(newdata, 201);
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async login(data: LoginAdminDto) {
    try {
      const Data = await this.prisma.admins.findFirst({
        where: { phone: data.phone },
      });
      if (!Data) {
        throw new NotFoundException();
      }
      if (data.login !== Data.login) {
        throw new BadGatewayException('Wrong login');
      }
      if (!bcrypt.compareSync(data.password, Data.password)) {
        throw new BadRequestException('wrong login or password');
      }
      const AcsesToken = this.TokenGenerate.AcsesToken({
        id: Data.id,
        role: Data.role,
      });
      const RefreshToken = this.TokenGenerate.RefreshToken({
        id: Data.id,
        role: Data.role,
      });
      return { AcsesToken, RefreshToken };
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async findAll(query: Record<string, any>) {
    try {
      const {
        full_name,
        phone,
        sortBy = 'full_name',
        order = 'ASC',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};

      if (full_name) {
        where.full_name = { contains: full_name, mode: 'insensitive' };
      }
      if (phone) {
        where.phone = { contains: phone, mode: 'insensitive' };
      }

      const data = await this.prisma.admins.findMany({
        where,
        orderBy: {
          [sortBy]: order.toLowerCase(),
        },
        skip: (page - 1) * limit,
        take: Number(limit),
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
      const data = await this.prisma.admins.findUnique({ where: { id } });
      if (!data) {
        throw new NotFoundException();
      }
      return data;
    } catch (error) {
      return ErrorHender(error);
    }
  }

  async update(
    id: number,
    updateAdminDto: UpdateAdminDto,
    file: Express.Multer.File,
  ) {
    let newimage: string | null = null;
    try {
      const data = await this.prisma.admins.findFirst({ where: { id } });
      if (!data) {
        throw new NotFoundException();
      }
      if (updateAdminDto.phone) {
        const existPhone = await this.prisma.admins.findUnique({
          where: { phone: updateAdminDto.phone },
        });
        if (existPhone && existPhone.id !== id) {
          throw new ConflictException(
            "Bunday telefon raqam avval ro'yxatdan o'tgan",
          );
        }
      }

      let newData: any = '';
      if (updateAdminDto.password) {
        newData = {
          ...updateAdminDto,
          password: bcrypt.hashSync(updateAdminDto.password, 10),
        };
      }
      if (file && new ImageValidation().transform(file)) {
        newimage = await this.fileService.createFile(file);

        const Data = await this.prisma.admins.update({
          where: { id },
          data: { ...newData, image: newimage },
        });
        if (data.image) {
          await this.fileService.deleteFile(data.image);
        }
      } else {
        const Data = await this.prisma.admins.update({
          where: { id },
          data: { ...newData },
        });
      }
      const newsData = await this.prisma.admins.findUnique({ where: { id } });
      if (!newsData) {
        throw new NotFoundException();
      }
      return successRes(newsData);
    } catch (error) {
      if (newimage) {
        await this.fileService.deleteFile(newimage).catch(() => {});
      }
      return ErrorHender(error);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.admins.findFirst({ where: { id } });
      if (!data) {
        throw new NotFoundException();
      }
      await this.prisma.admins.delete({ where: { id } });
      if (data.image) {
        await this.fileService.deleteFile(data.image).catch(() => {});
      }
      return { message: 'delete', statusCode: 200 };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
