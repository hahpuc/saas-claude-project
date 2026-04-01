import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from './permission.entity';
import {
  ALL_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  PERMISSION_GROUPS,
} from './permissions.constants';
import { UserRole } from '../users/user.entity';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(RolePermission)
    private readonly permissionRepo: Repository<RolePermission>,
  ) {}

  getAllRoles() {
    return Object.values(UserRole).map((role) => ({
      role,
      description: this.getRoleDescription(role),
    }));
  }

  getPermissionGroups() {
    return PERMISSION_GROUPS;
  }

  async getPermissionsForRole(role: string): Promise<string[]> {
    const records = await this.permissionRepo.find({ where: { role } });

    // If no custom permissions in DB, return defaults
    if (records.length === 0) {
      return DEFAULT_ROLE_PERMISSIONS[role] || [];
    }

    return records.map((r) => r.permission);
  }

  async setPermissionsForRole(role: string, permissions: string[]): Promise<string[]> {
    // Validate all permissions are known
    const invalid = permissions.filter((p) => !ALL_PERMISSIONS.includes(p as any));
    if (invalid.length > 0) {
      throw new BadRequestException(`Unknown permissions: ${invalid.join(', ')}`);
    }

    // Cannot modify super_admin permissions
    if (role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('Cannot modify super_admin permissions');
    }

    // Remove existing permissions for this role
    await this.permissionRepo.delete({ role });

    // Insert new ones
    const entities = permissions.map((permission) =>
      this.permissionRepo.create({ role, permission }),
    );
    await this.permissionRepo.save(entities);

    this.logger.log(`Permissions updated for role ${role}: ${permissions.length} permissions`);
    return permissions;
  }

  async hasPermission(role: string, permission: string): Promise<boolean> {
    const permissions = await this.getPermissionsForRole(role);
    return permissions.includes(permission);
  }

  private getRoleDescription(role: string): string {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Full system access. Cannot be restricted.';
      case UserRole.ADMIN:
        return 'Administrative access to manage users and system settings.';
      case UserRole.MANAGER:
        return 'Can view users and manage content.';
      case UserRole.USER:
        return 'Basic access to dashboard and notifications.';
      default:
        return '';
    }
  }
}
