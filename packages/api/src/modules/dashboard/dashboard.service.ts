import { Injectable } from '@nestjs/common';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { SortOrder } from '../../common/dto/pagination.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async getRecentActivity() {
    const query = {
      page: 1,
      limit: 10,
      sort: 'createdAt',
      order: SortOrder.DESC,
    };
    const result = await this.auditLogsService.findAll(query as any);
    return result.items;
  }
}
