import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GovernanceService } from './governance.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { CreateVoteDto } from './dto/create-vote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('governance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Post('proposals')
  @Roles('admin', 'moderator')
  async createProposal(
    @Request() req,
    @Body() createProposalDto: CreateProposalDto,
  ) {
    return this.governanceService.createProposal(req.user.id, createProposalDto);
  }

  @Post('vote')
  @Roles('user', 'admin', 'moderator')
  async submitVote(
    @Request() req,
    @Body() createVoteDto: CreateVoteDto,
  ) {
    return this.governanceService.submitVote(req.user.id, createVoteDto);
  }

  @Get('results/:proposalId')
  @Roles('user', 'admin', 'moderator')
  async getProposalResults(@Param('proposalId') proposalId: string) {
    return this.governanceService.getProposalResults(proposalId);
  }

  @Post('proposals/:proposalId/close')
  @Roles('admin', 'moderator')
  async closeProposal(@Param('proposalId') proposalId: string) {
    return this.governanceService.closeProposal(proposalId);
  }
} 