import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { EAdminRoles, EAdminStatus } from "@prisma/client";
export class LoginAdminDto {

    @ApiProperty({example: "12345678"})
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({example: "Abduhamid"})
    @IsString()
    @IsNotEmpty()
    login: string

    @ApiProperty({example: "+998930451852"})
    @IsString()
    @IsPhoneNumber("UZ")
    @IsNotEmpty()
    phone: string

}
