import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { EAppointments } from 'src/common/enum';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    example: '2025-09-13T10:00:00.000Z',
    description: 'Yangi appointment sanasi va vaqti',
  })
  @IsDateString()
  @IsOptional()
  appointment_date?: string;

  @ApiPropertyOptional({ example: 4, description: `Yangi doktor ID'si` })
  @IsInt()
  @IsOptional()
  doctor_id?: number;

  @ApiPropertyOptional({ example: 7, description: `Yangi service ID'si` })
  @IsInt()
  @IsOptional()
  service_id?: number;

  @ApiPropertyOptional({
    example: 'pending || confirmend || completed || cancelled',
    enum: EAppointments,
    description: 'Yangi appointment statusi',
    type: String,
  })
  @IsEnum(EAppointments)
  @IsOptional()
  status?: EAppointments;
}
