import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateAdminDto {
       @ApiProperty({example: "Usmonqulov Abduhamid"})
        @IsString()
        @IsOptional()
        full_name: string
    
        @ApiProperty({example: "+998930451852"})
        @IsString()
        @IsPhoneNumber("UZ")
        @IsOptional()
        phone: string
    
        @ApiProperty({example: "12345678"})
        @IsString()
        @IsOptional()
        password: string
    
        @ApiProperty({example: "Abduhamid"})
        @IsString()
        @IsOptional()
        login: string
    
}
