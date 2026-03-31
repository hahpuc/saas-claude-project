import type { Role } from '../enums/role.enum';
import type { UserStatus } from '../enums/user-status.enum';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: Role;
  status: UserStatus;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: Role;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: Role;
  status?: UserStatus;
  avatarUrl?: string;
}
