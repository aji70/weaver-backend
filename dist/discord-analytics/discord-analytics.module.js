"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordAnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const discord_analytics_controller_1 = require("./discord-analytics.controller");
const discord_analytics_service_1 = require("./discord-analytics.service");
const config_1 = require("@nestjs/config");
let DiscordAnalyticsModule = class DiscordAnalyticsModule {
};
exports.DiscordAnalyticsModule = DiscordAnalyticsModule;
exports.DiscordAnalyticsModule = DiscordAnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [discord_analytics_controller_1.DiscordAnalyticsController],
        providers: [discord_analytics_service_1.DiscordAnalyticsService],
        exports: [discord_analytics_service_1.DiscordAnalyticsService],
    })
], DiscordAnalyticsModule);
//# sourceMappingURL=discord-analytics.module.js.map