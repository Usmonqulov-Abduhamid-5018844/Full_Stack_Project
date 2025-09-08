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
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { LoginDoctorDto } from './dto/login-doctor.dto';
import { OtpDoctorDto } from './dto/otp-doctor.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { FileValidation } from 'src/common/pipe/file_validationPipe';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('creted')
  create(@Body() createDoctorDto: LoginDoctorDto) {
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
        id: {
          type: 'number',
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
    @Param("id") id: number,
    @UploadedFiles(FileValidation)
    files: {
      passport_file?: Express.Multer.File[];
      diplom_file?: Express.Multer.File[];
      yatt_file?: Express.Multer.File[];
      sertifikat_file?: Express.Multer.File[];
      tibiy_varaqa_file?: Express.Multer.File[];
    },
  ) {
    return this.doctorService.add_files(files, id);
  }

  @Get()
  findAll() {
    return this.doctorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorService.remove(+id);
  }
}
