import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  OnModuleInit,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { EAdminStatus, EAdminRoles } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LoginAdminDto } from './dto/login-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin')
export class AdminController implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly adminService: AdminService,
  ) {}

  async onModuleInit() {
    const data = {
      full_name: String(process.env.FULL_MAME),
      phone: String(process.env.PHONE),
      password: String(process.env.PASSWORD),
      login: String(process.env.LOGIN),
      status: EAdminStatus.active,
      role: EAdminRoles.supper_admin,
    };
    try {
      const admin = await this.prisma.admins.findFirst({
        where: {phone: data.phone },
      });
      if (!admin) {
        const heshed = bcrypt.hashSync(data.password, 10);
        await this.prisma.admins.create({
          data: { ...data, password: heshed},
        });
      }
    } catch (error) {
      console.log(error);

      return;
    }
  }

  @ApiOperation({summary: "Supper admin uchun"})
  @Post('creted')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }
  @Post('login')
  login(@Body() login: LoginAdminDto) {
    return this.adminService.login(login);
  }

  @ApiOperation({ summary: 'Supper Admin uchun' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'full_name', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['full_name', 'phone'] })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.adminService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  
  @ApiOperation({
    summary: 'Update admin',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema:{
      type: "object",
      properties:{
      full_name: {
        type: "string",
        example: "Usmonqulov Abduhamid"
      },
      phone: {
        type:"string",
        example: "+998930451852",
      },
      login: {
        type: "string",
        example:" Abduhamid"
      },
      password: {
        type: "string",
        example: "12345678"
      },
      image: {
        type: "string",
        format: "binary"
      }
    }
    }
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor("image"))
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto ,
  @UploadedFile() file: Express.Multer.File,
) {
    return this.adminService.update(+id, updateAdminDto, file);
  }

  @ApiOperation({ summary: 'Supper Admin uchun' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
