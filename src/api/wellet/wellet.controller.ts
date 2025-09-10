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
import { WelletService } from './wellet.service';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';
import { Request } from 'express';

@Controller('wellet')
export class WelletController {
  constructor(private readonly welletService: WelletService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR, ERols.ADMIN, ERols.SUPPER_ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.welletService.findOne(+id, req);
  }
}
