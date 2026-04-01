import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

export interface CreateAuditLogData {
  userId?: string;
  organizationId?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  async findAll(query: QueryAuditLogDto) {
    const qb = this.auditLogRepo.createQueryBuilder('audit_log');

    if (query.search) {
      qb.where('audit_log.action ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query.entityType) {
      qb.andWhere('audit_log.entity_type = :entityType', {
        entityType: query.entityType,
      });
    }

    if (query.userId) {
      qb.andWhere('audit_log.user_id = :userId', {
        userId: query.userId,
      });
    }

    if (query.startDate) {
      qb.andWhere('audit_log.created_at >= :startDate', {
        startDate: query.startDate,
      });
    }

    if (query.endDate) {
      qb.andWhere('audit_log.created_at <= :endDate', {
        endDate: query.endDate,
      });
    }

    const allowedSorts = ['createdAt', 'action', 'entityType'];
    const sortField = allowedSorts.includes(query.sort)
      ? query.sort
      : 'createdAt';

    qb.orderBy(`audit_log.${sortField}`, query.order)
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findById(id: string) {
    const auditLog = await this.auditLogRepo.findOne({ where: { id } });
    if (!auditLog) {
      throw new NotFoundException(`Audit log with id ${id} not found`);
    }
    return auditLog;
  }

  async create(data: CreateAuditLogData): Promise<AuditLog> {
    const auditLog = this.auditLogRepo.create({
      userId: data.userId ?? null,
      organizationId: data.organizationId ?? null,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      oldValues: data.oldValues ?? null,
      newValues: data.newValues ?? null,
      ipAddress: data.ipAddress ?? null,
      userAgent: data.userAgent ?? null,
    });

    const saved = await this.auditLogRepo.save(auditLog);
    this.logger.log(
      `Audit log created: ${data.action} on ${data.entityType}/${data.entityId}`,
    );
    return saved;
  }
}
