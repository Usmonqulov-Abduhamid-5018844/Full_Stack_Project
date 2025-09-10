import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Token } from 'src/infrostructure/utils/Token';
import { Request } from 'express';
import { ErrorHender } from 'src/infrostructure/utils/catchError';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly token: Token) {}

  findAll(req: Request) {
    const user = req['user'];
    try {
      const AcsesToken = this.token.AcsesToken({
        id: user.id,
        role: user.role,
      });
      return { AcsesToken };
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
