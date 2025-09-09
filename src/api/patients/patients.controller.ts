import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { OtppatiensDto } from './dto/otp-patient.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { EDoctorGender } from 'src/common/enum';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post('create')
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }
  @Post('verify_otp')
  verify(@Body() createDoctorDto: OtppatiensDto) {
    return this.patientsService.verify(createDoctorDto);
  }
  @Post('login')
  login(@Body() data: CreatePatientDto) {
    return this.patientsService.login(data);
  }

  @Get("all")
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

@ApiOperation({
  summary: 'Update patient',
})
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      first_name: {
        type: 'string',
        example: 'Abduhamid',
      },
      last_name: {
        type: 'string',
        example: 'Usmonqulov',
      },
      phone: {
        type: 'string',
        example: '+998930451852',
      },
      password: {
        type: 'string',
        example: '12345678',
      },
      gender: {
        type: 'string',
        enum: Object.values(EDoctorGender),
      },
      age: {
        type: 'number',
        example: 25,
      },
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
})
@Patch(':id')
@UseInterceptors(FileInterceptor('image'))
update(
  @Param('id') id: string,
  @Body() updatePatientDto: UpdatePatientDto,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.patientsService.update(+id, updatePatientDto, file);
}


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}
