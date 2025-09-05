import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorSpecializationService } from './doctor_specialization.service';
import { CreateDoctorSpecializationDto } from './dto/create-doctor_specialization.dto';
import { UpdateDoctorSpecializationDto } from './dto/update-doctor_specialization.dto';

@Controller('doctor-specialization')
export class DoctorSpecializationController {
  constructor(private readonly doctorSpecializationService: DoctorSpecializationService) {}

  @Post()
  create(@Body() createDoctorSpecializationDto: CreateDoctorSpecializationDto) {
    return this.doctorSpecializationService.create(createDoctorSpecializationDto);
  }

  @Get()
  findAll() {
    return this.doctorSpecializationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorSpecializationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorSpecializationDto: UpdateDoctorSpecializationDto) {
    return this.doctorSpecializationService.update(+id, updateDoctorSpecializationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorSpecializationService.remove(+id);
  }
}
