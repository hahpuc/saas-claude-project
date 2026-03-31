import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'saas_project',
  });

  await dataSource.initialize();

  const existing = await dataSource.query(
    `SELECT id FROM users WHERE email = $1`,
    ['admin@saasproject.com'],
  );

  if (existing.length === 0) {
    const passwordHash = await bcrypt.hash('Admin@123456', 12);
    await dataSource.query(
      `INSERT INTO users (email, password_hash, name, role, status)
       VALUES ($1, $2, $3, $4, $5)`,
      ['admin@saasproject.com', passwordHash, 'Super Admin', 'super_admin', 'active'],
    );
    console.log('✅ Seeded super_admin user: admin@saasproject.com / Admin@123456');
  } else {
    console.log('ℹ️  Super admin already exists, skipping seed');
  }

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
