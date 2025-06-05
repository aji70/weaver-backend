import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReputationFactor } from '../entities/reputation-factor.entity';

@Injectable()
export class ReputationFactorService {
  private readonly logger = new Logger(ReputationFactorService.name);

  constructor(
    @InjectRepository(ReputationFactor)
    private readonly factorRepository: Repository<ReputationFactor>,
  ) {}

  async getActiveFactors(): Promise<ReputationFactor[]> {
    return this.factorRepository.find({
      where: { isActive: true },
      order: { weight: 'DESC' },
    });
  }

  async createFactor(factor: Partial<ReputationFactor>): Promise<ReputationFactor> {
    const newFactor = this.factorRepository.create(factor);
    return this.factorRepository.save(newFactor);
  }

  async updateFactor(id: string, factor: Partial<ReputationFactor>): Promise<ReputationFactor> {
    await this.factorRepository.update(id, factor);
    return this.factorRepository.findOne({ where: { id } });
  }

  async deleteFactor(id: string): Promise<void> {
    await this.factorRepository.delete(id);
  }

  async getFactorByName(name: string): Promise<ReputationFactor> {
    return this.factorRepository.findOne({ where: { name } });
  }

  async initializeDefaultFactors(): Promise<void> {
    const defaultFactors = [
      {
        name: 'onChainActivity',
        description: 'User activity on the blockchain',
        weight: 0.4,
        configuration: {
          minValue: 0,
          maxValue: 1,
          calculationMethod: 'onChainActivity',
        },
      },
      {
        name: 'campaignParticipation',
        description: 'User participation in campaigns',
        weight: 0.3,
        configuration: {
          minValue: 0,
          maxValue: 1,
          calculationMethod: 'campaignParticipation',
        },
      },
      {
        name: 'accountAge',
        description: 'Age of user account',
        weight: 0.2,
        configuration: {
          minValue: 0,
          maxValue: 1,
          calculationMethod: 'accountAge',
        },
      },
      {
        name: 'kycStatus',
        description: 'KYC verification status',
        weight: 0.1,
        configuration: {
          minValue: 0,
          maxValue: 1,
          calculationMethod: 'kycStatus',
        },
      },
    ];

    for (const factor of defaultFactors) {
      const existingFactor = await this.getFactorByName(factor.name);
      if (!existingFactor) {
        await this.createFactor(factor);
      }
    }
  }
} 