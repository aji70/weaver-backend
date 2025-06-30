"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceTrackingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const governance_tracking_service_1 = require("./governance-tracking.service");
const governance_tracking_controller_1 = require("./governance-tracking.controller");
const user_entity_1 = require("../users/entities/user.entity");
const vote_entity_1 = require("../governance/entities/vote.entity");
const proposal_entity_1 = require("../governance/entities/proposal.entity");
const protocol_entity_1 = require("../governance/entities/protocol.entity");
let GovernanceTrackingModule = class GovernanceTrackingModule {
};
exports.GovernanceTrackingModule = GovernanceTrackingModule;
exports.GovernanceTrackingModule = GovernanceTrackingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, vote_entity_1.Vote, proposal_entity_1.Proposal, protocol_entity_1.Protocol])],
        providers: [governance_tracking_service_1.GovernanceTrackingService],
        controllers: [governance_tracking_controller_1.GovernanceTrackingController],
    })
], GovernanceTrackingModule);
//# sourceMappingURL=governance-tracking.module.js.map