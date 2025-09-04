import { PartialType } from '@nestjs/swagger';
import { CreateTibbiyKorikDto } from './create-tibbiy_korik.dto';

export class UpdateTibbiyKorikDto extends PartialType(CreateTibbiyKorikDto) {}
