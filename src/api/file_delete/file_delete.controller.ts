import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FileDeleteService } from './file_delete.service';
import { ApiParam } from '@nestjs/swagger';


@Controller('file-delete')
export class FileDeleteController {
  constructor(private readonly fileDeleteService: FileDeleteService) {}


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
