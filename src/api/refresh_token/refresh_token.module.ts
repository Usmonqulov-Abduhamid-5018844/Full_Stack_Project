import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh_token.service';
import { RefreshTokenController } from './refresh_token.controller';
import { Token } from 'src/infrostructure/utils/Token';

@Module({
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService, Token],
})
export class RefreshTokenModule {}
