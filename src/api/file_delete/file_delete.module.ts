import { Module } from '@nestjs/common';
import { FileDeleteService } from './file_delete.service';
import { FileDeleteController } from './file_delete.controller';
import { FileService } from '../file/file.service';

@Module({
  controllers: [FileDeleteController],
  providers: [FileDeleteService, FileService],
})
export class FileDeleteModule {}
