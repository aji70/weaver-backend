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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderConfigDto = void 0;
const class_validator_1 = require("class-validator");
const provider_options_interface_1 = require("../interfaces/provider-options.interface");
class ProviderConfigDto {
    network;
    providerType;
    nodeUrl;
    apiKey;
    retryAttempts;
    retryDelay;
    timeout;
    cacheEnabled;
    cacheTTL;
}
exports.ProviderConfigDto = ProviderConfigDto;
__decorate([
    (0, class_validator_1.IsEnum)(provider_options_interface_1.StarkNetNetwork),
    __metadata("design:type", String)
], ProviderConfigDto.prototype, "network", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(provider_options_interface_1.ProviderType),
    __metadata("design:type", String)
], ProviderConfigDto.prototype, "providerType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProviderConfigDto.prototype, "nodeUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProviderConfigDto.prototype, "apiKey", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], ProviderConfigDto.prototype, "retryAttempts", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(5000),
    __metadata("design:type", Number)
], ProviderConfigDto.prototype, "retryDelay", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1000),
    (0, class_validator_1.Max)(30000),
    __metadata("design:type", Number)
], ProviderConfigDto.prototype, "timeout", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProviderConfigDto.prototype, "cacheEnabled", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ProviderConfigDto.prototype, "cacheTTL", void 0);
//# sourceMappingURL=provider-config.dto.js.map