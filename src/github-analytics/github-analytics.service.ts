import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';
import { addDays, subDays, format } from 'date-fns';

@Injectable()
export class GithubAnalyticsService {
  private octokit: Octokit;

  constructor(private configService: ConfigService) {
    this.octokit = new Octokit({
      auth: this.configService.get<string>('GITHUB_TOKEN'),
    });
  }

  async getRepositoryAnalytics(owner: string, repo: string) {
    try {
      const [repoData, trafficData, cloneData] = await Promise.all([
        this.octokit.repos.get({ owner, repo }),
        this.octokit.repos.getTrafficViews({ owner, repo }),
        this.octokit.repos.getClones({ owner, repo }),
      ]);

      return {
        basicInfo: {
          name: repoData.data.name,
          description: repoData.data.description,
          stars: repoData.data.stargazers_count,
          forks: repoData.data.forks_count,
          watchers: repoData.data.watchers_count,
          openIssues: repoData.data.open_issues_count,
          language: repoData.data.language,
          createdAt: repoData.data.created_at,
          updatedAt: repoData.data.updated_at,
        },
        traffic: {
          views: trafficData.data.views,
          uniqueVisitors: trafficData.data.uniques,
        },
        clones: {
          total: cloneData.data.clones,
          uniqueCloners: cloneData.data.uniques,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch repository analytics: ${error.message}`);
    }
  }

  async getContributorAnalytics(owner: string, repo: string) {
    try {
      const [contributors, commits] = await Promise.all([
        this.octokit.repos.getContributors({ owner, repo }),
        this.octokit.repos.getCommitActivityStats({ owner, repo }),
      ]);

      const contributorStats = await Promise.all(
        contributors.data.map(async (contributor) => {
          const userData = await this.octokit.users.getByUsername({
            username: contributor.login,
          });
          return {
            username: contributor.login,
            contributions: contributor.contributions,
            avatar: userData.data.avatar_url,
            profile: userData.data.html_url,
            location: userData.data.location,
            company: userData.data.company,
          };
        }),
      );

      return {
        totalContributors: contributors.data.length,
        contributors: contributorStats,
        commitActivity: commits.data,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch contributor analytics: ${error.message}`,
      );
    }
  }

  async getCommitActivity(owner: string, repo: string, days: number = 30) {
    try {
      const since = format(
        subDays(new Date(), days),
        "yyyy-MM-dd'T'HH:mm:ss'Z'",
      );
      const commits = await this.octokit.repos.listCommits({
        owner,
        repo,
        since,
      });

      const commitStats = commits.data.reduce((acc, commit) => {
        const date = format(new Date(commit.commit.author.date), 'yyyy-MM-dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return {
        totalCommits: commits.data.length,
        dailyCommits: commitStats,
        authors: commits.data.map((commit) => ({
          author: commit.commit.author.name,
          email: commit.commit.author.email,
          commits: 1,
        })),
      };
    } catch (error) {
      throw new Error(`Failed to fetch commit activity: ${error.message}`);
    }
  }

  async getCodeFrequency(owner: string, repo: string) {
    try {
      const frequency = await this.octokit.repos.getCodeFrequencyStats({
        owner,
        repo,
      });

      return {
        weeklyChanges: frequency.data.map((week) => ({
          timestamp: new Date(week[0] * 1000),
          additions: week[1],
          deletions: week[2],
        })),
      };
    } catch (error) {
      throw new Error(`Failed to fetch code frequency: ${error.message}`);
    }
  }

  async getIssueAnalytics(
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'all' = 'all',
  ) {
    try {
      const issues = await this.octokit.issues.listForRepo({
        owner,
        repo,
        state,
        per_page: 100,
      });

      const issueStats = {
        total: issues.data.length,
        open: issues.data.filter((issue) => issue.state === 'open').length,
        closed: issues.data.filter((issue) => issue.state === 'closed').length,
        withLabels: issues.data.filter((issue) => issue.labels.length > 0)
          .length,
        averageTimeToClose: 0,
        issuesByLabel: {},
      };

      // Calculate average time to close
      const closedIssues = issues.data.filter(
        (issue) => issue.state === 'closed',
      );
      if (closedIssues.length > 0) {
        const totalTime = closedIssues.reduce((acc, issue) => {
          const createdAt = new Date(issue.created_at);
          const closedAt = new Date(issue.closed_at);
          return acc + (closedAt.getTime() - createdAt.getTime());
        }, 0);
        issueStats.averageTimeToClose = totalTime / closedIssues.length;
      }

      // Count issues by label
      issues.data.forEach((issue) => {
        issue.labels.forEach((label) => {
          issueStats.issuesByLabel[label.name] =
            (issueStats.issuesByLabel[label.name] || 0) + 1;
        });
      });

      return issueStats;
    } catch (error) {
      throw new Error(`Failed to fetch issue analytics: ${error.message}`);
    }
  }

  async getPullRequestAnalytics(
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'all' = 'all',
  ) {
    try {
      const pulls = await this.octokit.pulls.list({
        owner,
        repo,
        state,
        per_page: 100,
      });

      const prStats = {
        total: pulls.data.length,
        open: pulls.data.filter((pr) => pr.state === 'open').length,
        closed: pulls.data.filter((pr) => pr.state === 'closed').length,
        merged: pulls.data.filter((pr) => pr.merged_at).length,
        averageTimeToMerge: 0,
        averageTimeToClose: 0,
        prsByLabel: {},
      };

      // Calculate average times
      const mergedPRs = pulls.data.filter((pr) => pr.merged_at);
      const closedPRs = pulls.data.filter((pr) => pr.state === 'closed');

      if (mergedPRs.length > 0) {
        const totalMergeTime = mergedPRs.reduce((acc, pr) => {
          const createdAt = new Date(pr.created_at);
          const mergedAt = new Date(pr.merged_at);
          return acc + (mergedAt.getTime() - createdAt.getTime());
        }, 0);
        prStats.averageTimeToMerge = totalMergeTime / mergedPRs.length;
      }

      if (closedPRs.length > 0) {
        const totalCloseTime = closedPRs.reduce((acc, pr) => {
          const createdAt = new Date(pr.created_at);
          const closedAt = new Date(pr.closed_at);
          return acc + (closedAt.getTime() - createdAt.getTime());
        }, 0);
        prStats.averageTimeToClose = totalCloseTime / closedPRs.length;
      }

      // Count PRs by label
      pulls.data.forEach((pr) => {
        pr.labels.forEach((label) => {
          prStats.prsByLabel[label.name] =
            (prStats.prsByLabel[label.name] || 0) + 1;
        });
      });

      return prStats;
    } catch (error) {
      throw new Error(
        `Failed to fetch pull request analytics: ${error.message}`,
      );
    }
  }

  async getLanguageStats(owner: string, repo: string) {
    try {
      const languages = await this.octokit.repos.listLanguages({ owner, repo });
      const totalBytes = Object.values(languages.data).reduce(
        (a, b) => a + b,
        0,
      );

      return {
        languages: Object.entries(languages.data).map(([language, bytes]) => ({
          language,
          bytes,
          percentage: (bytes / totalBytes) * 100,
        })),
        totalBytes,
      };
    } catch (error) {
      throw new Error(`Failed to fetch language stats: ${error.message}`);
    }
  }

  async getDependencyAnalytics(owner: string, repo: string) {
    try {
      const [dependencies, dependents] = await Promise.all([
        this.octokit.repos.getDependencyGraphManifests({ owner, repo }),
        this.octokit.repos.listDependents({ owner, repo }),
      ]);

      return {
        dependencies: {
          total: dependencies.data.length,
          manifests: dependencies.data.map((manifest) => ({
            path: manifest.path,
            dependencies: manifest.dependencies,
          })),
        },
        dependents: {
          total: dependents.data.length,
          repositories: dependents.data.map((repo) => ({
            name: repo.name,
            fullName: repo.full_name,
            stars: repo.stargazers_count,
          })),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch dependency analytics: ${error.message}`);
    }
  }

  async getReleaseAnalytics(owner: string, repo: string) {
    try {
      const releases = await this.octokit.repos.listReleases({ owner, repo });

      return {
        totalReleases: releases.data.length,
        latestRelease: releases.data[0]
          ? {
              tag: releases.data[0].tag_name,
              name: releases.data[0].name,
              publishedAt: releases.data[0].published_at,
              downloads: releases.data[0].assets.reduce(
                (acc, asset) => acc + asset.download_count,
                0,
              ),
            }
          : null,
        releases: releases.data.map((release) => ({
          tag: release.tag_name,
          name: release.name,
          publishedAt: release.published_at,
          downloads: release.assets.reduce(
            (acc, asset) => acc + asset.download_count,
            0,
          ),
          assets: release.assets.map((asset) => ({
            name: asset.name,
            downloads: asset.download_count,
            size: asset.size,
          })),
        })),
      };
    } catch (error) {
      throw new Error(`Failed to fetch release analytics: ${error.message}`);
    }
  }

  async getSecurityAlerts(owner: string, repo: string) {
    try {
      const alerts =
        await this.octokit.securityAdvisories.listRepositoryAdvisories({
          owner,
          repo,
        });

      return {
        totalAlerts: alerts.data.length,
        alerts: alerts.data.map((alert) => ({
          summary: alert.summary,
          severity: alert.severity,
          publishedAt: alert.published_at,
          updatedAt: alert.updated_at,
          cvss: alert.cvss,
          cwe: alert.cwe,
          affectedPackages: alert.affected_packages,
        })),
      };
    } catch (error) {
      throw new Error(`Failed to fetch security alerts: ${error.message}`);
    }
  }
}
