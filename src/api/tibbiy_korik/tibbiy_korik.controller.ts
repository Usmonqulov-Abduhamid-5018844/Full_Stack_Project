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
import { TibbiyKorikService } from './tibbiy_korik.service';
import { CreateTibbiyKorikDto } from './dto/create-tibbiy_korik.dto';
import { UpdateTibbiyKorikDto } from './dto/update-tibbiy_korik.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { ParseIdPipe } from 'src/common/pipe/params.validate.pipe';

@Controller('tibbiy-korik')
export class TibbiyKorikController {
  constructor(private readonly tibbiyKorikService: TibbiyKorikService) {}

  @ApiOperation({summary: "Doctorlar uchun"})
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR)
  @Post()
  create(
    @Body() createTibbiyKorikDto: CreateTibbiyKorikDto,
    @Req() req: Request,
  ) {
    return this.tibbiyKorikService.create(createTibbiyKorikDto, req);
  }

  @ApiOperation({ summary: 'All' })
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.tibbiyKorikService.findAll(req);
  }

  @ApiOperation({ summary: 'All' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id',ParseIdPipe) id: string, @Req() req: Request) {
    return this.tibbiyKorikService.findOne(+id, req);
  }

  @ApiOperation({ summary: 'Faqat doctor Yangilashi mumkin' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR)
  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id: string,
    @Body() updateTibbiyKorikDto: UpdateTibbiyKorikDto,
    @Req() req: Request
  ) {
    return this.tibbiyKorikService.update(+id, updateTibbiyKorikDto, req);
  }

  @ApiOperation({ summary: "Supper admin yoki admin o'chirishi mumkin" })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.ADMIN, ERols.SUPPER_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: string) {
    return this.tibbiyKorikService.remove(+id);
  }
}
