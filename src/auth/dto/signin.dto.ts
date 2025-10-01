import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Имя пользователя или email',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'mySecretPassword123',
  })
  @IsString()
  password: string;
}
