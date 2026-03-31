import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { UsersService } from '../users/users.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles('admin', 'super_admin')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly usersService: UsersService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStats() {
    return this.usersService.getDashboardStats();
  }
}
