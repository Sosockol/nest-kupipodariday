import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;

  @IsInt()
  @Min(1)
  itemId: number; // ID подарка, на который скидываемся

  @IsInt()
  @Min(1)
  userId: number; // ID пользователя, который скидывается
}
