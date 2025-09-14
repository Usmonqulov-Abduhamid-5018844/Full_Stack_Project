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
  UseGuards,
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
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';
import { SelfGuard } from 'src/common/Guard/self.guard';
import { ParseIdPipe } from 'src/common/pipe/params.validate.pipe';
import { AdminstatusDto } from './dto/adminStatus.dto';

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
        where: { phone: data.phone },
      });
      if (!admin) {
        const heshed = bcrypt.hashSync(data.password, 10);
        await this.prisma.admins.create({
          data: { ...data, password: heshed },
        });
      }
    } catch (error) {
      console.log(error);

      return;
    }
  }

  @ApiOperation({ summary: 'Supper admin uchun' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.SUPPER_ADMIN)
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
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.SUPPER_ADMIN)
  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.adminService.findAll(query);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Get(':id')
  findOne(@Param('id',ParseIdPipe) id: string) {
    return this.adminService.findOne(+id);
  }

  @ApiOperation({summary: "Supper admin uchun"})
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.SUPPER_ADMIN)
  @Patch("admin/status/:id")
  adminStatus(@Param("id") id: string, @Body() data: AdminstatusDto){
    return this.adminService.adminStatus(+id, data)
  }


  @ApiOperation({
    summary: 'Update admin',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: {
          type: 'string',
          example: 'Usmonqulov Abduhamid',
        },
        phone: {
          type: 'string',
          example: '+998930451852',
        },
        login: {
          type: 'string',
          example: ' Abduhamid',
        },
        password: {
          type: 'string',
          example: '12345678',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard, SelfGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIdPipe) id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.adminService.update(+id, updateAdminDto, file);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.SUPPER_ADMIN)
  @ApiOperation({ summary: 'Supper Admin uchun' })
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: string) {
    return this.adminService.remove(+id);
  }
}
