"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProtocolEventListenerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolEventListenerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ethers_1 = require("ethers");
const rxjs_1 = require("rxjs");
const protocol_event_storage_service_1 = require("./protocol-event-storage.service");
const protocol_event_entity_1 = require("../entities/protocol-event.entity");
let ProtocolEventListenerService = ProtocolEventListenerService_1 = class ProtocolEventListenerService {
    configService;
    eventStorage;
    logger = new common_1.Logger(ProtocolEventListenerService_1.name);
    providers = new Map();
    listeners = new Map();
    eventSubject = new rxjs_1.Subject();
    constructor(configService, eventStorage) {
        this.configService = configService;
        this.eventStorage = eventStorage;
    }
    async onModuleInit() {
        const protocols = this.configService.get('protocols');
        if (protocols) {
            for (const protocol of protocols) {
                await this.setupProtocolListener(protocol);
            }
        }
    }
    async onModuleDestroy() {
        for (const [protocolId, listener] of this.listeners.entries()) {
            this.logger.log(`Cleaning up listener for protocol ${protocolId}`);
            listener.removeAllListeners();
        }
    }
    async setupProtocolListener(config) {
        try {
            const provider = new ethers_1.ethers.providers.WebSocketProvider(config.rpcUrl);
            this.providers.set(config.id, provider);
            const contract = new ethers_1.ethers.Contract(config.contractAddress, config.abi, provider);
            this.listeners.set(config.id, contract);
            for (const eventType of config.eventTypes) {
                this.setupEventTypeListener(config.id, contract, eventType);
            }
            this.logger.log(`Successfully setup listener for protocol ${config.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to setup listener for protocol ${config.id}: ${error.message}`);
            throw error;
        }
    }
    setupEventTypeListener(protocolId, contract, eventType) {
        const eventName = this.getEventNameFromType(eventType);
        contract.on(eventName, async (...args) => {
            try {
                const event = args[args.length - 1];
                const protocolEvent = {
                    protocolId,
                    eventType,
                    payload: this.decodeEventPayload(event),
                    blockNumber: event.blockNumber,
                    transactionHash: event.transactionHash,
                    processed: false,
                };
                await this.eventStorage.saveEvent(protocolEvent);
                this.eventSubject.next(protocolEvent);
            }
            catch (error) {
                this.logger.error(`Error processing ${eventType} event for protocol ${protocolId}: ${error.message}`);
            }
        });
    }
    getEventNameFromType(eventType) {
        switch (eventType) {
            case protocol_event_entity_1.ProtocolEventType.REWARD_CLAIM:
                return 'RewardClaimed';
            case protocol_event_entity_1.ProtocolEventType.TOKEN_TRANSFER:
                return 'Transfer';
            case protocol_event_entity_1.ProtocolEventType.NFT_MINT:
                return 'Mint';
            default:
                throw new Error(`Unknown event type: ${eventType}`);
        }
    }
    decodeEventPayload(event) {
        return {
            ...event.args,
            eventName: event.event,
        };
    }
    getEventStream() {
        return this.eventSubject.asObservable();
    }
    async addProtocol(config) {
        await this.setupProtocolListener(config);
    }
    async removeProtocol(protocolId) {
        const listener = this.listeners.get(protocolId);
        if (listener) {
            listener.removeAllListeners();
            this.listeners.delete(protocolId);
        }
        const provider = this.providers.get(protocolId);
        if (provider) {
            await provider.destroy();
            this.providers.delete(protocolId);
        }
    }
};
exports.ProtocolEventListenerService = ProtocolEventListenerService;
exports.ProtocolEventListenerService = ProtocolEventListenerService = ProtocolEventListenerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        protocol_event_storage_service_1.ProtocolEventStorageService])
], ProtocolEventListenerService);
//# sourceMappingURL=protocol-event-listener.service.js.map