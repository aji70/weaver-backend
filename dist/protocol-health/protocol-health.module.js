"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolHealthModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const protocol_health_service_1 = require("./protocol-health.service");
const protocol_health_controller_1 = require("./protocol-health.controller");
const protocol_health_metric_entity_1 = require("./entities/protocol-health-metric.entity");
const protocol_adapter_factory_1 = require("./adapters/protocol-adapter.factory");
let ProtocolHealthModule = class ProtocolHealthModule {
};
exports.ProtocolHealthModule = ProtocolHealthModule;
exports.ProtocolHealthModule = ProtocolHealthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([protocol_health_metric_entity_1.ProtocolHealthMetric]),
        ],
        controllers: [protocol_health_controller_1.ProtocolHealthController],
        providers: [protocol_health_service_1.ProtocolHealthService, protocol_adapter_factory_1.ProtocolAdapterFactory],
        exports: [protocol_health_service_1.ProtocolHealthService],
    })
], ProtocolHealthModule);
//# sourceMappingURL=protocol-health.module.js.map