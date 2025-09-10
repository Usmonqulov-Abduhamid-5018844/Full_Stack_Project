import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DoctorServicesService } from './doctor_services.service';
import { CreateDoctorServiceDto } from './dto/create-doctor_service.dto';
import { UpdateDoctorServiceDto } from './dto/update-doctor_service.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';
import { Request } from 'express';
import { SelfGuard } from 'src/common/Guard/self.guard';

@Controller('doctor-services')
export class DoctorServicesController {
  constructor(private readonly doctorServicesService: DoctorServicesService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR)
  @Post()
  create(@Body() createDoctorServiceDto: CreateDoctorServiceDto, @Req() req: Request) {
    return this.doctorServicesService.create(createDoctorServiceDto, req);
  }

  @Get()
  findAll() {
    return this.doctorServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorServicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorServiceDto: UpdateDoctorServiceDto) {
    return this.doctorServicesService.update(+id, updateDoctorServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorServicesService.remove(+id);
  }
}
