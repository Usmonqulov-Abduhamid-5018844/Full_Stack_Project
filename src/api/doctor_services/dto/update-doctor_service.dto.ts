import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateDoctorServiceDto {
  @ApiProperty({
    example: 15000,
    description: 'Xizmat narxi',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: "price bo'sh bo'lishi mumkin emas" })
  @IsNumber({}, { message: "price raqam bo'lishi kerak" })
  @Min(0, { message: "price manfiy bo'lmasligi kerak" })
  price: number;
}
