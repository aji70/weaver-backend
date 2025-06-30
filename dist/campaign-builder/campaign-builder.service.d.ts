import { Repository } from 'typeorm';
import { CampaignTemplate, TemplateStatus } from './entities/campaign-template.entity';
import { CampaignMilestone } from './entities/campaign-milestone.entity';
import { CampaignRule } from './entities/campaign-rule.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
export declare class CampaignBuilderService {
    private templateRepository;
    private milestoneRepository;
    private ruleRepository;
    constructor(templateRepository: Repository<CampaignTemplate>, milestoneRepository: Repository<CampaignMilestone>, ruleRepository: Repository<CampaignRule>);
    createTemplate(createTemplateDto: CreateTemplateDto): Promise<CampaignTemplate>;
    findAll(status?: TemplateStatus): Promise<CampaignTemplate[]>;
    findOne(id: string): Promise<CampaignTemplate>;
    updateStatus(id: string, status: TemplateStatus): Promise<CampaignTemplate>;
    incrementUsageCount(id: string): Promise<void>;
    cloneTemplate(id: string): Promise<CampaignTemplate>;
}
