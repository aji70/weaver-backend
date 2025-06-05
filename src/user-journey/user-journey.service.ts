import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserJourneyEvent, UserJourneyEventDocument } from './schemas/user-journey-event.schema';
import { UserJourneySummary, UserJourneySummaryDocument } from './schemas/user-journey-summary.schema';
import { CreateUserJourneyEventDto } from './dto/user-journey.dto';

@Injectable()
export class UserJourneyService {
  constructor(
    @InjectModel(UserJourneyEvent.name)
    private userJourneyEventModel: Model<UserJourneyEventDocument>,
    @InjectModel(UserJourneySummary.name)
    private userJourneySummaryModel: Model<UserJourneySummaryDocument>,
  ) {}

  async trackEvent(createEventDto: CreateUserJourneyEventDto): Promise<UserJourneyEvent> {
    const event = new this.userJourneyEventModel({
      ...createEventDto,
      timestamp: createEventDto.timestamp || new Date(),
    });
    return event.save();
  }

  async getUserJourney(userId: string, startDate?: Date, endDate?: Date) {
    const query: any = { userId };
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = startDate;
      if (endDate) query.timestamp.$lte = endDate;
    }
    return this.userJourneyEventModel.find(query).sort({ timestamp: 1 }).exec();
  }

  async getUserJourneySummary(userId: string, date?: Date) {
    const queryDate = date || new Date();
    queryDate.setHours(0, 0, 0, 0);

    return this.userJourneySummaryModel.findOne({
      userId,
      date: queryDate,
    }).exec();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async aggregateDailyJourneys() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await this.userJourneyEventModel.find({
      timestamp: {
        $gte: yesterday,
        $lt: today,
      },
    }).exec();

    const userSummaries = new Map<string, any>();

    for (const event of events) {
      if (!userSummaries.has(event.userId)) {
        userSummaries.set(event.userId, {
          userId: event.userId,
          date: yesterday,
          sessionCount: new Set(),
          totalActions: 0,
          actionTypeCounts: new Map(),
          actionNameCounts: new Map(),
          actionDurations: new Map(),
          successRates: new Map(),
          commonFlows: new Map(),
          dropOffPoints: new Map(),
          totalSessionDuration: 0,
          completedSessions: 0,
        });
      }

      const summary = userSummaries.get(event.userId);
      summary.sessionCount.add(event.sessionId);
      summary.totalActions++;

      // Update action type counts
      summary.actionTypeCounts.set(
        event.actionType,
        (summary.actionTypeCounts.get(event.actionType) || 0) + 1,
      );

      // Update action name counts
      summary.actionNameCounts.set(
        event.actionName,
        (summary.actionNameCounts.get(event.actionName) || 0) + 1,
      );

      // Update action durations
      if (event.duration) {
        summary.actionDurations.set(
          event.actionName,
          (summary.actionDurations.get(event.actionName) || 0) + event.duration,
        );
      }

      // Update success rates
      if (event.success !== undefined) {
        const current = summary.successRates.get(event.actionName) || { success: 0, total: 0 };
        current.success += event.success ? 1 : 0;
        current.total += 1;
        summary.successRates.set(event.actionName, current);
      }

      // Track common flows
      if (event.previousAction && event.nextAction) {
        const flowKey = `${event.previousAction}->${event.nextAction}`;
        const flow = summary.commonFlows.get(flowKey) || [];
        flow.push(event.actionName);
        summary.commonFlows.set(flowKey, flow);
      }

      // Track drop-off points
      if (event.nextAction === null) {
        summary.dropOffPoints.set(
          event.actionName,
          (summary.dropOffPoints.get(event.actionName) || 0) + 1,
        );
      }

      // Update session duration
      if (event.duration) {
        summary.totalSessionDuration += event.duration;
      }

      // Track completed sessions
      if (event.actionName === 'session_complete') {
        summary.completedSessions++;
      }
    }

    // Calculate final metrics and save summaries
    for (const summary of userSummaries.values()) {
      const sessionCount = summary.sessionCount.size;
      const averageSessionDuration = sessionCount > 0 ? summary.totalSessionDuration / sessionCount : 0;
      const completionRate = sessionCount > 0 ? (summary.completedSessions / sessionCount) * 100 : 0;

      // Convert Maps to objects for storage
      const finalSummary = {
        userId: summary.userId,
        date: summary.date,
        sessionCount,
        totalActions: summary.totalActions,
        actionTypeCounts: Object.fromEntries(summary.actionTypeCounts),
        actionNameCounts: Object.fromEntries(summary.actionNameCounts),
        actionDurations: Object.fromEntries(summary.actionDurations),
        successRates: Object.fromEntries(
          Array.from(summary.successRates.entries()).map(([key, value]) => [
            key,
            value.total > 0 ? (value.success / value.total) * 100 : 0,
          ]),
        ),
        commonFlows: Object.fromEntries(summary.commonFlows),
        dropOffPoints: Object.fromEntries(summary.dropOffPoints),
        averageSessionDuration,
        completionRate,
      };

      await this.userJourneySummaryModel.findOneAndUpdate(
        { userId: summary.userId, date: summary.date },
        finalSummary,
        { upsert: true, new: true },
      );
    }
  }
} 