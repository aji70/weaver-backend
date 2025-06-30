"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolIntegrationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const protocol_event_listener_service_1 = require("./services/protocol-event-listener.service");
const protocol_event_storage_service_1 = require("./services/protocol-event-storage.service");
const protocol_event_entity_1 = require("./entities/protocol-event.entity");
const config_1 = require("@nestjs/config");
let ProtocolIntegrationModule = class ProtocolIntegrationModule {
};
exports.ProtocolIntegrationModule = ProtocolIntegrationModule;
exports.ProtocolIntegrationModule = ProtocolIntegrationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([protocol_event_entity_1.ProtocolEvent]),
        ],
        providers: [
            protocol_event_listener_service_1.ProtocolEventListenerService,
            protocol_event_storage_service_1.ProtocolEventStorageService,
        ],
        exports: [protocol_event_listener_service_1.ProtocolEventListenerService],
    })
], ProtocolIntegrationModule);
//# sourceMappingURL=protocol-integration.module.js.map