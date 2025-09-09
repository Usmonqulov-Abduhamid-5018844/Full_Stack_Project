import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DoctorFileService } from './doctor_file.service';
import { CreateDoctorFileDto } from './dto/create-doctor_file.dto';
import { UpdateDoctorFileDto } from './dto/update-doctor_file.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileValidation } from 'src/common/pipe/file_validationPipe';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';

@Controller('doctor-file')
export class DoctorFileController {
  constructor(private readonly doctorFileService: DoctorFileService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        passport_file: { type: 'string', format: 'binary' },
        diplom_file: { type: 'string', format: 'binary' },
        yatt_file: { type: 'string', format: 'binary' },
        sertifikat_file: { type: 'string', format: 'binary' },
        tibiy_varaqa_file: { type: 'string', format: 'binary' },
      },
    },
  })
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'passport_file', maxCount: 1 },
      { name: 'diplom_file', maxCount: 1 },
      { name: 'yatt_file', maxCount: 1 },
      { name: 'sertifikat_file', maxCount: 1 },
      { name: 'tibiy_varaqa_file', maxCount: 1 },
    ]),
  )
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR)
  create(
    @Req() req: Record<string, any>,
    @UploadedFiles(FileValidation)
    files: {
      passport_file?: Express.Multer.File[];
      diplom_file?: Express.Multer.File[];
      yatt_file?: Express.Multer.File[];
      sertifikat_file?: Express.Multer.File[];
      tibiy_varaqa_file?: Express.Multer.File[];
    },
  ) {
    return this.doctorFileService.create(files, req);
  }

  @Get()
  findAll() {
    return this.doctorFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorFileService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorFileService.remove(+id);
  }
}
