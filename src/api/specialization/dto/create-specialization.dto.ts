import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateSpecializationDto {
  @ApiProperty({ example: "Nevropatolog", description: "Mutaxassislik nomi" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: `Asab tizimi kasalliklari bilan shug'ullanadigan mutaxassis`,
    description: "Mutaxassislik haqida qisqa izoh",
  })
  @IsNotEmpty()
  @IsString()
  desc: string;
}
