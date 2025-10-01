import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({
    description: 'Название списка желаний',
    example: 'Мой список на день рождения',
    minLength: 1,
    maxLength: 250,
  })
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiPropertyOptional({
    description: 'Описание списка желаний',
    example: 'Подарки, которые я хочу получить на свой день рождения',
    minLength: 0,
    maxLength: 1500,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1500)
  description?: string;

  @ApiProperty({
    description: 'Ссылка на обложку списка',
    example: 'https://example.com/wishlist-cover.jpg',
  })
  @IsUrl()
  image: string;
}
