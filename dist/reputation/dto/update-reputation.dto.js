"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReputationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_reputation_dto_1 = require("./create-reputation.dto");
class UpdateReputationDto extends (0, mapped_types_1.PartialType)(create_reputation_dto_1.CreateReputationDto) {
}
exports.UpdateReputationDto = UpdateReputationDto;
//# sourceMappingURL=update-reputation.dto.js.map