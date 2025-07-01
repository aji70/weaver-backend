import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
  Post as PostMethod,
} from '@nestjs/common';
import { WalletCohortAnalysisService } from './wallet-cohort-analysis.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { QueryCohortDto } from './dto/query-cohort.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('wallet-cohorts')
export class WalletCohortAnalysisController {
  constructor(private readonly service: WalletCohortAnalysisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCohortDto) {
    return this.service.createCohort(dto);
  }

  @Get()
  async list() {
    return this.service.listCohorts();
  }

  @Get('query')
  async query(@Query() query: QueryCohortDto) {
    return this.service.queryCohorts(query);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.getCohortById(id);
  }

  @Get(':id/export')
  async export(@Param('id') id: string) {
    const members = await this.service.exportCohortMembers(id);
    return { members };
  }

  @Patch(':id/recalculate')
  async recalculate(@Param('id') id: string) {
    return this.service.recalculateCohortMembers(id);
  }

  @PostMethod('recalculate-all')
  async recalculateAll() {
    await this.service.recalculateAllCohorts();
    return { message: 'All cohorts recalculated' };
  }

  @Get(':id/trends')
  async getTrends(@Param('id') id: string) {
    return this.service.getCohortTrends(id);
  }

  @Get(':id/retention')
  async getRetention(@Param('id') id: string) {
    return this.service.getCohortRetention(id);
  }

  @Get(':id/members')
  @Roles('admin', 'moderator')
  async getMembers(@Param('id') id: string) {
    return this.service.getCohortMembers(id);
  }
}
