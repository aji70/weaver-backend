import { TemplateStatus } from '../entities/campaign-template.entity';
import { MilestoneType } from '../entities/campaign-milestone.entity';
import { RuleType } from '../entities/campaign-rule.entity';
declare class RewardStructureDto {
    type: string;
    amount: number;
    tokenAddress?: string;
    distributionRules: Record<string, any>;
}
declare class TargetingRulesDto {
    userTypes: string[];
    minReputation?: number;
    requiredNfts?: string[];
    customConditions?: Record<string, any>;
}
declare class MilestoneDto {
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
    metadata?: Record<string, any>;
}
declare class RuleDto {
    name: string;
    description: string;
    type: RuleType;
    conditions: {
        operator: 'AND' | 'OR';
        rules: Array<{
            field: string;
            operator: string;
            value: any;
        }>;
    };
    actions?: {
        type: string;
        params: Record<string, any>;
    }[];
    metadata?: Record<string, any>;
}
export declare class CreateTemplateDto {
    title: string;
    description: string;
    status?: TemplateStatus;
    rewardStructure: RewardStructureDto;
    targetingRules?: TargetingRulesDto;
    milestones: MilestoneDto[];
    rules: RuleDto[];
    metadata?: Record<string, any>;
}
export {};
