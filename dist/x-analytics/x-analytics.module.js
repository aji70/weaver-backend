"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterAnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const x_analytics_controller_1 = require("./x-analytics.controller");
const x_analytics_service_1 = require("./x-analytics.service");
let TwitterAnalyticsModule = class TwitterAnalyticsModule {
};
exports.TwitterAnalyticsModule = TwitterAnalyticsModule;
exports.TwitterAnalyticsModule = TwitterAnalyticsModule = __decorate([
    (0, common_1.Module)({
        controllers: [x_analytics_controller_1.TwitterAnalyticsController],
        providers: [x_analytics_service_1.TwitterAnalyticsService],
        exports: [x_analytics_service_1.TwitterAnalyticsService],
    })
], TwitterAnalyticsModule);
//# sourceMappingURL=x-analytics.module.js.map