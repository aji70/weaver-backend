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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProtocolEventStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolEventStorageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const protocol_event_entity_1 = require("../entities/protocol-event.entity");
let ProtocolEventStorageService = ProtocolEventStorageService_1 = class ProtocolEventStorageService {
    eventRepository;
    logger = new common_1.Logger(ProtocolEventStorageService_1.name);
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async saveEvent(event) {
        try {
            const savedEvent = await this.eventRepository.save(event);
            this.logger.debug(`Saved event for protocol ${event.protocolId}`);
            return savedEvent;
        }
        catch (error) {
            this.logger.error(`Failed to save event: ${error.message}`);
            throw error;
        }
    }
    async getUnprocessedEvents() {
        return this.eventRepository.find({
            where: { processed: false },
            order: { timestamp: 'ASC' },
        });
    }
    async markEventAsProcessed(eventId) {
        await this.eventRepository.update(eventId, { processed: true });
    }
    async getEventsByProtocol(protocolId, options = {}) {
        const query = this.eventRepository.createQueryBuilder('event')
            .where('event.protocolId = :protocolId', { protocolId });
        if (options.startDate) {
            query.andWhere('event.timestamp >= :startDate', { startDate: options.startDate });
        }
        if (options.endDate) {
            query.andWhere('event.timestamp <= :endDate', { endDate: options.endDate });
        }
        if (options.eventType) {
            query.andWhere('event.eventType = :eventType', { eventType: options.eventType });
        }
        query.orderBy('event.timestamp', 'DESC');
        if (options.limit) {
            query.take(options.limit);
        }
        if (options.offset) {
            query.skip(options.offset);
        }
        return query.getManyAndCount();
    }
    async getLatestBlockNumber(protocolId) {
        const result = await this.eventRepository
            .createQueryBuilder('event')
            .select('MAX(event.blockNumber)', 'maxBlock')
            .where('event.protocolId = :protocolId', { protocolId })
            .getRawOne();
        return result?.maxBlock || 0;
    }
};
exports.ProtocolEventStorageService = ProtocolEventStorageService;
exports.ProtocolEventStorageService = ProtocolEventStorageService = ProtocolEventStorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(protocol_event_entity_1.ProtocolEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProtocolEventStorageService);
//# sourceMappingURL=protocol-event-storage.service.js.map