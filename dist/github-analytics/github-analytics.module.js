"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubAnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const github_analytics_controller_1 = require("./github-analytics.controller");
const github_analytics_service_1 = require("./github-analytics.service");
const config_1 = require("@nestjs/config");
let GithubAnalyticsModule = class GithubAnalyticsModule {
};
exports.GithubAnalyticsModule = GithubAnalyticsModule;
exports.GithubAnalyticsModule = GithubAnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [github_analytics_controller_1.GithubAnalyticsController],
        providers: [github_analytics_service_1.GithubAnalyticsService],
        exports: [github_analytics_service_1.GithubAnalyticsService],
    })
], GithubAnalyticsModule);
//# sourceMappingURL=github-analytics.module.js.map