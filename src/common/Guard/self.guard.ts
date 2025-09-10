import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ERols } from '../enum';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      if (
        req['user'].role !== ERols.SUPPER_ADMIN &&
        req.params.id !== String(req['user'].id)
      ) {
        throw new ForbiddenException('Siz bu resursga kira olmaysiz');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
