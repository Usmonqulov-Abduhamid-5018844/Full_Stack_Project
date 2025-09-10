import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty({
    description: 'Yangi access token',
    example: 'fsdsgbfe3543qavdfbrte54tewcvdsbxzvasc',
  })
  accessToken: string;
}
