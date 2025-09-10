import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DoctorCardService } from './doctor_card.service';
import { CreateDoctorCardDto } from './dto/create-doctor_card.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';
import { Request } from 'express';

@Controller('doctor-card')
export class DoctorCardController {
  constructor(private readonly doctorCardService: DoctorCardService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR)
  @Post()
  create(@Body() createDoctorCardDto: CreateDoctorCardDto, @Req() req:Request) {
    return this.doctorCardService.create(createDoctorCardDto, req);
  }

  @Get()
  findAll() {
    return this.doctorCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorCardService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorCardService.remove(+id);
  }
}
