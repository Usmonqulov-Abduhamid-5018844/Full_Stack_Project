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
import { RefreshTokenService } from './refresh_token.service';
import { RefreshGuard } from 'src/common/Guard/refresh.guard';
import { Request } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenDto } from './acsesToken.dto';

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @ApiOperation({ summary: 'Bu entpointga refresh token yuboriladi.' })
  @ApiResponse({
    status: 200,
    description: 'Yangi accsesToken qaytaradi',
    type: AccessTokenDto,
  })
  @UseGuards(RefreshGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.refreshTokenService.findAll(req);
  }
}
