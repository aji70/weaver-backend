import { Model } from 'mongoose';
import { UserJourneyEvent, UserJourneyEventDocument } from './schemas/user-journey-event.schema';
import { UserJourneySummary, UserJourneySummaryDocument } from './schemas/user-journey-summary.schema';
import { CreateUserJourneyEventDto } from './dto/user-journey.dto';
export declare class UserJourneyService {
    private userJourneyEventModel;
    private userJourneySummaryModel;
    constructor(userJourneyEventModel: Model<UserJourneyEventDocument>, userJourneySummaryModel: Model<UserJourneySummaryDocument>);
    trackEvent(createEventDto: CreateUserJourneyEventDto): Promise<UserJourneyEvent>;
    getUserJourney(userId: string, startDate?: Date, endDate?: Date): Promise<(import("mongoose").Document<unknown, {}, UserJourneyEventDocument> & UserJourneyEvent & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getUserJourneySummary(userId: string, date?: Date): Promise<(import("mongoose").Document<unknown, {}, UserJourneySummaryDocument> & UserJourneySummary & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    aggregateDailyJourneys(): Promise<void>;
}
