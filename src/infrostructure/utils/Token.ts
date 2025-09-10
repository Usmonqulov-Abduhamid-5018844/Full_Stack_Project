import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Token {
  constructor(private readonly jwt: JwtService) {}

  AcsesToken(peload: { id: number; role: string }) {
    return this.jwt.sign(peload, {
      secret: String(process.env.ACSES_SECRET || 'acses_key'),
      expiresIn: '30d',
    });
  }
  RefreshToken(peload: { id: number; role: string }) {
    return this.jwt.sign(peload, {
      secret: String(process.env.REFRESH_SECRET || 'refresh_key'),
      expiresIn: '1h',
    });
  }
}
