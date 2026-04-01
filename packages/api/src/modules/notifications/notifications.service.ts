import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Notification } from './notification.entity';
import { QueryNotificationDto, ReadFilter } from './dto/query-notification.dto';

export interface CreateNotificationData {
  userId: string;
  type: string;
  title: string;
  content?: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async findAll(userId: string, query: QueryNotificationDto) {
    const qb = this.notificationRepo.createQueryBuilder('notification');
    qb.where('notification.user_id = :userId', { userId });

    if (query.readStatus === ReadFilter.READ) {
      qb.andWhere('notification.read_at IS NOT NULL');
    } else if (query.readStatus === ReadFilter.UNREAD) {
      qb.andWhere('notification.read_at IS NULL');
    }

    qb.orderBy('notification.created_at', 'DESC')
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

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepo.count({
      where: { userId, readAt: IsNull() },
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id, userId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    notification.readAt = new Date();
    return this.notificationRepo.save(notification);
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ readAt: new Date() })
      .where('user_id = :userId AND read_at IS NULL', { userId })
      .execute();
    return { message: 'All notifications marked as read' };
  }

  async remove(id: string, userId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id, userId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    await this.notificationRepo.remove(notification);
    return { message: 'Notification deleted' };
  }

  async create(data: CreateNotificationData): Promise<Notification> {
    const notification = this.notificationRepo.create({
      userId: data.userId,
      type: data.type,
      title: data.title,
      content: data.content ?? null,
      data: data.data ?? null,
    });
    const saved = await this.notificationRepo.save(notification);
    this.logger.log(`Notification created for user ${data.userId}: ${data.title}`);
    return saved;
  }
}
