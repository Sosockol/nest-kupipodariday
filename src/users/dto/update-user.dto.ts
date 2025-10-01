import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Новое имя пользователя',
    example: 'new_username',
    minLength: 2,
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @Length(2, 30)
  username?: string;

  @ApiPropertyOptional({
    description: 'Обновленная информация о пользователе',
    example: 'Теперь я увлекаюсь фотографией!',
    minLength: 2,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  about?: string;

  @ApiPropertyOptional({
    description: 'Новая ссылка на аватар',
    example: 'https://i.pravatar.cc/400',
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Новый email пользователя',
    example: 'newemail@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Новый пароль пользователя',
    example: 'newSecretPassword456',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
