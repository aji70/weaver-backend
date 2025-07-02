import { PartialType } from '@nestjs/mapped-types';
import { CreateOnchainNotificationDto } from './create-onchain-notification.dto';

export class UpdateOnchainNotificationDto extends PartialType(CreateOnchainNotificationDto) {}
