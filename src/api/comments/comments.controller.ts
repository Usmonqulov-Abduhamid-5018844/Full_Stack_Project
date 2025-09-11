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
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';
import { ParseIdPipe } from 'src/common/pipe/params.validate.pipe';
import { Request } from 'express';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR, ERols.PATIENTS)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    return this.commentsService.create(createCommentDto, req);
  }

  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'doctor_id', required: false })
  @ApiQuery({ name: 'patients_id', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ["star"] })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.commentsService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: string) {
    return this.commentsService.findOne(+id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.ADMIN, ERols.SUPPER_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: string) {
    return this.commentsService.remove(+id);
  }
}
