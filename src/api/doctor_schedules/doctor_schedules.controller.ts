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
import { ParseIdPipe } from 'src/common/pipe/params.validate.pipe';

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

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.doctorSchedulesService.findAll(req);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id',ParseIdPipe) id: number, @Req() req: Request) {
    return this.doctorSchedulesService.findOne(id, req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR)
  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto,
    @Req() req: Request
  ) {
    return this.doctorSchedulesService.update(id, updateDoctorScheduleDto, req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR, ERols.ADMIN, ERols.SUPPER_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number, @Req() req: Request ) {
    return this.doctorSchedulesService.remove(id, req);
  }
}
