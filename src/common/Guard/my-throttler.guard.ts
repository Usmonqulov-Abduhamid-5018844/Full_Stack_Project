import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class MyThrottlerGuard extends ThrottlerGuard {
  canActivate(context: ExecutionContext) {
    console.log('Throttler ishladi');
    return super.canActivate(context);
  }
}
