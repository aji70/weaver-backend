import { ConfigService } from '@nestjs/config';
export declare class GithubAnalyticsService {
    private configService;
    private octokit;
    constructor(configService: ConfigService);
    getRepositoryAnalytics(owner: string, repo: string): Promise<{
        basicInfo: {
            name: any;
            description: any;
            stars: any;
            forks: any;
            watchers: any;
            openIssues: any;
            language: any;
            createdAt: any;
            updatedAt: any;
        };
        traffic: {
            views: any;
            uniqueVisitors: any;
        };
        clones: {
            total: any;
            uniqueCloners: any;
        };
    }>;
    getContributorAnalytics(owner: string, repo: string): Promise<{
        totalContributors: any;
        contributors: any;
        commitActivity: any;
    }>;
    getCommitActivity(owner: string, repo: string, days?: number): Promise<{
        totalCommits: any;
        dailyCommits: any;
        authors: any;
    }>;
    getCodeFrequency(owner: string, repo: string): Promise<{
        weeklyChanges: any;
    }>;
    getIssueAnalytics(owner: string, repo: string, state?: 'open' | 'closed' | 'all'): Promise<{
        total: any;
        open: any;
        closed: any;
        withLabels: any;
        averageTimeToClose: number;
        issuesByLabel: {};
    }>;
    getPullRequestAnalytics(owner: string, repo: string, state?: 'open' | 'closed' | 'all'): Promise<{
        total: any;
        open: any;
        closed: any;
        merged: any;
        averageTimeToMerge: number;
        averageTimeToClose: number;
        prsByLabel: {};
    }>;
    getLanguageStats(owner: string, repo: string): Promise<{
        languages: {
            language: string;
            bytes: unknown;
            percentage: number;
        }[];
        totalBytes: unknown;
    }>;
    getDependencyAnalytics(owner: string, repo: string): Promise<{
        dependencies: {
            total: any;
            manifests: any;
        };
        dependents: {
            total: any;
            repositories: any;
        };
    }>;
    getReleaseAnalytics(owner: string, repo: string): Promise<{
        totalReleases: any;
        latestRelease: {
            tag: any;
            name: any;
            publishedAt: any;
            downloads: any;
        } | null;
        releases: any;
    }>;
    getSecurityAlerts(owner: string, repo: string): Promise<{
        totalAlerts: any;
        alerts: any;
    }>;
}
