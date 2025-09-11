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
import { PatientsCardService } from './patients_card.service';
import { CreatePatientsCardDto } from './dto/create-patients_card.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';
import { Request } from 'express';
import { ParseIdPipe } from 'src/common/pipe/params.validate.pipe';

@Controller('patients-card')
export class PatientsCardController {
  constructor(private readonly patientsCardService: PatientsCardService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.PATIENTS)
  @Post()
  create(
    @Body() createPatientsCardDto: CreatePatientsCardDto,
    @Req() req: Request,
  ) {
    return this.patientsCardService.create(createPatientsCardDto, req);
  }

  @UseGuards(AuthGuard,RoleGuard)
  @Roles(ERols.ADMIN,ERols.PATIENTS,ERols.SUPPER_ADMIN)
  @Get()
  findAll(@Req()req: Request) {
    return this.patientsCardService.findAll(req);
  }

    @UseGuards(AuthGuard,RoleGuard)
  @Roles(ERols.ADMIN,ERols.PATIENTS,ERols.SUPPER_ADMIN)
  @Get(':id')
  findOne(@Param('id',ParseIdPipe) id: string, @Req() req:Request) {
    return this.patientsCardService.findOne(+id, req);
  }

    @UseGuards(AuthGuard,RoleGuard)
  @Roles(ERols.ADMIN,ERols.PATIENTS,ERols.SUPPER_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: string, @Req() req: Request) {
    return this.patientsCardService.remove(+id,req);
  }
}
