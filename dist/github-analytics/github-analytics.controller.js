"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const github_analytics_service_1 = require("./github-analytics.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let GithubAnalyticsController = class GithubAnalyticsController {
    githubAnalyticsService;
    constructor(githubAnalyticsService) {
        this.githubAnalyticsService = githubAnalyticsService;
    }
    async getRepositoryAnalytics(owner, repo) {
        return this.githubAnalyticsService.getRepositoryAnalytics(owner, repo);
    }
    async getContributorAnalytics(owner, repo) {
        return this.githubAnalyticsService.getContributorAnalytics(owner, repo);
    }
    async getCommitActivity(owner, repo, days = 30) {
        return this.githubAnalyticsService.getCommitActivity(owner, repo, days);
    }
    async getCodeFrequency(owner, repo) {
        return this.githubAnalyticsService.getCodeFrequency(owner, repo);
    }
    async getIssueAnalytics(owner, repo, state = 'all') {
        return this.githubAnalyticsService.getIssueAnalytics(owner, repo, state);
    }
    async getPullRequestAnalytics(owner, repo, state = 'all') {
        return this.githubAnalyticsService.getPullRequestAnalytics(owner, repo, state);
    }
    async getLanguageStats(owner, repo) {
        return this.githubAnalyticsService.getLanguageStats(owner, repo);
    }
    async getDependencyAnalytics(owner, repo) {
        return this.githubAnalyticsService.getDependencyAnalytics(owner, repo);
    }
    async getReleaseAnalytics(owner, repo) {
        return this.githubAnalyticsService.getReleaseAnalytics(owner, repo);
    }
    async getSecurityAlerts(owner, repo) {
        return this.githubAnalyticsService.getSecurityAlerts(owner, repo);
    }
};
exports.GithubAnalyticsController = GithubAnalyticsController;
__decorate([
    (0, common_1.Get)('repository/:owner/:repo'),
    __param(0, (0, common_1.Param)('owner')),
    __param(1, (0, common_1.Param)('repo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GithubAnalyticsController.prototype, "getRepositoryAnalytics", null);
__decorate([
    (0, common_1.Get)('contributors/:owner/:repo'),
    __param(0, (0, common_1.Param)('owner')),
    __param(1, (0, common_1.Param)('repo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GithubAnalyticsController.prototype, "getContributorAnalytics", null);
__decorate([
    (0, common_1.Get)('commit-activity/:owner/:repo'),
    __param(0, (0, common_1.Param)('owner')),
    __param(1, (0, common_1.Param)('repo')),
    __param(2, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], GithubAnalyticsController.prototype, "getCommitActivity", null);
__decorate([
    (0, common_1.Get)('code-frequency/:owner/:repo'),
    __param(0, (0, common_1.Param)('owner')),
    __param(1, (0, common_1.Param)('repo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GithubAnalyticsController.prototype, "getCodeFrequency", null);
__decorate([
    (0, common_1.Get)('issue-analytics/:owner/:repo'),
    __param(0, (0, common_1.Param)('owner')),
    __param(1, (0, common_1.Param)('repo')),
    __param(2, (0, common_1.Query)('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GithubAnalyticsController.prototype, "getIssueAnalytics", null);
__decorate([
    (0, common_1.Get)('pull-request-analytics/:owner/:repo'),
    __param(0, (0, common_1.Param)('owner')),
    __param(1, (0, common_1.Param)('repo')),
    __param(2, (0, common_1.Query)('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GithubAnalyticsController.prototype, "getPullRequestAnalytics", null);
__decorate([
    (0, common_1.Get)('language-stats/:owner/:repo'),
    __param(0, (0, common_1.Param)('owner')),
    __param(1, (0, common_1.Param)('repo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GithubAnalyticsController.prototype, "getLanguageStats", null);
__decorate([
    (0, common_1.Get)('dependency-analytics/:owner/:repo'),
    __param(0, (0, common_1.Param)('owner')),
    __param(1, (0, common_1.Param)('repo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GithubAnalyticsController.prototype, "getDependencyAnalytics", null);
__decorate([
    (0, common_1.Get)('release-analytics/:owner/:repo'),
    __param(0, (0, common_1.Param)('owner')),
    __param(1, (0, common_1.Param)('repo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GithubAnalyticsController.prototype, "getReleaseAnalytics", null);
__decorate([
    (0, common_1.Get)('security-alerts/:owner/:repo'),
    __param(0, (0, common_1.Param)('owner')),
    __param(1, (0, common_1.Param)('repo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GithubAnalyticsController.prototype, "getSecurityAlerts", null);
exports.GithubAnalyticsController = GithubAnalyticsController = __decorate([
    (0, common_1.Controller)('github-analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [github_analytics_service_1.GithubAnalyticsService])
], GithubAnalyticsController);
//# sourceMappingURL=github-analytics.controller.js.map