import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EDoctor } from 'src/common/enum';

export class CreateDoctorScheduleDto {
  @ApiProperty({
    example: EDoctor.Dushanba,
    description: 'Hafta kuni (enum EDoctor dan)',
  })
  @IsEnum(EDoctor)
  @IsNotEmpty()
  day_of_week: EDoctor;

  @ApiProperty({
    example: '09:00',
    description: 'Boshlanish vaqti (HH:mm format)',
  })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({ example: '17:00', description: 'Tugash vaqti (HH:mm format)' })
  @IsString()
  @IsNotEmpty()
  end_time: string;

  @ApiProperty({ example: true, description: 'Mavjudligi' })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean = false;
}
