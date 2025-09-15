import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { EDoctorGender } from 'src/common/enum';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  first_name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  last_name?: string;

  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @IsOptional()
  @IsEnum(EDoctorGender, {
    message: `gender faqat 'male' yoki 'female' bo'lishi kerak`,
  })
  gender?: EDoctorGender;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsString()
  image?: string;
}
