import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @ApiPropertyOptional({
    description: 'Обновленное название подарка',
    example: 'iPhone 15 Pro Max',
    minLength: 1,
    maxLength: 250,
  })
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name?: string;

  @ApiPropertyOptional({
    description: 'Новая ссылка на подарок',
    example: 'https://store.apple.com/iphone-15-pro-max',
  })
  @IsOptional()
  @IsUrl()
  link?: string;

  @ApiPropertyOptional({
    description: 'Новое изображение подарка',
    example: 'https://example.com/new-iphone.jpg',
  })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({
    description: 'Обновленная стоимость',
    example: 119999.99,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price?: number;

  @ApiPropertyOptional({
    description: 'Обновленное описание',
    example: 'Теперь хочу именно Pro Max версию!',
    minLength: 1,
    maxLength: 1024,
  })
  @IsOptional()
  @IsString()
  @Length(1, 1024)
  description?: string;
}
