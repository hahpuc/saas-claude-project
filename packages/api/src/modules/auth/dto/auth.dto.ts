import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'StrongP@ss1' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'admin@saasproject.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin@123456' })
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
