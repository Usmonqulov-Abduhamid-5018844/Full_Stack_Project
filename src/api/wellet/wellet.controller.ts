import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WelletService } from './wellet.service';
import { CreateWelletDto } from './dto/create-wellet.dto';
import { UpdateWelletDto } from './dto/update-wellet.dto';

@Controller('wellet')
export class WelletController {
  constructor(private readonly welletService: WelletService) {}

  @Post()
  create(@Body() createWelletDto: CreateWelletDto) {
    return this.welletService.create(createWelletDto);
  }

  @Get()
  findAll() {
    return this.welletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.welletService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWelletDto: UpdateWelletDto) {
    return this.welletService.update(+id, updateWelletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.welletService.remove(+id);
  }
}
