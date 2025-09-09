import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { EDoctor } from 'src/common/enum';

export class UpdateDoctorScheduleDto {
  @ApiProperty({
    example: EDoctor.Chorshanba,
    description: 'Hafta kuni (enum EDoctor dan)',
  })
  @IsEnum(EDoctor)
  @IsOptional()
  day_of_week?: EDoctor;

  @ApiProperty({
    example: '10:00',
    description: 'Boshlanish vaqti (HH:mm format)',
  })
  @IsString()
  @IsOptional()
  start_time?: string;

  @ApiProperty({ example: '18:00', description: 'Tugash vaqti (HH:mm format)' })
  @IsString()
  @IsOptional()
  end_time?: string;

  @ApiProperty({ example: true, description: 'Mavjudligi' })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;
}
