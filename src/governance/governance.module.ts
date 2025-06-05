import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernanceController } from './governance.controller';
import { GovernanceService } from './governance.service';
import { Proposal } from './entities/proposal.entity';
import { Vote } from './entities/vote.entity';
import { ReputationModule } from '../reputation/reputation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proposal, Vote]),
    ReputationModule,
  ],
  controllers: [GovernanceController],
  providers: [GovernanceService],
  exports: [GovernanceService],
})
export class GovernanceModule {} 