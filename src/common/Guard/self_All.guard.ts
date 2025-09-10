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
export class SelfGuardAll implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    if (
      req['user'].role === ERols.ADMIN ||
      req['user'].role === ERols.SUPPER_ADMIN
    ) {
      return true;
    }

    if (req.params.id !== String(req['user'].id)) {
      throw new ForbiddenException('Siz bu resursga kira olmaysiz');
    }
    return true;
  }
}
