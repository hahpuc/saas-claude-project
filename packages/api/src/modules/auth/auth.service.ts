import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserRole, UserStatus } from '../users/user.entity';
import { RefreshToken } from './refresh-token.entity';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
import { JwtPayload } from '../../common/interfaces';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return null;
    if (user.status !== UserStatus.ACTIVE) return null;
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    return isMatch ? user : null;
  }

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = this.userRepo.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });
    await this.userRepo.save(user);
    return this.generateTokens(user);
  }

  async login(user: User) {
    await this.userRepo.update(user.id, { lastLoginAt: new Date() });
    return this.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.refreshTokenRepo.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Revoke the old token (rotation)
    await this.refreshTokenRepo.update(stored.id, { revokedAt: new Date() });

    if (stored.user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    return this.generateTokens(stored.user);
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await this.refreshTokenRepo.update({ tokenHash }, { revokedAt: new Date() });
    } else {
      // Revoke all tokens for user
      await this.refreshTokenRepo
        .createQueryBuilder()
        .update()
        .set({ revokedAt: new Date() })
        .where('user_id = :userId AND revoked_at IS NULL', { userId })
        .execute();
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.userRepo.update(userId, { passwordHash });

    // Revoke all refresh tokens
    await this.refreshTokenRepo
      .createQueryBuilder()
      .update()
      .set({ revokedAt: new Date() })
      .where('user_id = :userId AND revoked_at IS NULL', { userId })
      .execute();
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const { passwordHash, ...result } = user;
    return result;
  }

  private async generateTokens(user: User) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign({ sub: payload.sub, email: payload.email, role: payload.role }, {
      secret: this.configService.get<string>('auth.jwtAccessSecret'),
      expiresIn: this.configService.get<string>('auth.jwtAccessExpiry') as any,
    });

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(refreshToken);

    const refreshExpiry = this.configService.get<string>('auth.jwtRefreshExpiry') || '7d';
    const days = parseInt(refreshExpiry) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    await this.refreshTokenRepo.save(
      this.refreshTokenRepo.create({
        userId: user.id,
        tokenHash,
        expiresAt,
      }),
    );

    const { passwordHash, ...userData } = user;

    return {
      accessToken,
      refreshToken,
      user: userData,
    };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
