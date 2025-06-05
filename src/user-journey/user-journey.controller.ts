import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UserJourneyService } from './user-journey.service';
import { CreateUserJourneyEventDto, UserJourneyEventResponseDto, UserJourneySummaryResponseDto } from './dto/user-journey.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics/user')
@UseGuards(JwtAuthGuard)
export class UserJourneyController {
  constructor(private readonly userJourneyService: UserJourneyService) {}

  @Post(':userId/journey/event')
  async trackEvent(
    @Param('userId') userId: string,
    @Body() createEventDto: CreateUserJourneyEventDto,
  ): Promise<UserJourneyEventResponseDto> {
    createEventDto.userId = userId;
    return this.userJourneyService.trackEvent(createEventDto);
  }

  @Get(':userId/journey')
  async getUserJourney(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.userJourneyService.getUserJourney(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':userId/journey/summary')
  async getUserJourneySummary(
    @Param('userId') userId: string,
    @Query('date') date?: string,
  ): Promise<UserJourneySummaryResponseDto> {
    return this.userJourneyService.getUserJourneySummary(
      userId,
      date ? new Date(date) : undefined,
    );
  }
} 