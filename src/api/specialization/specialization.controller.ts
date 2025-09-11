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
import { SpecializationService } from './specialization.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';
import { Request } from 'express';
import { ParseIdPipe } from 'src/common/pipe/params.validate.pipe';

@Controller('specialization')
export class SpecializationController {
  constructor(private readonly specializationService: SpecializationService) {}

  @UseGuards(AuthGuard,RoleGuard)
  @Roles(ERols.DOCTOR)
  @Post()
  create(@Body() createSpecializationDto: CreateSpecializationDto, @Req() req: Request) {
    return this.specializationService.create(createSpecializationDto, req);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.specializationService.findAll(req);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: string) {
    return this.specializationService.findOne(+id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.ADMIN, ERols.DOCTOR, ERols.SUPPER_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: string, @Req() req: Request) {
    return this.specializationService.remove(+id, req);
  }
}
