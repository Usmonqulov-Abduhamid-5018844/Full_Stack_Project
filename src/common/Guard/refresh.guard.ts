import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

import { ErrorHender } from "src/infrostructure/utils/catchError";

@Injectable()
export class RefreshGuard implements CanActivate {
    constructor(private readonly Jwt: JwtService,
    ){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        const authHeader = request.headers.authorization;

        if(!authHeader){
            throw new NotFoundException("Token Not Fount")
        }
        const [bearer, token] = authHeader.split(" ")
        if(bearer == "bearer" || !token){
            throw new UnauthorizedException("Invalid authorization format")
        }
        try {
            const data = this.Jwt.verify(token, {
                secret: String(process.env.REFRESH_SECRET)
            })
            request["user"] = data
            return true
        } catch (error) {
            return ErrorHender(error)
        }
    }
}