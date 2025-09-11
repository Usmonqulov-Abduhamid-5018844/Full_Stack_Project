import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpecializationDto {
  @ApiProperty({ example: 'Nevropatolog', description: 'Mutaxassislik nomi' })
  @IsString()
  @IsNotEmpty()
  name: string;

}
