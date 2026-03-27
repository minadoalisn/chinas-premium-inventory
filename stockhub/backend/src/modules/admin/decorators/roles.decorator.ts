import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

export const Roles = (...roles: string[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(RolesGuard),
  );
};
