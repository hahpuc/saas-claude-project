import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(query: QueryUserDto) {
    const qb = this.userRepo.createQueryBuilder('user');

    if (query.search) {
      qb.where('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    if (query.role) {
      qb.andWhere('user.role = :role', { role: query.role });
    }

    if (query.status) {
      qb.andWhere('user.status = :status', { status: query.status });
    }

    const allowedSorts = ['createdAt', 'name', 'email', 'role', 'status'];
    const sortField = allowedSorts.includes(query.sort) ? query.sort : 'createdAt';

    qb.orderBy(`user.${sortField}`, query.order)
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.avatarUrl',
        'user.role',
        'user.status',
        'user.emailVerifiedAt',
        'user.lastLoginAt',
        'user.createdAt',
        'user.updatedAt',
      ]);

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
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const { passwordHash, ...result } = user;
    return result;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = this.userRepo.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      role: dto.role || UserRole.USER,
      status: UserStatus.ACTIVE,
    });
    const saved = await this.userRepo.save(user);
    const { passwordHash: _, ...result } = saved;
    return result;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepo.findOne({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Email already exists');
    }

    Object.assign(user, dto);
    const saved = await this.userRepo.save(user);
    const { passwordHash, ...result } = saved;
    return result;
  }

  async remove(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    await this.userRepo.softRemove(user);
    return { message: 'User deleted successfully' };
  }

  async changeStatus(id: string, dto: ChangeStatusDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    user.status = dto.status;
    const saved = await this.userRepo.save(user);
    const { passwordHash, ...result } = saved;
    return result;
  }

  async getDashboardStats() {
    const total = await this.userRepo.count();
    const active = await this.userRepo.count({ where: { status: UserStatus.ACTIVE } });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = await this.userRepo
      .createQueryBuilder('user')
      .where('user.created_at >= :startOfMonth', { startOfMonth })
      .getCount();

    return { totalUsers: total, activeUsers: active, newUsersThisMonth: newThisMonth };
  }
}
