import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNumber } from "class-validator";

export class CreateDoctorSpecializationDto {
    @ApiProperty({example: 1})
    @Type(()=> Number)
    @IsInt()
    specialization_id: number
}
