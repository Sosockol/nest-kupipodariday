import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @ApiProperty({
    description: 'Название подарка',
    example: 'iPhone 15 Pro',
    minLength: 1,
    maxLength: 250,
  })
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({
    description: 'Ссылка на подарок в магазине',
    example: 'https://store.apple.com/iphone-15-pro',
  })
  @IsUrl()
  link: string;

  @ApiProperty({
    description: 'Ссылка на изображение подарка',
    example: 'https://example.com/iphone.jpg',
  })
  @IsUrl()
  image: string;

  @ApiProperty({
    description: 'Стоимость подарка',
    example: 99999.99,
    minimum: 1,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @ApiPropertyOptional({
    description: 'Собранная сумма',
    example: 25000.0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  raised?: number;

  @ApiProperty({
    description: 'Описание подарка',
    example: 'Мечтаю о новом iPhone для работы и творчества',
    minLength: 1,
    maxLength: 1024,
  })
  @IsString()
  @Length(1, 1024)
  description: string;

  @ApiPropertyOptional({
    description: 'Количество копирований',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  copied?: number;
}
