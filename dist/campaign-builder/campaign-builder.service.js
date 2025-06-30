"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignBuilderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const campaign_template_entity_1 = require("./entities/campaign-template.entity");
const campaign_milestone_entity_1 = require("./entities/campaign-milestone.entity");
const campaign_rule_entity_1 = require("./entities/campaign-rule.entity");
let CampaignBuilderService = class CampaignBuilderService {
    templateRepository;
    milestoneRepository;
    ruleRepository;
    constructor(templateRepository, milestoneRepository, ruleRepository) {
        this.templateRepository = templateRepository;
        this.milestoneRepository = milestoneRepository;
        this.ruleRepository = ruleRepository;
    }
    async createTemplate(createTemplateDto) {
        const template = this.templateRepository.create({
            ...createTemplateDto,
            status: createTemplateDto.status || campaign_template_entity_1.TemplateStatus.DRAFT,
        });
        const savedTemplate = await this.templateRepository.save(template);
        const milestones = createTemplateDto.milestones.map(milestone => this.milestoneRepository.create({
            ...milestone,
            templateId: savedTemplate.id,
        }));
        await this.milestoneRepository.save(milestones);
        const rules = createTemplateDto.rules.map(rule => this.ruleRepository.create({
            ...rule,
            templateId: savedTemplate.id,
        }));
        await this.ruleRepository.save(rules);
        return this.findOne(savedTemplate.id);
    }
    async findAll(status) {
        const query = this.templateRepository.createQueryBuilder('template')
            .leftJoinAndSelect('template.milestones', 'milestones')
            .leftJoinAndSelect('template.rules', 'rules');
        if (status) {
            query.where('template.status = :status', { status });
        }
        return query.getMany();
    }
    async findOne(id) {
        const template = await this.templateRepository.findOne({
            where: { id },
            relations: ['milestones', 'rules'],
        });
        if (!template) {
            throw new common_1.NotFoundException(`Template with ID ${id} not found`);
        }
        return template;
    }
    async updateStatus(id, status) {
        const template = await this.findOne(id);
        if (template.status === status) {
            throw new common_1.BadRequestException(`Template is already in ${status} status`);
        }
        template.status = status;
        return this.templateRepository.save(template);
    }
    async incrementUsageCount(id) {
        await this.templateRepository.increment({ id }, 'usageCount', 1);
    }
    async cloneTemplate(id) {
        const template = await this.findOne(id);
        const clonedTemplate = this.templateRepository.create({
            title: `${template.title} (Copy)`,
            description: template.description,
            status: campaign_template_entity_1.TemplateStatus.DRAFT,
            rewardStructure: template.rewardStructure,
            targetingRules: template.targetingRules,
            metadata: template.metadata,
        });
        const savedTemplate = await this.templateRepository.save(clonedTemplate);
        const clonedMilestones = template.milestones.map(milestone => this.milestoneRepository.create({
            ...milestone,
            id: undefined,
            templateId: savedTemplate.id,
        }));
        await this.milestoneRepository.save(clonedMilestones);
        const clonedRules = template.rules.map(rule => this.ruleRepository.create({
            ...rule,
            id: undefined,
            templateId: savedTemplate.id,
        }));
        await this.ruleRepository.save(clonedRules);
        return this.findOne(savedTemplate.id);
    }
};
exports.CampaignBuilderService = CampaignBuilderService;
exports.CampaignBuilderService = CampaignBuilderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(campaign_template_entity_1.CampaignTemplate)),
    __param(1, (0, typeorm_1.InjectRepository)(campaign_milestone_entity_1.CampaignMilestone)),
    __param(2, (0, typeorm_1.InjectRepository)(campaign_rule_entity_1.CampaignRule)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CampaignBuilderService);
//# sourceMappingURL=campaign-builder.service.js.map