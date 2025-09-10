import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: '+998930451852' })
  @IsString()
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone: string;
}
