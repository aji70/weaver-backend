import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtocolEventListenerService } from './services/protocol-event-listener.service';
import { ProtocolEventStorageService } from './services/protocol-event-storage.service';
import { ProtocolEvent } from './entities/protocol-event.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ProtocolEvent]),
  ],
  providers: [
    ProtocolEventListenerService,
    ProtocolEventStorageService,
  ],
  exports: [ProtocolEventListenerService],
})
export class ProtocolIntegrationModule {} 