import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignTemplate, TemplateStatus } from './entities/campaign-template.entity';
import { CampaignMilestone } from './entities/campaign-milestone.entity';
import { CampaignRule } from './entities/campaign-rule.entity';
import { CreateTemplateDto } from './dto/create-template.dto';

@Injectable()
export class CampaignBuilderService {
  constructor(
    @InjectRepository(CampaignTemplate)
    private templateRepository: Repository<CampaignTemplate>,
    @InjectRepository(CampaignMilestone)
    private milestoneRepository: Repository<CampaignMilestone>,
    @InjectRepository(CampaignRule)
    private ruleRepository: Repository<CampaignRule>,
  ) {}

  async createTemplate(createTemplateDto: CreateTemplateDto): Promise<CampaignTemplate> {
    const template = this.templateRepository.create({
      ...createTemplateDto,
      status: createTemplateDto.status || TemplateStatus.DRAFT,
    });

    const savedTemplate = await this.templateRepository.save(template);

    // Create milestones
    const milestones = createTemplateDto.milestones.map(milestone => 
      this.milestoneRepository.create({
        ...milestone,
        templateId: savedTemplate.id,
      })
    );
    await this.milestoneRepository.save(milestones);

    // Create rules
    const rules = createTemplateDto.rules.map(rule =>
      this.ruleRepository.create({
        ...rule,
        templateId: savedTemplate.id,
      })
    );
    await this.ruleRepository.save(rules);

    return this.findOne(savedTemplate.id);
  }

  async findAll(status?: TemplateStatus): Promise<CampaignTemplate[]> {
    const query = this.templateRepository.createQueryBuilder('template')
      .leftJoinAndSelect('template.milestones', 'milestones')
      .leftJoinAndSelect('template.rules', 'rules');

    if (status) {
      query.where('template.status = :status', { status });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<CampaignTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ['milestones', 'rules'],
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }

  async updateStatus(id: string, status: TemplateStatus): Promise<CampaignTemplate> {
    const template = await this.findOne(id);

    if (template.status === status) {
      throw new BadRequestException(`Template is already in ${status} status`);
    }

    template.status = status;
    return this.templateRepository.save(template);
  }

  async incrementUsageCount(id: string): Promise<void> {
    await this.templateRepository.increment({ id }, 'usageCount', 1);
  }

  async cloneTemplate(id: string): Promise<CampaignTemplate> {
    const template = await this.findOne(id);
    
    // Create new template with cloned data
    const clonedTemplate = this.templateRepository.create({
      title: `${template.title} (Copy)`,
      description: template.description,
      status: TemplateStatus.DRAFT,
      rewardStructure: template.rewardStructure,
      targetingRules: template.targetingRules,
      metadata: template.metadata,
    });

    const savedTemplate = await this.templateRepository.save(clonedTemplate);

    // Clone milestones
    const clonedMilestones = template.milestones.map(milestone =>
      this.milestoneRepository.create({
        ...milestone,
        id: undefined,
        templateId: savedTemplate.id,
      })
    );
    await this.milestoneRepository.save(clonedMilestones);

    // Clone rules
    const clonedRules = template.rules.map(rule =>
      this.ruleRepository.create({
        ...rule,
        id: undefined,
        templateId: savedTemplate.id,
      })
    );
    await this.ruleRepository.save(clonedRules);

    return this.findOne(savedTemplate.id);
  }
} 