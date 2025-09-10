import { Module } from '@nestjs/common';
import { TibbiyKorikService } from './tibbiy_korik.service';
import { TibbiyKorikController } from './tibbiy_korik.controller';

@Module({
  controllers: [TibbiyKorikController],
  providers: [TibbiyKorikService],
})
export class TibbiyKorikModule {}
