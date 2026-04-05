"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDemandDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_demand_dto_1 = require("./create-demand.dto");
class UpdateDemandDto extends (0, mapped_types_1.PartialType)(create_demand_dto_1.CreateDemandDto) {
}
exports.UpdateDemandDto = UpdateDemandDto;
//# sourceMappingURL=update-demand.dto.js.map