import { PartialType } from '@nestjs/swagger';
import { CreateWelletDto } from './create-wellet.dto';

export class UpdateWelletDto extends PartialType(CreateWelletDto) {}
