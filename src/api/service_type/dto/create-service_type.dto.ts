import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateServiceTypeDto {
  @ApiProperty({ example: 'konsultatsiya' })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  service_name: string;

  @ApiProperty({ example: 'Masofaviy yoki ofisda beriladigan konsultatsiya' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  desc?: string;
}
