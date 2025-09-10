import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ErrorHender } from 'src/infrostructure/utils/catchError';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {

      if(req.params.id !== req["user"].id){
        console.log(req["user"].id);
        console.log(`params_Id ${req.params.id}`);
        
        
        throw new ForbiddenException("Forbidden user")
      }
      return true
    } catch (error) {
      return ErrorHender(error);
    }
  }
}
