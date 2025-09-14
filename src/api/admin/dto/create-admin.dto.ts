import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { EAdminRoles, EAdminStatus } from '@prisma/client';
export class CreateAdminDto {
  @ApiProperty({ example: 'Usmonqulov Abduhamid' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: '+998930451852' })
  @IsString()
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Abduhamid' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'active | in_active | block' })
  @IsOptional()
  @IsEnum(EAdminStatus, {
    message: `status faqat ( active | in_active | block ) shu qiymatlardan biri bo'lishi kerak!`,
  })
  @IsString()
  status?: EAdminStatus;
}
