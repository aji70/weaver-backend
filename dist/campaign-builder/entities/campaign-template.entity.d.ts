import { CampaignMilestone } from './campaign-milestone.entity';
import { CampaignRule } from './campaign-rule.entity';
export declare enum TemplateStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    ARCHIVED = "archived"
}
export declare class CampaignTemplate {
    id: string;
    title: string;
    description: string;
    status: TemplateStatus;
    rewardStructure: {
        type: string;
        amount: number;
        tokenAddress?: string;
        distributionRules: Record<string, any>;
    };
    targetingRules: {
        userTypes: string[];
        minReputation?: number;
        requiredNfts?: string[];
        customConditions?: Record<string, any>;
    };
    milestones: CampaignMilestone[];
    rules: CampaignRule[];
    metadata: Record<string, any>;
    usageCount: number;
    createdAt: Date;
    updatedAt: Date;
}
