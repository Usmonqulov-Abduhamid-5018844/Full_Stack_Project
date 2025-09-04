import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorFileService } from './doctor_file.service';
import { CreateDoctorFileDto } from './dto/create-doctor_file.dto';
import { UpdateDoctorFileDto } from './dto/update-doctor_file.dto';

@Controller('doctor-file')
export class DoctorFileController {
  constructor(private readonly doctorFileService: DoctorFileService) {}

  @Post()
  create(@Body() createDoctorFileDto: CreateDoctorFileDto) {
    return this.doctorFileService.create(createDoctorFileDto);
  }

  @Get()
  findAll() {
    return this.doctorFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorFileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorFileDto: UpdateDoctorFileDto) {
    return this.doctorFileService.update(+id, updateDoctorFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorFileService.remove(+id);
  }
}
