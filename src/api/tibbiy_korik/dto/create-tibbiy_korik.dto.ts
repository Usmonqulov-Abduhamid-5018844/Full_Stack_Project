import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTibbiyKorikDto {
  @ApiProperty({ example: '2025-09-09', description: 'Ko‘rik sanasi' })
  @IsString()
  @IsNotEmpty()
  sana: string;

  @ApiProperty({ example: '09:30 - 10:30', description: 'Ish vaqti' })
  @IsString()
  @IsNotEmpty()
  ish_vaqti: string;

  @ApiProperty({ example: 75, description: 'Bemor vazni (kg)' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vazni: number;

  @ApiProperty({ example: 175, description: 'Bemor bo‘yi (sm)' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  boyi: number;

  @ApiProperty({
    example: 'Bosh og‘riq, holsizlik',
    description: 'Bemorning shikoyati',
  })
  @IsString()
  @IsNotEmpty()
  qabuldagi_shikoyat: string;

  @ApiProperty({
    example: 'Oldin shamollash bo‘lgan',
    description: 'Anamnesis morbi',
  })
  @IsString()
  @IsNotEmpty()
  Anamnesis_morbi: string;

  @ApiProperty({
    example: 'Chekish odati yo‘q',
    description: 'Anamnesis vitae',
  })
  @IsString()
  @IsNotEmpty()
  Anamnesis_vitae: string;

  @ApiProperty({
    example: 'So‘nggi 14 kunda chet elga chiqmagan',
    description: 'Epidemiologik tarix',
  })
  @IsString()
  @IsNotEmpty()
  Epidemiologik_tarix: string;

  @ApiProperty({
    example: 'Qon bosimi normal',
    description: 'Status praesens objectivus',
  })
  @IsString()
  @IsNotEmpty()
  Status_praesens_objectivus: string;

  @ApiProperty({ example: 'Gipertoniya', description: 'Shifokor tashxisi' })
  @IsString()
  @IsNotEmpty()
  Tashxis: string;

  @ApiProperty({
    example: 'Qon tahlili, rentgen',
    description: 'Qo‘shimcha tekshiruvlar',
  })
  @IsString()
  @IsNotEmpty()
  Tekshiruv: string;

  @ApiProperty({
    example: 'Ko‘proq dam olish, dori-darmon',
    description: 'Shifokor tavsiyalari',
  })
  @IsString()
  @IsNotEmpty()
  Tibbiy_tavsiyalar: string;

  @ApiProperty({ example: 5, description: 'Bemor ID' })
  @Type(() => Number)
  @IsInt()
  patients_id: number;
}
