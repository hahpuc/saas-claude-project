# Database & TypeORM Skill

## When to Use
Use this skill for:
- Database schema design
- TypeORM entity creation
- Migration management
- Query optimization
- Seeding data

## Entity Relationships

### One-to-Many / Many-to-One
```typescript
// user.entity.ts
@Entity('users')
export class User {
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

// order.entity.ts
@Entity('orders')
export class Order {
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;
}
```

### Many-to-Many
```typescript
@Entity('users')
export class User {
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];
}
```

## Migration Commands
```bash
# Generate migration from entity changes
cd packages/api
npm run migration:generate -- src/database/migrations/MigrationName

# Create empty migration
npm run migration:create -- src/database/migrations/MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Query Optimization
- Always use `.select()` to pick only needed columns
- Use `.leftJoinAndSelect()` sparingly (avoid loading unnecessary relations)
- Add `@Index()` on columns used in WHERE, ORDER BY, JOIN
- Use `createQueryBuilder` for complex queries instead of `.find()` with deep relations
- Paginate ALL list endpoints (never return unbounded results)

## Seeding
```typescript
// database/seeds/user.seed.ts
export async function seedUsers(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const existingCount = await userRepo.count();
  if (existingCount > 0) return; // Skip if already seeded

  const users = [
    { email: 'admin@example.com', role: Role.SUPER_ADMIN, ... },
  ];
  await userRepo.save(users.map(u => userRepo.create(u)));
}
```
