import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { UsersService } from '../users/users.service';
import type { CreateWishDto } from './dto/create-wish.dto';
import type { UpdateWishDto } from './dto/update-wish.dto';
import type { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() createWishDto: CreateWishDto) {
    // TODO: Заменить на реального пользователя из JWT токена
    const mockUser = await this.usersService.findOne({ where: { id: 1 } });
    return this.wishesService.create(createWishDto, mockUser);
  }

  @Get()
  findAll() {
    return this.wishesService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.updateOne({ where: { id: +id } }, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishesService.removeOne({ where: { id: +id } });
  }
}
