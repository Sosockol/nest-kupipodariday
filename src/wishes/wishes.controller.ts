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
import { UsersService } from '../users/users.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать новое желание' })
  @ApiBody({ type: CreateWishDto })
  @ApiResponse({ status: 201, description: 'Желание успешно создано' })
  async create(@Body() createWishDto: CreateWishDto) {
    // TODO: Заменить на реального пользователя из JWT токена
    const mockUser = await this.usersService.findOne({ where: { id: 1 } });
    return this.wishesService.create(createWishDto, mockUser);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все желания' })
  @ApiResponse({ status: 200, description: 'Список желаний' })
  findAll() {
    return this.wishesService.findMany();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить желание по ID' })
  @ApiParam({ name: 'id', description: 'ID желания' })
  @ApiResponse({ status: 200, description: 'Желание найдено' })
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить желание' })
  @ApiParam({ name: 'id', description: 'ID желания' })
  @ApiBody({ type: UpdateWishDto })
  @ApiResponse({ status: 200, description: 'Желание обновлено' })
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.updateOne({ where: { id: +id } }, updateWishDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить желание' })
  @ApiParam({ name: 'id', description: 'ID желания' })
  @ApiResponse({ status: 200, description: 'Желание удалено' })
  remove(@Param('id') id: string) {
    return this.wishesService.removeOne({ where: { id: +id } });
  }
}
