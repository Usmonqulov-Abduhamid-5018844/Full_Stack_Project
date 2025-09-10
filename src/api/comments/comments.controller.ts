import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.DOCTOR, ERols.PATIENTS)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.ADMIN, ERols.SUPPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
