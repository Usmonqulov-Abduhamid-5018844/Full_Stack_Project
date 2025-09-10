import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { EAppointments } from 'src/common/enum';

export class UpdatePariensAppointmentDto {
  @ApiPropertyOptional({
    example: '2025-09-13T10:00:00.000Z',
    description: 'Yangi appointment sanasi va vaqti',
  })
  @IsDateString()
  @IsOptional()
  appointment_date?: string;

@ApiPropertyOptional({
  example: EAppointments.CONFIRMEND,
  enum: EAppointments,
  description: 'Yangi appointment statusi',
  type: String, 
})
@IsEnum(EAppointments)
@IsOptional()
status?: EAppointments.CONFIRMEND;
}
