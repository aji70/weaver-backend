/* eslint-disable prettier/prettier */

import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GovernanceTrackingService } from './governance-tracking.service';

@Controller('governance-tracking')
export class GovernanceTrackingController {
  constructor(private readonly trackingService: GovernanceTrackingService) {}

  /**
   * Get a user's governance activity, participation stats, and influence.
   * @param id - The user ID
   */
  @Get('user/:id/activity')
  @HttpCode(HttpStatus.OK)
  async getUserActivity(@Param('id', ParseIntPipe) id: number) {
    return this.trackingService.getUserGovernanceStats(id);
  }

  /**
   * governance analytics here
   * @param id - The protocol ID
   */
  @Get('protocol/:id/analytics')
  @HttpCode(HttpStatus.OK)
  async getProtocolStats(@Param('id', ParseIntPipe) id: number) {
    return this.trackingService.getProtocolAnalytics(id);
  }
}
