import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CampaignMetric, CampaignMetricDocument } from './schemas/campaign-metric.schema';
import { CampaignSummary, CampaignSummaryDocument } from './schemas/campaign-summary.schema';
import { CreateCampaignMetricDto } from './dto/campaign-metric.dto';

@Injectable()
export class CampaignAnalyticsService {
  constructor(
    @InjectModel(CampaignMetric.name)
    private campaignMetricModel: Model<CampaignMetricDocument>,
    @InjectModel(CampaignSummary.name)
    private campaignSummaryModel: Model<CampaignSummaryDocument>,
  ) {}

  async trackMetric(createMetricDto: CreateCampaignMetricDto): Promise<CampaignMetric> {
    const metric = new this.campaignMetricModel({
      ...createMetricDto,
      timestamp: createMetricDto.timestamp || new Date(),
    });
    return metric.save();
  }

  async getCampaignMetrics(campaignId: string, startDate?: Date, endDate?: Date) {
    const query: any = { campaignId };
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = startDate;
      if (endDate) query.timestamp.$lte = endDate;
    }
    return this.campaignMetricModel.find(query).sort({ timestamp: -1 }).exec();
  }

  async getCampaignSummary(campaignId: string, date?: Date) {
    const queryDate = date || new Date();
    queryDate.setHours(0, 0, 0, 0);

    return this.campaignSummaryModel.findOne({
      campaignId,
      date: queryDate,
    }).exec();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async aggregateDailyMetrics() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const metrics = await this.campaignMetricModel.find({
      timestamp: {
        $gte: yesterday,
        $lt: today,
      },
    }).exec();

    const campaignSummaries = new Map<string, any>();

    for (const metric of metrics) {
      if (!campaignSummaries.has(metric.campaignId)) {
        campaignSummaries.set(metric.campaignId, {
          campaignId: metric.campaignId,
          date: yesterday,
          impressions: 0,
          clicks: 0,
          taskStarts: 0,
          taskCompletions: 0,
          cost: 0,
          revenue: 0,
        });
      }

      const summary = campaignSummaries.get(metric.campaignId);
      switch (metric.type) {
        case 'impression':
          summary.impressions++;
          break;
        case 'click':
          summary.clicks++;
          break;
        case 'task_start':
          summary.taskStarts++;
          break;
        case 'task_complete':
          summary.taskCompletions++;
          break;
      }
    }

    // Calculate derived metrics
    for (const summary of campaignSummaries.values()) {
      summary.ctr = summary.impressions > 0 ? (summary.clicks / summary.impressions) * 100 : 0;
      summary.conversionRate = summary.taskStarts > 0 ? (summary.taskCompletions / summary.taskStarts) * 100 : 0;
      summary.roi = summary.cost > 0 ? ((summary.revenue - summary.cost) / summary.cost) * 100 : 0;
      summary.cpa = summary.taskCompletions > 0 ? summary.cost / summary.taskCompletions : 0;

      await this.campaignSummaryModel.findOneAndUpdate(
        { campaignId: summary.campaignId, date: summary.date },
        summary,
        { upsert: true, new: true },
      );
    }
  }
} 