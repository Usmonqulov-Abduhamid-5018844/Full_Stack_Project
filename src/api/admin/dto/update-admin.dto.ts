import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateAdminDto {
       @ApiProperty({example: "Usmonqulov Abduhamid"})
        @IsString()
        @IsNotEmpty()
        full_name: string
    
        @ApiProperty({example: "+998930451852"})
        @IsString()
        @IsPhoneNumber("UZ")
        @IsNotEmpty()
        phone: string
    
        @ApiProperty({example: "12345678"})
        @IsString()
        @IsNotEmpty()
        password: string
    
        @ApiProperty({example: "Abduhamid"})
        @IsString()
        @IsNotEmpty()
        login: string
    
}
