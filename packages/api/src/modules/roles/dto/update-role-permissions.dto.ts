import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class UpdateRolePermissionsDto {
  @ApiProperty({
    description: 'List of permission keys to assign to the role',
    example: ['users.view', 'users.create', 'dashboard.view'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissions: string[];
}
