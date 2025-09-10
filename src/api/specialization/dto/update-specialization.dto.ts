import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSpecializationDto {
  @ApiProperty({ example: 'Nevropatolog', description: 'Mutaxassislik nomi' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: `Asab tizimi kasalliklari bilan shug'ullanadigan mutaxassis`,
    description: 'Mutaxassislik haqida qisqa izoh',
    required: false,
  })
  @IsOptional()
  @IsString()
  desc?: string;
}
