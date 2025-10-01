import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @ApiPropertyOptional({
    description: 'Обновленное название списка',
    example: 'Мой обновленный список на Новый год',
    minLength: 1,
    maxLength: 250,
  })
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name?: string;

  @ApiPropertyOptional({
    description: 'Обновленное описание списка',
    example: 'Подарки, которые я хочу получить на Новый год и день рождения',
    minLength: 0,
    maxLength: 1500,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Новая обложка списка',
    example: 'https://example.com/new-wishlist-cover.jpg',
  })
  @IsOptional()
  @IsUrl()
  image?: string;
}
