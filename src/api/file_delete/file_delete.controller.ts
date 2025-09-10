import { Controller,Param, Delete, UseGuards } from '@nestjs/common';
import { FileDeleteService } from './file_delete.service';
import { ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/Guard/auth.guard';
import { RoleGuard } from 'src/common/Guard/role.guard';
import { Roles } from 'src/common/Decorator/Role.decorator';
import { ERols } from 'src/common/enum';


@Controller('file-delete')
export class FileDeleteController {
  constructor(private readonly fileDeleteService: FileDeleteService) {}


  @UseGuards(AuthGuard, RoleGuard)
  @Roles(ERols.SUPPER_ADMIN, ERols.ADMIN)
  @ApiParam({
  name: 'id',
  description: `O'chiriladigan faylning URL qiymatini kriting.`,
  type: String,
  example: "file_URL"
})
  @Delete(':id')
  remove(@Param('id') URL: string) {
    return this.fileDeleteService.remove(URL);
  }
}
