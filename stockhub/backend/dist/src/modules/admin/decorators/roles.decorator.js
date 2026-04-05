"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../guards/roles.guard");
const Roles = (...roles) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('roles', roles), (0, common_1.UseGuards)(roles_guard_1.RolesGuard));
};
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map