import { CampaignBuilderService } from './campaign-builder.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplateStatus } from './entities/campaign-template.entity';
export declare class CampaignBuilderController {
    private readonly campaignBuilderService;
    constructor(campaignBuilderService: CampaignBuilderService);
    createTemplate(createTemplateDto: CreateTemplateDto): Promise<import("./entities/campaign-template.entity").CampaignTemplate>;
    findAll(status?: TemplateStatus): Promise<import("./entities/campaign-template.entity").CampaignTemplate[]>;
    findOne(id: string): Promise<import("./entities/campaign-template.entity").CampaignTemplate>;
    updateStatus(id: string, status: TemplateStatus): Promise<import("./entities/campaign-template.entity").CampaignTemplate>;
    cloneTemplate(id: string): Promise<import("./entities/campaign-template.entity").CampaignTemplate>;
}
