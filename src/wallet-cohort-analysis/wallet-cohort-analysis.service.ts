import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cohort, CohortDocument } from './entities/cohort.entity';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { QueryCohortDto } from './dto/query-cohort.dto';
import { User, UserDocument } from '../users/entities/user.entity';
import {
  TokenTransfer,
  TokenTransferDocument,
} from '../tokens/entities/token-transfer.entity';
import {
  CampaignMetric,
  CampaignMetricDocument,
} from '../campaign-analytics/schemas/campaign-metric.schema';

@Injectable()
export class WalletCohortAnalysisService {
  constructor(
    @InjectModel(Cohort.name) private cohortModel: Model<CohortDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(TokenTransfer.name)
    private tokenTransferModel: Model<TokenTransferDocument>,
    @InjectModel(CampaignMetric.name)
    private campaignMetricModel: Model<CampaignMetricDocument>,
  ) {}

  async createCohort(dto: CreateCohortDto): Promise<Cohort> {
    const created = new this.cohortModel({ ...dto, members: [] });
    return created.save();
  }

  async listCohorts(): Promise<Cohort[]> {
    return this.cohortModel.find().exec();
  }

  async getCohortById(id: string): Promise<Cohort> {
    const cohort = await this.cohortModel.findById(id).exec();
    if (!cohort) throw new NotFoundException('Cohort not found');
    return cohort;
  }

  async queryCohorts(query: QueryCohortDto): Promise<Cohort[]> {
    return this.cohortModel.find(query).exec();
  }

  async exportCohortMembers(id: string): Promise<string[]> {
    const cohort = await this.getCohortById(id);
    return cohort.members;
  }

  async updateCohortMembers(id: string): Promise<Cohort> {
    // Recalculate and update members based on cohort type and criteria
    return this.recalculateCohortMembers(id);
  }

  async recalculateCohortMembers(cohortId: string): Promise<Cohort> {
    const cohort = await this.getCohortById(cohortId);
    let members: string[] = [];
    switch (cohort.type) {
      case 'whale':
        members = await this.getWhaleWallets(cohort.criteria);
        break;
      case 'new_joiner':
        members = await this.getNewJoiners(cohort.criteria);
        break;
      case 'dormant':
        members = await this.getDormantWallets(cohort.criteria);
        break;
      case 'campaign_participant':
        members = await this.getCampaignParticipants(cohort.criteria);
        break;
      case 'custom':
        members = this.getCustomCohortMembers(cohort.criteria);
        break;
      default:
        throw new Error('Unknown cohort type');
    }
    // Update the cohort document with new members
    const updated = await this.cohortModel
      .findByIdAndUpdate(cohortId, { members }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Cohort not found after update');
    return updated;
  }

  async recalculateAllCohorts(): Promise<void> {
    const cohorts = await this.cohortModel.find();
    for (const cohort of cohorts) {
      const id = cohort._id as Types.ObjectId;
      if (id && Types.ObjectId.isValid(id)) {
        await this.recalculateCohortMembers(id.toString());
      }
    }
  }

  // --- Cohort Calculation Methods ---
  private async getWhaleWallets(
    criteria: Record<string, any>,
  ): Promise<string[]> {
    const threshold =
      typeof criteria?.minTotalValue === 'number'
        ? criteria.minTotalValue
        : 10000;
    const pipeline = [
      {
        $group: {
          _id: '$recipient',
          total: { $sum: { $toDouble: '$amount' } },
        },
      },
      { $match: { total: { $gte: threshold } } },
    ];
    type WhaleResult = { _id: string; total: number };
    const results: WhaleResult[] =
      await this.tokenTransferModel.aggregate<WhaleResult>(pipeline);
    return results
      .map((r) => r._id)
      .filter((id): id is string => typeof id === 'string');
  }

  private async getNewJoiners(
    criteria: Record<string, any>,
  ): Promise<string[]> {
    const days = typeof criteria?.days === 'number' ? criteria.days : 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const users = await this.userModel.find({ createdAt: { $gte: since } });
    return users
      .map((u) => u.address)
      .filter((addr): addr is string => typeof addr === 'string');
  }

  private async getDormantWallets(
    criteria: Record<string, any>,
  ): Promise<string[]> {
    const days = typeof criteria?.days === 'number' ? criteria.days : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const users = await this.userModel.find();
    const activeUserIdsRaw = await this.tokenTransferModel.distinct('sender', {
      createdAt: { $gte: since },
    });
    function hasToHexString(
      obj: unknown,
    ): obj is { toHexString: () => string } {
      return (
        !!obj &&
        typeof obj === 'object' &&
        typeof (obj as { toHexString: () => string }).toHexString === 'function'
      );
    }
    const activeUserIds: string[] = activeUserIdsRaw
      .map((id) => {
        if (hasToHexString(id)) {
          return id.toHexString();
        }
        if (typeof id === 'string' || typeof id === 'number') {
          return String(id);
        }
        return undefined;
      })
      .filter((id): id is string => typeof id === 'string');
    // Only include users whose _id is not in activeUserIds
    return users
      .filter(
        (u) =>
          !activeUserIds.some(
            (id) => id?.toString() === (u._id as Types.ObjectId).toString(),
          ),
      )
      .map((u) => u.address)
      .filter((addr): addr is string => typeof addr === 'string');
  }

  private async getCampaignParticipants(
    criteria: Record<string, any>,
  ): Promise<string[]> {
    const campaignId =
      typeof criteria?.campaignId === 'string'
        ? criteria.campaignId
        : undefined;
    if (!campaignId) return [];
    const metrics: { userId?: string }[] = await this.campaignMetricModel.find({
      campaignId,
    });
    return Array.from(
      new Set(
        metrics
          .map((m) => m.userId)
          .filter((id): id is string => typeof id === 'string'),
      ),
    );
  }

  private getCustomCohortMembers(criteria: Record<string, any>): string[] {
    const addresses = Array.isArray(criteria?.addresses)
      ? criteria.addresses
      : [];
    return addresses.filter((addr): addr is string => typeof addr === 'string');
  }

  /**
   * Returns time-series data for cohort size, total/avg value, and engagement (transactions) per week for the last 12 weeks.
   */
  async getCohortTrends(cohortId: string): Promise<
    Array<{
      weekStart: Date;
      weekEnd: Date;
      cohortSize: number;
      totalValue: number;
      avgValue: number;
      txCount: number;
    }>
  > {
    const cohort = await this.getCohortById(cohortId);
    const now = new Date();
    const weeks = 12;
    const trends: Array<{
      weekStart: Date;
      weekEnd: Date;
      cohortSize: number;
      totalValue: number;
      avgValue: number;
      txCount: number;
    }> = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const start = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const members = cohort.members;
      const txs = await this.tokenTransferModel.find({
        recipient: { $in: members },
        createdAt: { $gte: start, $lt: end },
      });
      const totalValue = txs.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const avgValue = txs.length ? totalValue / txs.length : 0;
      trends.push({
        weekStart: start,
        weekEnd: end,
        cohortSize: members.length,
        totalValue,
        avgValue,
        txCount: txs.length,
      });
    }
    return trends;
  }

  /**
   * Returns retention rates for the cohort: percentage of members active in each of the next 4 weeks after joining.
   */
  async getCohortRetention(cohortId: string): Promise<number[]> {
    const cohort = await this.getCohortById(cohortId);
    type LeanUser = User & { _id: string; createdAt: Date };
    const users = await this.userModel
      .find({ address: { $in: cohort.members } })
      .lean();
    const retention = [0, 0, 0, 0];
    // Only consider users with a valid createdAt date
    const filteredUsers = (users as unknown as LeanUser[]).filter((u) => {
      return u.createdAt instanceof Date && !isNaN(u.createdAt.getTime());
    });
    for (const user of filteredUsers) {
      const createdAt: Date = user.createdAt;
      const userId = user._id ? user._id.toString() : undefined;
      if (!userId) continue;
      for (let week = 0; week < 4; week++) {
        const start = new Date(
          createdAt.getTime() + week * 7 * 24 * 60 * 60 * 1000,
        );
        const end = new Date(
          createdAt.getTime() + (week + 1) * 7 * 24 * 60 * 60 * 1000,
        );
        const active = await this.tokenTransferModel.exists({
          $or: [
            { sender: userId, createdAt: { $gte: start, $lt: end } },
            { recipient: userId, createdAt: { $gte: start, $lt: end } },
          ],
        });
        if (active) retention[week]++;
      }
    }
    const total = filteredUsers.length || 1;
    return retention.map((count) => Math.round((count / total) * 100));
  }

  /**
   * Returns the wallet addresses of all members in a cohort.
   */
  async getCohortMembers(cohortId: string): Promise<string[]> {
    const cohort = await this.getCohortById(cohortId);
    return Array.isArray(cohort.members)
      ? cohort.members.filter(
          (addr): addr is string => typeof addr === 'string',
        )
      : [];
  }
}
