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
import { ServiceTypeService } from './service_type.service';
import { CreateServiceTypeDto } from './dto/create-service_type.dto';
import { UpdateServiceTypeDto } from './dto/update-service_type.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';
import { Request } from 'express';
import { ParseIdPipe } from 'src/common/pipe/params.validate.pipe';

@Controller('service-type')
export class ServiceTypeController {
  constructor(private readonly serviceTypeService: ServiceTypeService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR)
  @Post()
  create(@Body() createServiceTypeDto: CreateServiceTypeDto,@Req() req: Request) {
    return this.serviceTypeService.create(createServiceTypeDto, req);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.serviceTypeService.findAll(req);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: string) {
    return this.serviceTypeService.findOne(+id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR, ERols.SUPPER_ADMIN, ERols.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id: string,
    @Body() updateServiceTypeDto: UpdateServiceTypeDto,
    @Req() req: Request
  ) {
    return this.serviceTypeService.update(+id, updateServiceTypeDto, req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR, ERols.ADMIN, ERols.SUPPER_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: string, @Req() req: Request) {
    return this.serviceTypeService.remove(+id, req);
  }
}
