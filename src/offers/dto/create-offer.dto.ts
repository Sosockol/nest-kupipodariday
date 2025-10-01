import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({
    description: 'Сумма, которую готов скинуть пользователь',
    example: 1500.5,
    minimum: 1,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @ApiPropertyOptional({
    description: 'Скрыть ли информацию о том, кто скидывается',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hidden?: boolean;

  @ApiProperty({
    description: 'ID подарка, на который скидываемся',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  itemId: number;

  @ApiProperty({
    description: 'ID пользователя, который скидывается',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  userId: number;
}
