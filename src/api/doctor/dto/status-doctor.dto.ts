import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EStatus } from 'src/common/enum';

export class StatusDto {
  @ApiProperty({ example: "block | finish"  })
  @IsNotEmpty()
  @IsEnum(EStatus)
  status: EStatus.BLOCK | EStatus.FINISH;

}
