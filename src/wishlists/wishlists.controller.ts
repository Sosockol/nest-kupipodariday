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
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@ApiTags('wishlists')
@Controller('wishlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый список желаний' })
  @ApiBody({ type: CreateWishlistDto })
  @ApiResponse({ status: 201, description: 'Список желаний успешно создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  async create(@Body() createWishlistDto: CreateWishlistDto) {
    // TODO: Заменить на реального пользователя из JWT токена
    const mockUser = await this.usersService.findOne({ where: { id: 1 } });
    return this.wishlistsService.create(createWishlistDto, mockUser);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все списки желаний' })
  @ApiResponse({ status: 200, description: 'Список всех списков желаний' })
  findAll() {
    return this.wishlistsService.findMany();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить список желаний по ID' })
  @ApiParam({ name: 'id', description: 'ID списка желаний' })
  @ApiResponse({ status: 200, description: 'Список желаний найден' })
  @ApiResponse({ status: 404, description: 'Список желаний не найден' })
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить список желаний' })
  @ApiParam({ name: 'id', description: 'ID списка желаний' })
  @ApiBody({ type: UpdateWishlistDto })
  @ApiResponse({ status: 200, description: 'Список желаний обновлен' })
  @ApiResponse({ status: 404, description: 'Список желаний не найден' })
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateOne(
      { where: { id: +id } },
      updateWishlistDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить список желаний' })
  @ApiParam({ name: 'id', description: 'ID списка желаний' })
  @ApiResponse({ status: 200, description: 'Список желаний удален' })
  @ApiResponse({ status: 404, description: 'Список желаний не найден' })
  remove(@Param('id') id: string) {
    return this.wishlistsService.removeOne({ where: { id: +id } });
  }
}
