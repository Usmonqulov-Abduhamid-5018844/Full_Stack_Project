import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DoctorSchedulesService } from './doctor_schedules.service';
import { CreateDoctorScheduleDto } from './dto/create-doctor_schedule.dto';
import { UpdateDoctorScheduleDto } from './dto/update-doctor_schedule.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';
import { Request } from 'express';

@Controller('doctor-schedules')
export class DoctorSchedulesController {
  constructor(
    private readonly doctorSchedulesService: DoctorSchedulesService,
  ) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR)
  @Post()
  create(
    @Body() createDoctorScheduleDto: CreateDoctorScheduleDto,
    @Req() req: Request,
  ) {
    return this.doctorSchedulesService.create(createDoctorScheduleDto, req);
  }

  @Get()
  findAll() {
    return this.doctorSchedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorSchedulesService.findOne(+id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto,
  ) {
    return this.doctorSchedulesService.update(+id, updateDoctorScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorSchedulesService.remove(+id);
  }
}
