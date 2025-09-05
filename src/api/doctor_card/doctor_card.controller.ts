import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorCardService } from './doctor_card.service';
import { CreateDoctorCardDto } from './dto/create-doctor_card.dto';
import { UpdateDoctorCardDto } from './dto/update-doctor_card.dto';

@Controller('doctor-card')
export class DoctorCardController {
  constructor(private readonly doctorCardService: DoctorCardService) {}

  @Post()
  create(@Body() createDoctorCardDto: CreateDoctorCardDto) {
    return this.doctorCardService.create(createDoctorCardDto);
  }

  @Get()
  findAll() {
    return this.doctorCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorCardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorCardDto: UpdateDoctorCardDto) {
    return this.doctorCardService.update(+id, updateDoctorCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorCardService.remove(+id);
  }
}
