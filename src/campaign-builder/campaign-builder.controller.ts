import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CampaignBuilderService } from './campaign-builder.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TemplateStatus } from './entities/campaign-template.entity';

@Controller('campaigns/templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CampaignBuilderController {
  constructor(private readonly campaignBuilderService: CampaignBuilderService) {}

  @Post()
  @Roles('admin', 'moderator')
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    return this.campaignBuilderService.createTemplate(createTemplateDto);
  }

  @Get()
  @Roles('admin', 'moderator', 'user')
  async findAll(@Query('status') status?: TemplateStatus) {
    return this.campaignBuilderService.findAll(status);
  }

  @Get(':id')
  @Roles('admin', 'moderator', 'user')
  async findOne(@Param('id') id: string) {
    return this.campaignBuilderService.findOne(id);
  }

  @Post(':id/status')
  @Roles('admin', 'moderator')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: TemplateStatus,
  ) {
    return this.campaignBuilderService.updateStatus(id, status);
  }

  @Post(':id/clone')
  @Roles('admin', 'moderator')
  async cloneTemplate(@Param('id') id: string) {
    return this.campaignBuilderService.cloneTemplate(id);
  }
} 