import { UserJourneyService } from './user-journey.service';
import { CreateUserJourneyEventDto, UserJourneyEventResponseDto, UserJourneySummaryResponseDto } from './dto/user-journey.dto';
export declare class UserJourneyController {
    private readonly userJourneyService;
    constructor(userJourneyService: UserJourneyService);
    trackEvent(userId: string, createEventDto: CreateUserJourneyEventDto): Promise<UserJourneyEventResponseDto>;
    getUserJourney(userId: string, startDate?: string, endDate?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user-journey-event.schema").UserJourneyEventDocument> & import("./schemas/user-journey-event.schema").UserJourneyEvent & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getUserJourneySummary(userId: string, date?: string): Promise<UserJourneySummaryResponseDto>;
}
