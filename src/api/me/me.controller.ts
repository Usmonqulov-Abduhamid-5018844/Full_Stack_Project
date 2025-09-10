import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { MeService } from './me.service';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}
  

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Get current authenticated user profile" })
  @Get()
  findAll(@Req() req: Request) {
    return this.meService.findAll(req);
  }
}
