import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateDoctorServiceDto {
  @ApiProperty({
    example: 2,
    description: 'Xizmat turining IDsi (bazadagi service_type id)',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: "service_type_id bo'sh bo'lishi mumkin emas" })
  @IsNumber({}, { message: "service_type_id raqam bo'lishi kerak" })
  @Min(1, { message: "service_type_id 1 dan kichik bo'lmasligi kerak" })
  service_type_id: number;

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
