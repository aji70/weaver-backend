import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernanceTrackingService } from './governance-tracking.service';
import { GovernanceTrackingController } from './governance-tracking.controller';
import { User } from 'src/users/entities/user.entity';
import { Vote } from 'src/governance/entities/vote.entity';
import { Proposal } from 'src/governance/entities/proposal.entity';
import { Protocol } from 'src/governance/entities/protocol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Vote, Proposal, Protocol])],
  providers: [GovernanceTrackingService],
  controllers: [GovernanceTrackingController],
})
export class GovernanceTrackingModule {}
