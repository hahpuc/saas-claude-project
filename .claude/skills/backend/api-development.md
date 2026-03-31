# Backend API Development Skill

## When to Use
Use this skill when working on any backend/API related tasks:
- Creating new modules, services, controllers
- Database schema changes and migrations
- Authentication and authorization
- API endpoint design and implementation
- Background jobs and queue processing

## NestJS Architecture

### Module Registration
```typescript
// app.module.ts — Always register new modules here
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // NEVER true in production
      }),
    }),
    // Register modules here
    AuthModule,
    UsersModule,
    // ... new modules
  ],
})
export class AppModule {}
```

### Standard Response Envelope
```typescript
// common/interceptors/response.interceptor.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Pagination
```typescript
// common/dto/pagination.dto.ts
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsString()
  sort: string = 'createdAt';

  @IsOptional()
  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.DESC;
}
```

### Error Handling Pattern
```typescript
// In services, throw NestJS exceptions:
if (!user) {
  throw new NotFoundException(`User with id ${id} not found`);
}

// For domain errors, create custom exceptions:
// common/exceptions/business.exception.ts
export class InsufficientCreditsException extends HttpException {
  constructor() {
    super('Insufficient credits for this operation', HttpStatus.PAYMENT_REQUIRED);
  }
}
```

## Database Patterns

### Entity Template
```typescript
@Entity('table_name')
export class EntityName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ... fields

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
```

### Repository Usage
```typescript
// Always use repository pattern via TypeORM
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(query: QueryUserDto): Promise<[User[], number]> {
    const qb = this.userRepo.createQueryBuilder('user');
    // Build query with filters
    if (query.search) {
      qb.where('user.name ILIKE :search', { search: `%${query.search}%` });
    }
    qb.skip((query.page - 1) * query.limit)
      .take(query.limit)
      .orderBy(`user.${query.sort}`, query.order);
    return qb.getManyAndCount();
  }
}
```

## Key Directories
- `src/modules/` — Feature modules
- `src/common/` — Shared utilities (guards, interceptors, decorators, pipes, filters)
- `src/config/` — Configuration files
- `src/database/` — Migrations and seeds
