import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'john_doe',
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'mySecretPassword123',
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    description: 'Информация о пользователе',
    example: 'Люблю дарить подарки!',
    minLength: 2,
    maxLength: 200,
    default: 'Пока ничего не рассказал о себе',
  })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  about?: string;

  @ApiPropertyOptional({
    description: 'Ссылка на аватар',
    example: 'https://i.pravatar.cc/300',
    default: 'https://i.pravatar.cc/300',
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
