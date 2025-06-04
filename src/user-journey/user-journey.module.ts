import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { UserJourneyController } from './user-journey.controller';
import { UserJourneyService } from './user-journey.service';
import { UserJourneyEvent, UserJourneyEventSchema } from './schemas/user-journey-event.schema';
import { UserJourneySummary, UserJourneySummarySchema } from './schemas/user-journey-summary.schema';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: UserJourneyEvent.name, schema: UserJourneyEventSchema },
      { name: UserJourneySummary.name, schema: UserJourneySummarySchema },
    ]),
  ],
  controllers: [UserJourneyController],
  providers: [UserJourneyService],
  exports: [UserJourneyService],
})
export class UserJourneyModule {} 