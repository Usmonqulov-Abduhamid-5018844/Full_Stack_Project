import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EAdminStatus } from '@prisma/client';

export class AdminstatusDto {
  @ApiProperty({ example: 'active | in_active | block' })
  @IsOptional()
  @IsEnum(EAdminStatus, {
    message: `status faqat ( active | in_active | block ) shu qiymatlardan biri bo'lishi kerak!`,
  })
  status?: EAdminStatus;
}
