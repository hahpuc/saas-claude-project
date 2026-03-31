import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1711900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('super_admin', 'admin', 'manager', 'user')
    `);

    await queryRunner.query(`
      CREATE TYPE "user_status_enum" AS ENUM ('active', 'inactive', 'suspended', 'pending')
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "password_hash" VARCHAR(255) NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "avatar_url" VARCHAR(500),
        "role" "user_role_enum" NOT NULL DEFAULT 'user',
        "status" "user_status_enum" NOT NULL DEFAULT 'active',
        "email_verified_at" TIMESTAMP,
        "last_login_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_users_role" ON "users" ("role")`);
    await queryRunner.query(`CREATE INDEX "IDX_users_status" ON "users" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_users_deleted_at" ON "users" ("deleted_at")`);

    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
        "user_id" UUID NOT NULL,
        "token_hash" VARCHAR(255) NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "revoked_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_refresh_tokens_token_hash" UNIQUE ("token_hash"),
        CONSTRAINT "FK_refresh_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_refresh_tokens_user_id" ON "refresh_tokens" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_refresh_tokens_expires_at" ON "refresh_tokens" ("expires_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "user_status_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}
