import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class DoctorIdDto {
  @Type(() => Number)
  @IsNumber()
  doctor_id: number;
}
