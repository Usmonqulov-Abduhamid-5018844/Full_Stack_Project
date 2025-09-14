import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class OtppatiensDto {
  @ApiProperty({ example: '248356' })
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;

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
