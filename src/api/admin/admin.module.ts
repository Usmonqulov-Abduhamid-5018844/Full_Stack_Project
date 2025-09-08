import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Token } from 'src/infrostructure/utils/Token';

@Module({
  controllers: [AdminController],
  providers: [AdminService, Token],
})
export class AdminModule {}
