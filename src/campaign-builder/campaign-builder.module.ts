import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignBuilderController } from './campaign-builder.controller';
import { CampaignBuilderService } from './campaign-builder.service';
import { CampaignTemplate } from './entities/campaign-template.entity';
import { CampaignMilestone } from './entities/campaign-milestone.entity';
import { CampaignRule } from './entities/campaign-rule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CampaignTemplate,
      CampaignMilestone,
      CampaignRule,
    ]),
  ],
  controllers: [CampaignBuilderController],
  providers: [CampaignBuilderService],
  exports: [CampaignBuilderService],
})
export class CampaignBuilderModule {} 