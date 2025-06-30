import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    findAllForUser(userId: string, page?: number, limit?: number): Promise<{
        notifications: Notification[];
        total: number;
        page: number;
        pages: number;
    }>;
    findUnreadCount(userId: string): Promise<number>;
    markAsRead(id: string, userId: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<void>;
    delete(id: string, userId: string): Promise<void>;
    deleteAll(userId: string): Promise<void>;
}
