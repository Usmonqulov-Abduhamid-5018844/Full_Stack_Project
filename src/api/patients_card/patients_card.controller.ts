import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatientsCardService } from './patients_card.service';
import { CreatePatientsCardDto } from './dto/create-patients_card.dto';
import { UpdatePatientsCardDto } from './dto/update-patients_card.dto';

@Controller('patients-card')
export class PatientsCardController {
  constructor(private readonly patientsCardService: PatientsCardService) {}

  @Post()
  create(@Body() createPatientsCardDto: CreatePatientsCardDto) {
    return this.patientsCardService.create(createPatientsCardDto);
  }

  @Get()
  findAll() {
    return this.patientsCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsCardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientsCardDto: UpdatePatientsCardDto) {
    return this.patientsCardService.update(+id, updatePatientsCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsCardService.remove(+id);
  }
}
