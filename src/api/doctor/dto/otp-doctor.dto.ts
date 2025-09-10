import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class OtpDoctorDto {
  @ApiProperty({ example: '248356' })
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;

  @ApiProperty({ example: '+998930451852' })
  @IsString()
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone: string;
}
