import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DoctorSpecializationService } from './doctor_specialization.service';
import { CreateDoctorSpecializationDto } from './dto/create-doctor_specialization.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';

@Controller('doctor-specialization')
export class DoctorSpecializationController {
  constructor(private readonly doctorSpecializationService: DoctorSpecializationService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR)
  @Post()
  create(@Body() createDoctorSpecializationDto: CreateDoctorSpecializationDto, @Req() req:Record<string,any>) {
    return this.doctorSpecializationService.create(createDoctorSpecializationDto, req);
  }

  @Get()
  findAll() {
    return this.doctorSpecializationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorSpecializationService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorSpecializationService.remove(+id);
  }
}
