import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { OtpDoctorDto } from './dto/otp-doctor.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { FileValidation } from 'src/common/pipe/file_validationPipe';
import { DoctorIdDto } from './dto/doctor_id.dto';
import { cretedDoctorDto } from './dto/creted-doctor.dto';
import { EDoctorGender, ERegion, ERols } from 'src/common/enum';
import { Request } from 'express';
import { SelfGuard } from 'src/common/Guard/self.guard';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('creted')
  create(@Body() createDoctorDto: cretedDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }
  @Post('verify_otp')
  verify(@Body() createDoctorDto: OtpDoctorDto) {
    return this.doctorService.verify(createDoctorDto);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        doctor_id: {
          type: 'string',
          example: 1,
        },
        passport_file: { type: 'string', format: 'binary' },
        diplom_file: { type: 'string', format: 'binary' },
        yatt_file: { type: 'string', format: 'binary' },
        sertifikat_file: { type: 'string', format: 'binary' },
        tibiy_varaqa_file: { type: 'string', format: 'binary' },
      },
    },
  })
  @Post('add_files')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'passport_file', maxCount: 1 },
      { name: 'diplom_file', maxCount: 1 },
      { name: 'yatt_file', maxCount: 1 },
      { name: 'sertifikat_file', maxCount: 1 },
      { name: 'tibiy_varaqa_file', maxCount: 1 },
    ]),
  )
  add_files(
    @Body() body: DoctorIdDto,
    @UploadedFiles(FileValidation)
    files: {
      passport_file?: Express.Multer.File[];
      diplom_file?: Express.Multer.File[];
      yatt_file?: Express.Multer.File[];
      sertifikat_file?: Express.Multer.File[];
      tibiy_varaqa_file?: Express.Multer.File[];
    },
  ) {
    return this.doctorService.add_files(files, body);
  }

  @Post('login')
  login(@Body() data: cretedDoctorDto) {
    return this.doctorService.login(data);
  }

  @ApiOperation({ summary: 'Admin yoki Supper_admin uchun' })
  @Patch('doctor/active/:id')
  updateDoctorActive(@Param('id') id: string) {
    return this.doctorService.doctor_active(+id);
  }

  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'first_name', required: false })
  @ApiQuery({ name: 'last_name', required: false })
  @ApiQuery({ name: 'bio', required: false })
  @ApiQuery({ name: 'experience_years', required: false })
  @ApiQuery({ name: 'gender', required: false })
  @ApiQuery({ name: 'region', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: [
      'first_name',
      'bio',
      'last_name',
      'experience_years',
      'phone',
      'gender',
      'region',
    ],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.doctorService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(+id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR)
  @Patch('doctor/working/status')
  doctorworking(@Req() req: Request) {
    return this.doctorService.doctorWorking(req);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string', example: 'Ali' },
        last_name: { type: 'string', example: 'Valiyev' },
        bio: { type: 'string', example: '10 yillik tajribaga ega shifokor' },
        experience_years: { type: 'integer', example: 5 },
        phone: { type: 'string', example: '+998930451852' },
        password: { type: 'string', example: 'myStrongPass123' },
        date_of_birth: {
          type: 'string',
          format: 'date-time',
          example: '1990-05-12T00:00:00.000Z',
        },
        gender: {
          type: 'string',
          enum: Object.values(EDoctorGender),
        },
        region: {
          type: 'string',
          enum: Object.values(ERegion),
          example: ERegion.TOSHKENT,
        },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.doctorService.update(+id, updateDoctorDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorService.remove(+id);
  }
}
