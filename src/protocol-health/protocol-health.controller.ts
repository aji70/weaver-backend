import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ProtocolHealthService } from './protocol-health.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('protocols')
@UseGuards(JwtAuthGuard)
export class ProtocolHealthController {
  constructor(private readonly protocolHealthService: ProtocolHealthService) {}

  @Get(':protocolId/health')
  async getProtocolHealth(@Param('protocolId') protocolId: string) {
    return this.protocolHealthService.getProtocolHealth(protocolId);
  }

  @Get(':protocolId/health/history')
  async getProtocolHealthHistory(
    @Param('protocolId') protocolId: string,
    @Query('days') days?: number,
  ) {
    return this.protocolHealthService.getProtocolHealthHistory(protocolId, days);
  }
} 