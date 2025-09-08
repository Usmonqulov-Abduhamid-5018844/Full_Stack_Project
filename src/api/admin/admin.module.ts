import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Token } from 'src/infrostructure/utils/Token';
import { FileService } from '../file/file.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, Token, FileService],
})
export class AdminModule {}
