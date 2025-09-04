import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TibbiyKorikService } from './tibbiy_korik.service';
import { CreateTibbiyKorikDto } from './dto/create-tibbiy_korik.dto';
import { UpdateTibbiyKorikDto } from './dto/update-tibbiy_korik.dto';

@Controller('tibbiy-korik')
export class TibbiyKorikController {
  constructor(private readonly tibbiyKorikService: TibbiyKorikService) {}

  @Post()
  create(@Body() createTibbiyKorikDto: CreateTibbiyKorikDto) {
    return this.tibbiyKorikService.create(createTibbiyKorikDto);
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
