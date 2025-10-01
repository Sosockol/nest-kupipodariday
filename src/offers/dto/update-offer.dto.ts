import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { CreateOfferDto } from './create-offer.dto';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  @ApiPropertyOptional({
    description: 'Обновленная сумма взноса',
    example: 2000.0,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount?: number;

  @ApiPropertyOptional({
    description: 'Изменить видимость взноса',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
}
