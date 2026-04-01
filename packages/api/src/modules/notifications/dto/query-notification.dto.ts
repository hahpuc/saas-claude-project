import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export enum ReadFilter {
  ALL = 'all',
  READ = 'read',
  UNREAD = 'unread',
}

export class QueryNotificationDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ReadFilter, default: ReadFilter.ALL })
  @IsOptional()
  @IsEnum(ReadFilter)
  readStatus?: ReadFilter;
}
