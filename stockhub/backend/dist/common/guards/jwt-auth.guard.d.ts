import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
export declare class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
