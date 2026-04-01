import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from './setting.entity';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectRepository(SystemSetting)
    private readonly settingRepo: Repository<SystemSetting>,
  ) {}

  async findAll(): Promise<SystemSetting[]> {
    return this.settingRepo.find({ order: { key: 'ASC' } });
  }

  async findByKey(key: string): Promise<SystemSetting> {
    const setting = await this.settingRepo.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    return setting;
  }

  async upsert(
    key: string,
    dto: UpdateSettingDto,
    userId: string,
  ): Promise<SystemSetting> {
    const existing = await this.settingRepo.findOne({ where: { key } });

    if (existing) {
      existing.value = dto.value;
      if (dto.description !== undefined) {
        existing.description = dto.description;
      }
      existing.updatedBy = userId;
      const saved = await this.settingRepo.save(existing);
      this.logger.log(`Setting "${key}" updated by user ${userId}`);
      return saved;
    }

    const setting = this.settingRepo.create({
      key,
      value: dto.value,
      description: dto.description ?? null,
      updatedBy: userId,
    });
    const saved = await this.settingRepo.save(setting);
    this.logger.log(`Setting "${key}" created by user ${userId}`);
    return saved;
  }

  async delete(key: string): Promise<{ message: string }> {
    const setting = await this.settingRepo.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    await this.settingRepo.remove(setting);
    this.logger.log(`Setting "${key}" deleted`);
    return { message: `Setting "${key}" deleted successfully` };
  }

  async getPublicSettings(): Promise<SystemSetting[]> {
    return this.settingRepo
      .createQueryBuilder('setting')
      .where('setting.key LIKE :prefix', { prefix: 'public.%' })
      .orderBy('setting.key', 'ASC')
      .getMany();
  }
}
