import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TibbiyKorikService } from './tibbiy_korik.service';
import { CreateTibbiyKorikDto } from './dto/create-tibbiy_korik.dto';
import { UpdateTibbiyKorikDto } from './dto/update-tibbiy_korik.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';
import { Request } from 'express';

@Controller('tibbiy-korik')
export class TibbiyKorikController {
  constructor(private readonly tibbiyKorikService: TibbiyKorikService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR)
  @Post()
  create(@Body() createTibbiyKorikDto: CreateTibbiyKorikDto, @Req() req:Request) {
    return this.tibbiyKorikService.create(createTibbiyKorikDto, req);
  }

  @Get()
  findAll() {
    return this.tibbiyKorikService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tibbiyKorikService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTibbiyKorikDto: UpdateTibbiyKorikDto) {
    return this.tibbiyKorikService.update(+id, updateTibbiyKorikDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tibbiyKorikService.remove(+id);
  }
}
