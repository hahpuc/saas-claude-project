import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({
    description: 'Setting value (any JSON-compatible value)',
    example: 'My SaaS App',
  })
  @IsNotEmpty()
  value: any;

  @ApiPropertyOptional({
    description: 'Human-readable description of this setting',
    example: 'The display name of the application',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
