import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EAppointments, ERols } from 'src/common/enum';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { Request } from 'express';
import { UpdatePariensAppointmentDto } from './dto/updatePstiens-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiResponse({
    status: 201,
    description: 'Yaratilgan malumotni qaytaradi',
    type: CreateAppointmentDto,
  })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.PATIENTS)
  @Post()
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() req: Request,
  ) {
    return this.appointmentsService.create(createAppointmentDto, req);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.PATIENTS)
  @Patch('patient/update/:id')
  @ApiResponse({
    status: 200,
    description: 'Yangilangan appointment qaytariladi',
    type: UpdatePariensAppointmentDto,
  })
  patients(
    @Body() data: UpdatePariensAppointmentDto,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.appointmentsService.patients(data, +id, req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.ADMIN, ERols.SUPPER_ADMIN, ERols.DOCTOR)
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Yangilangan appointment qaytariladi',
    type: UpdateAppointmentDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Req() req: Request,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto, req);
  }
}
