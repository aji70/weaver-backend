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
var ReputationFactorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationFactorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reputation_factor_entity_1 = require("../entities/reputation-factor.entity");
let ReputationFactorService = ReputationFactorService_1 = class ReputationFactorService {
    factorRepository;
    logger = new common_1.Logger(ReputationFactorService_1.name);
    constructor(factorRepository) {
        this.factorRepository = factorRepository;
    }
    async getActiveFactors() {
        return this.factorRepository.find({
            where: { isActive: true },
            order: { weight: 'DESC' },
        });
    }
    async createFactor(factor) {
        const newFactor = this.factorRepository.create(factor);
        return this.factorRepository.save(newFactor);
    }
    async updateFactor(id, factor) {
        await this.factorRepository.update(id, factor);
        return this.factorRepository.findOne({ where: { id } });
    }
    async deleteFactor(id) {
        await this.factorRepository.delete(id);
    }
    async getFactorByName(name) {
        return this.factorRepository.findOne({ where: { name } });
    }
    async initializeDefaultFactors() {
        const defaultFactors = [
            {
                name: 'onChainActivity',
                description: 'User activity on the blockchain',
                weight: 0.4,
                configuration: {
                    minValue: 0,
                    maxValue: 1,
                    calculationMethod: 'onChainActivity',
                },
            },
            {
                name: 'campaignParticipation',
                description: 'User participation in campaigns',
                weight: 0.3,
                configuration: {
                    minValue: 0,
                    maxValue: 1,
                    calculationMethod: 'campaignParticipation',
                },
            },
            {
                name: 'accountAge',
                description: 'Age of user account',
                weight: 0.2,
                configuration: {
                    minValue: 0,
                    maxValue: 1,
                    calculationMethod: 'accountAge',
                },
            },
            {
                name: 'kycStatus',
                description: 'KYC verification status',
                weight: 0.1,
                configuration: {
                    minValue: 0,
                    maxValue: 1,
                    calculationMethod: 'kycStatus',
                },
            },
        ];
        for (const factor of defaultFactors) {
            const existingFactor = await this.getFactorByName(factor.name);
            if (!existingFactor) {
                await this.createFactor(factor);
            }
        }
    }
};
exports.ReputationFactorService = ReputationFactorService;
exports.ReputationFactorService = ReputationFactorService = ReputationFactorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reputation_factor_entity_1.ReputationFactor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReputationFactorService);
//# sourceMappingURL=reputation-factor.service.js.map