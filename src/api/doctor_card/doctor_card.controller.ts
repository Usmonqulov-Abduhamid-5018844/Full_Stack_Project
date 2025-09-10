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
  create(
    @Body() createDoctorCardDto: CreateDoctorCardDto,
    @Req() req: Request,
  ) {
    return this.doctorCardService.create(createDoctorCardDto, req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.ADMIN, ERols.DOCTOR, ERols.SUPPER_ADMIN)
  @Get()
  findAll(@Req() req: Request) {
    return this.doctorCardService.findAll(req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.ADMIN, ERols.DOCTOR, ERols.SUPPER_ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.doctorCardService.findOne(+id, req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.ADMIN, ERols.DOCTOR, ERols.SUPPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.doctorCardService.remove(+id, req);
  }
}
