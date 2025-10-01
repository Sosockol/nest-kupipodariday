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
import type { CreateWishlistDto } from './dto/create-wishlist.dto';
import type { UpdateWishlistDto } from './dto/update-wishlist.dto';
import type { WishlistsService } from './wishlists.service';

@Controller('wishlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() createWishlistDto: CreateWishlistDto) {
    // TODO: Заменить на реального пользователя из JWT токена
    const mockUser = await this.usersService.findOne({ where: { id: 1 } });
    return this.wishlistsService.create(createWishlistDto, mockUser);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
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
  remove(@Param('id') id: string) {
    return this.wishlistsService.removeOne({ where: { id: +id } });
  }
}
