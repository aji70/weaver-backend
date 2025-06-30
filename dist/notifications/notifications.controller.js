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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const create_notification_dto_1 = require("./dto/create-notification.dto");
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    create(createNotificationDto) {
        return this.notificationsService.create(createNotificationDto);
    }
    findAllForUser(userId, page, limit) {
        return this.notificationsService.findAllForUser(userId, page, limit);
    }
    findUnreadCount(userId) {
        return this.notificationsService.findUnreadCount(userId);
    }
    markAsRead(id, userId) {
        return this.notificationsService.markAsRead(id, userId);
    }
    markAllAsRead(userId) {
        return this.notificationsService.markAllAsRead(userId);
    }
    delete(id, userId) {
        return this.notificationsService.delete(id, userId);
    }
    deleteAll(userId) {
        return this.notificationsService.deleteAll(userId);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAllForUser", null);
__decorate([
    (0, common_1.Get)('user/:userId/unread-count'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "findUnreadCount", null);
__decorate([
    (0, common_1.Patch)(':id/mark-read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('user/:userId/mark-all-read'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteAll", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map