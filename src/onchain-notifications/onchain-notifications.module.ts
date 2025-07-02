import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TypeOrmModule } from "@nestjs/typeorm"
import { BullModule } from "@nestjs/bull"
import { OnchainNotificationsController } from "./controllers/onchain-notifications.controller"
import { StarkNetProviderModule } from "../modules/starknet/provider/starknet-provider.module"
import { OnchainNotification } from "./entities/onchain-notification.entity"
import { OnchainNotificationSchema } from "./schemas/onchain-notification.schema"
import { NotificationPreferences } from "./entities/notification-preferences.entity"
import { NotificationHistory } from "./entities/notification-history.entity"
import { OnchainNotificationsService } from "./services/onchain-notifications.service"
import { StarknetMessagingService } from "./services/starknet-messaging.service"
import { NotificationPreferencesService } from "./services/notification-preferences.service"
import { NotificationHistoryService } from "./services/notification-history.service"
import { NotificationQueueProcessor } from "./processors/notification-queue.processor"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OnchainNotification.name, schema: OnchainNotificationSchema }]),
    TypeOrmModule.forFeature([NotificationPreferences, NotificationHistory]),
    BullModule.registerQueue({
      name: "onchain-notifications",
    }),
    StarkNetProviderModule,
  ],
  controllers: [OnchainNotificationsController],
  providers: [
    OnchainNotificationsService,
    StarknetMessagingService,
    NotificationPreferencesService,
    NotificationHistoryService,
    NotificationQueueProcessor,
  ],
  exports: [OnchainNotificationsService],
})
export class OnchainNotificationsModule {}
