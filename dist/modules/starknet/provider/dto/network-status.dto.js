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
exports.SyncStatusDto = exports.NetworkInfoDto = exports.NetworkStatusDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const provider_options_interface_1 = require("../interfaces/provider-options.interface");
class NetworkStatusDto {
    isConnected;
    latency;
    networkInfo;
    lastError;
    lastSync;
    providerUrl;
}
exports.NetworkStatusDto = NetworkStatusDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NetworkStatusDto.prototype, "isConnected", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NetworkStatusDto.prototype, "latency", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => NetworkInfoDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], NetworkStatusDto.prototype, "networkInfo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NetworkStatusDto.prototype, "lastError", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], NetworkStatusDto.prototype, "lastSync", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NetworkStatusDto.prototype, "providerUrl", void 0);
class NetworkInfoDto {
    chainId;
    network;
    blockNumber;
    blockHash;
    gasPrice;
    syncStatus;
}
exports.NetworkInfoDto = NetworkInfoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NetworkInfoDto.prototype, "chainId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(provider_options_interface_1.StarkNetNetwork),
    __metadata("design:type", String)
], NetworkInfoDto.prototype, "network", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NetworkInfoDto.prototype, "blockNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NetworkInfoDto.prototype, "blockHash", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NetworkInfoDto.prototype, "gasPrice", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SyncStatusDto),
    __metadata("design:type", Object)
], NetworkInfoDto.prototype, "syncStatus", void 0);
class SyncStatusDto {
    starting;
    current;
    highest;
    syncing;
}
exports.SyncStatusDto = SyncStatusDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SyncStatusDto.prototype, "starting", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SyncStatusDto.prototype, "current", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SyncStatusDto.prototype, "highest", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SyncStatusDto.prototype, "syncing", void 0);
//# sourceMappingURL=network-status.dto.js.map