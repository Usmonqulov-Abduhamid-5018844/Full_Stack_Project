import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateServiceTypeDto {
  @ApiProperty({ example: 'konsultatsiya' })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  service_name: string;

  @ApiProperty({example: 15000})
  @Type(()=> Number)
  @IsNumber()
  price: number
}
