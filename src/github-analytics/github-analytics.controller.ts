import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { GithubAnalyticsService } from './github-analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('github-analytics')
@UseGuards(JwtAuthGuard)
export class GithubAnalyticsController {
  constructor(
    private readonly githubAnalyticsService: GithubAnalyticsService,
  ) {}

  @Get('repository/:owner/:repo')
  async getRepositoryAnalytics(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    return this.githubAnalyticsService.getRepositoryAnalytics(owner, repo);
  }

  @Get('contributors/:owner/:repo')
  async getContributorAnalytics(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    return this.githubAnalyticsService.getContributorAnalytics(owner, repo);
  }

  @Get('commit-activity/:owner/:repo')
  async getCommitActivity(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('days') days: number = 30,
  ) {
    return this.githubAnalyticsService.getCommitActivity(owner, repo, days);
  }

  @Get('code-frequency/:owner/:repo')
  async getCodeFrequency(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    return this.githubAnalyticsService.getCodeFrequency(owner, repo);
  }

  @Get('issue-analytics/:owner/:repo')
  async getIssueAnalytics(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('state') state: 'open' | 'closed' | 'all' = 'all',
  ) {
    return this.githubAnalyticsService.getIssueAnalytics(owner, repo, state);
  }

  @Get('pull-request-analytics/:owner/:repo')
  async getPullRequestAnalytics(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('state') state: 'open' | 'closed' | 'all' = 'all',
  ) {
    return this.githubAnalyticsService.getPullRequestAnalytics(
      owner,
      repo,
      state,
    );
  }

  @Get('language-stats/:owner/:repo')
  async getLanguageStats(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    return this.githubAnalyticsService.getLanguageStats(owner, repo);
  }

  @Get('dependency-analytics/:owner/:repo')
  async getDependencyAnalytics(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    return this.githubAnalyticsService.getDependencyAnalytics(owner, repo);
  }

  @Get('release-analytics/:owner/:repo')
  async getReleaseAnalytics(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    return this.githubAnalyticsService.getReleaseAnalytics(owner, repo);
  }

  @Get('security-alerts/:owner/:repo')
  async getSecurityAlerts(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    return this.githubAnalyticsService.getSecurityAlerts(owner, repo);
  }
}
