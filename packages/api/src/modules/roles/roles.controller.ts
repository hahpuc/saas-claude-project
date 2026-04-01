import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'List all roles with descriptions' })
  async listRoles() {
    return this.rolesService.getAllRoles();
  }

  @Get('permissions')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Get all available permission groups' })
  async getPermissionGroups() {
    return this.rolesService.getPermissionGroups();
  }

  @Get(':role/permissions')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Get permissions assigned to a role' })
  async getRolePermissions(@Param('role') role: string) {
    const permissions = await this.rolesService.getPermissionsForRole(role);
    return { role, permissions };
  }

  @Put(':role/permissions')
  @Roles('super_admin')
  @ApiOperation({ summary: 'Set permissions for a role (super_admin only)' })
  async setRolePermissions(
    @Param('role') role: string,
    @Body() dto: UpdateRolePermissionsDto,
  ) {
    const permissions = await this.rolesService.setPermissionsForRole(role, dto.permissions);
    return { role, permissions };
  }
}
