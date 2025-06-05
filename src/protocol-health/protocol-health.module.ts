import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtocolHealthService } from './protocol-health.service';
import { ProtocolHealthController } from './protocol-health.controller';
import { ProtocolHealthMetric } from './entities/protocol-health-metric.entity';
import { ProtocolAdapterFactory } from './adapters/protocol-adapter.factory';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ProtocolHealthMetric]),
  ],
  controllers: [ProtocolHealthController],
  providers: [ProtocolHealthService, ProtocolAdapterFactory],
  exports: [ProtocolHealthService],
})
export class ProtocolHealthModule {} 