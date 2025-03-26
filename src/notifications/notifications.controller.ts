import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get('user/:userId')
  findAllForUser(
    @Param('userId') userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.notificationsService.findAllForUser(userId, page, limit);
  }

  @Get('user/:userId/unread-count')
  findUnreadCount(@Param('userId') userId: string): Promise<number> {
    return this.notificationsService.findUnreadCount(userId);
  }

  @Patch(':id/mark-read')
  markAsRead(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<Notification> {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Patch('user/:userId/mark-all-read')
  markAllAsRead(@Param('userId') userId: string): Promise<void> {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    return this.notificationsService.delete(id, userId);
  }

  @Delete('user/:userId')
  deleteAll(@Param('userId') userId: string): Promise<void> {
    return this.notificationsService.deleteAll(userId);
  }
}
