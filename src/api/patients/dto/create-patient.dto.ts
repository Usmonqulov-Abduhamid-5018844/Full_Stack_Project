import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: '+998930451852' })
  @IsString()
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone: string;
  @ApiProperty({ example: 'usmonqulovabduhamid00@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
