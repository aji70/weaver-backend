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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_entity_1 = require("./entities/notification.entity");
let NotificationsService = class NotificationsService {
    notificationModel;
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
    }
    async create(createNotificationDto) {
        const notification = new this.notificationModel(createNotificationDto);
        return notification.save();
    }
    async findAllForUser(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            this.notificationModel
                .find({ recipient: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.notificationModel.countDocuments({ recipient: userId }),
        ]);
        return {
            notifications,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    async findUnreadCount(userId) {
        return this.notificationModel.countDocuments({
            recipient: userId,
            isRead: false,
        });
    }
    async markAsRead(id, userId) {
        const notification = await this.notificationModel
            .findOneAndUpdate({ _id: id, recipient: userId }, { isRead: true }, { new: true })
            .exec();
        if (!notification) {
            throw new common_1.NotFoundException(`Notification not found or unauthorized`);
        }
        return notification;
    }
    async markAllAsRead(userId) {
        await this.notificationModel
            .updateMany({ recipient: userId, isRead: false }, { isRead: true })
            .exec();
    }
    async delete(id, userId) {
        const result = await this.notificationModel
            .deleteOne({ _id: id, recipient: userId })
            .exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Notification not found or unauthorized`);
        }
    }
    async deleteAll(userId) {
        await this.notificationModel.deleteMany({ recipient: userId }).exec();
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_entity_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map