import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTibbiyKorikDto {
  @ApiPropertyOptional({ example: '2025-09-10', description: 'Ko‘rik sanasi' })
  @IsOptional()
  @IsString()
  sana?: string;

  @ApiPropertyOptional({ example: '14:00 - 15:00', description: 'Ish vaqti' })
  @IsOptional()
  @IsString()
  ish_vaqti?: string;

  @ApiPropertyOptional({ example: 80, description: 'Bemor vazni (kg)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  vazni?: number;

  @ApiPropertyOptional({ example: 180, description: 'Bemor bo‘yi (sm)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  boyi?: number;

  @ApiPropertyOptional({
    example: 'Ko‘krak qafasida og‘riq',
    description: 'Bemor shikoyati',
  })
  @IsOptional()
  @IsString()
  qabuldagi_shikoyat?: string;

  @ApiPropertyOptional({
    example: 'Oldin yurak xurujlari kuzatilgan',
    description: 'Anamnesis morbi',
  })
  @IsOptional()
  @IsString()
  Anamnesis_morbi?: string;

  @ApiPropertyOptional({
    example: 'Spirtli ichimlik iste’mol qilmaydi',
    description: 'Anamnesis vitae',
  })
  @IsOptional()
  @IsString()
  Anamnesis_vitae?: string;

  @ApiPropertyOptional({
    example: 'So‘nggi 10 kunda chet elga chiqmagan',
    description: 'Epidemiologik tarix',
  })
  @IsOptional()
  @IsString()
  Epidemiologik_tarix?: string;

  @ApiPropertyOptional({
    example: 'Yurak urishi tezlashgan',
    description: 'Status praesens objectivus',
  })
  @IsOptional()
  @IsString()
  Status_praesens_objectivus?: string;

  @ApiPropertyOptional({
    example: 'Ishemik yurak kasalligi',
    description: 'Shifokor tashxisi',
  })
  @IsOptional()
  @IsString()
  Tashxis?: string;

  @ApiPropertyOptional({
    example: 'EKG, qon tahlili',
    description: 'Qo‘shimcha tekshiruvlar',
  })
  @IsOptional()
  @IsString()
  Tekshiruv?: string;

  @ApiPropertyOptional({
    example: 'Dam olish va dori-darmonlar',
    description: 'Shifokor tavsiyalari',
  })
  @IsOptional()
  @IsString()
  Tibbiy_tavsiyalar?: string;
}
