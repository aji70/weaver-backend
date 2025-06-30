import { CampaignTemplate } from './campaign-template.entity';
export declare enum RuleType {
    ELIGIBILITY = "eligibility",
    COMPLETION = "completion",
    REWARD = "reward",
    CUSTOM = "custom"
}
export declare class CampaignRule {
    id: string;
    templateId: string;
    template: CampaignTemplate;
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
    actions: {
        type: string;
        params: Record<string, any>;
    }[];
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
}
