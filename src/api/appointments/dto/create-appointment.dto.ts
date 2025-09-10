import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '2025-09-12T14:30:00.000Z',
    description: 'Appointment sanasi va vaqti (ISO formatda)',
  })
  @IsDateString(
    {},
    { message: `appointment_date noto'g'ri formatda (ISO kerak)` },
  )
  appointment_date: string;

  @ApiProperty({ example: 3, description: `Doktor ID'si` })
  @Type(() => Number)
  @IsInt()
  doctor_id: number;

  @ApiProperty({
    example: 5,
    description: `Xizmat ID'si (doctor_services jadvalidan)`,
  })
  @Type(() => Number)
  @IsInt()
  service_id: number;
}
