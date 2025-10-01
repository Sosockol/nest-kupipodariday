import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@ApiTags('wishes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новое желание' })
  @ApiBody({ type: CreateWishDto })
  @ApiResponse({ status: 201, description: 'Желание успешно создано' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async create(
    @Body() createWishDto: CreateWishDto,
    @CurrentUser() user: User,
  ) {
    return this.wishesService.create(createWishDto, user);
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
