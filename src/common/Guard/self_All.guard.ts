import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ErrorHender } from 'src/infrostructure/utils/catchError';
import { ERols } from '../enum';

@Injectable()
export class SelfGuardAll implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      if (
        req['user'].role === ERols.ADMIN ||
        req['user'].role === ERols.SUPPER_ADMIN
      ) {
        return true;
      }

      if (req.params.id !== req['user'].id) {
        throw new ForbiddenException('Forbidden user');
      }
      return true;
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
