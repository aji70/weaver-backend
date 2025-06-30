export declare class CreateUserJourneyEventDto {
    userId: string;
    sessionId: string;
    actionType: string;
    actionName: string;
    actionData?: Record<string, any>;
    timestamp?: Date;
    duration?: number;
    previousAction?: string;
    nextAction?: string;
    success?: boolean;
    errorMessage?: string;
    metadata?: Record<string, any>;
}
export declare class UserJourneyEventResponseDto {
    userId: string;
    sessionId: string;
    actionType: string;
    actionName: string;
    actionData?: Record<string, any>;
    timestamp: Date;
    duration?: number;
    previousAction?: string;
    nextAction?: string;
    success?: boolean;
    errorMessage?: string;
    metadata?: Record<string, any>;
}
export declare class UserJourneySummaryResponseDto {
    userId: string;
    date: Date;
    sessionCount: number;
    totalActions: number;
    actionTypeCounts: Record<string, number>;
    actionNameCounts: Record<string, number>;
    actionDurations: Record<string, number>;
    successRates: Record<string, number>;
    commonFlows: Record<string, string[]>;
    dropOffPoints: Record<string, number>;
    averageSessionDuration: number;
    completionRate: number;
    metadata?: Record<string, any>;
}
