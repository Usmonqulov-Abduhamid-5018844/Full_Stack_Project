import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { ECommentSender } from '@prisma/client';

export class CreateCommentDto {
  @ApiProperty({ example: 'Doktor juda yaxshi ishladi' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  star: number;

  @ApiProperty({ example: 'doctor | patients', enum: ECommentSender })
  @IsEnum(ECommentSender)
  sender: ECommentSender;

  @ApiProperty({ example: 1 })
  @IsInt()
  patients_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  doctor_id: number;
}
