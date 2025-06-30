import { CampaignTemplate } from './campaign-template.entity';
export declare enum MilestoneType {
    TASK = "task",
    TIME = "time",
    ACHIEVEMENT = "achievement",
    CUSTOM = "custom"
}
export declare class CampaignMilestone {
    id: string;
    templateId: string;
    template: CampaignTemplate;
    title: string;
    description: string;
    type: MilestoneType;
    requirements: {
        taskId?: string;
        duration?: number;
        achievementId?: string;
        customCondition?: Record<string, any>;
    };
    rewards: {
        type: string;
        amount: number;
        tokenAddress?: string;
    };
    order: number;
    metadata: Record<string, any>;
    createdAt: Date;
}
