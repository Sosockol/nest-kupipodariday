import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OffersService } from './offers.service';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать предложение скинуться на подарок' })
  @ApiBody({ type: CreateOfferDto })
  @ApiResponse({ status: 201, description: 'Предложение успешно создано' })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные или нельзя скидываться на свой подарок',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь или подарок не найден',
  })
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все предложения' })
  @ApiResponse({ status: 200, description: 'Список предложений' })
  findAll() {
    return this.offersService.findMany();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить предложение по ID' })
  @ApiParam({ name: 'id', description: 'ID предложения' })
  @ApiResponse({ status: 200, description: 'Предложение найдено' })
  @ApiResponse({ status: 404, description: 'Предложение не найдено' })
  findOne(@Param('id') id: string) {
    return this.offersService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить предложение' })
  @ApiParam({ name: 'id', description: 'ID предложения' })
  @ApiBody({ type: UpdateOfferDto })
  @ApiResponse({ status: 200, description: 'Предложение обновлено' })
  @ApiResponse({ status: 404, description: 'Предложение не найдено' })
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.updateOne({ where: { id: +id } }, updateOfferDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить предложение' })
  @ApiParam({ name: 'id', description: 'ID предложения' })
  @ApiResponse({ status: 200, description: 'Предложение удалено' })
  @ApiResponse({ status: 404, description: 'Предложение не найдено' })
  remove(@Param('id') id: string) {
    return this.offersService.removeOne({ where: { id: +id } });
  }
}
