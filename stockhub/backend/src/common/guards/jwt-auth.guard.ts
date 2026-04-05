import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

// 虚拟认证守卫 - 用于测试环境
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 测试环境：允许所有请求通过
    return true;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 测试环境：允许所有请求通过
    return true;
  }
}
