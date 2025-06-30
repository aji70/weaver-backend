import { NotificationType } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    recipient: string;
    title: string;
    message: string;
    type: NotificationType;
    metadata?: Record<string, any>;
}
