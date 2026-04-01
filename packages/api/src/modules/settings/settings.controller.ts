import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Roles, CurrentUser } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Get all system settings' })
  async findAll() {
    return this.settingsService.findAll();
  }

  @Get(':key')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Get a setting by key' })
  @ApiParam({ name: 'key', description: 'Setting key', example: 'site.name' })
  async findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Put(':key')
  @Roles('super_admin')
  @ApiOperation({ summary: 'Create or update a setting (super_admin only)' })
  @ApiParam({ name: 'key', description: 'Setting key', example: 'site.name' })
  async upsert(
    @Param('key') key: string,
    @Body() dto: UpdateSettingDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.settingsService.upsert(key, dto, userId);
  }

  @Delete(':key')
  @Roles('super_admin')
  @ApiOperation({ summary: 'Delete a setting (super_admin only)' })
  @ApiParam({ name: 'key', description: 'Setting key', example: 'site.name' })
  async remove(@Param('key') key: string) {
    return this.settingsService.delete(key);
  }
}
