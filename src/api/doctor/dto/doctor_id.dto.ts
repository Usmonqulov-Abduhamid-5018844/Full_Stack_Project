import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class DoctorIdDto {
  @Type(() => Number)
  @IsNumber()
  id: number;
}
