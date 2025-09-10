import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePatientsCardDto {
  @ApiProperty({ example: 'Abduhamid' })
  @IsString()
  @IsNotEmpty()
  card_name: string;

  @ApiProperty({ example: '8600345467897654' })
  @IsString()
  @Length(16, 16, { message: `Card number 16 xonali bo'lishi kerak` })
  card_number: string;

  @ApiProperty({ example: '06' })
  @IsString()
  @Length(2, 2, {
    message: `Expire month 2 xonali bo'lishi kerak (masalan: 05)`,
  })
  expire_month: string;

  @ApiProperty({ example: '2026' })
  @IsString()
  @Length(4, 4, {
    message: `Expire year 4 xonali bo'lishi kerak (masalan: 2026)`,
  })
  expire_year: string;
}
