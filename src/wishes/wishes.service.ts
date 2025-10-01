import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import type { User } from '../users/entities/user.entity';
import type { CreateWishDto } from './dto/create-wish.dto';
import type { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    const wish = this.wishRepository.create({
      ...createWishDto,
      owner,
      raised: createWishDto.raised || 0,
      copied: createWishDto.copied || 0,
    });
    return await this.wishRepository.save(wish);
  }

  async findMany(query: FindManyOptions<Wish> = {}): Promise<Wish[]> {
    return await this.wishRepository.find({
      relations: ['owner', 'offers', 'wishlists'],
      ...query,
    });
  }

  async findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      relations: ['owner', 'offers', 'wishlists'],
      ...query,
    });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    return wish;
  }

  async updateOne(
    query: FindOneOptions<Wish>,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.findOne(query);
    Object.assign(wish, updateWishDto);
    return await this.wishRepository.save(wish);
  }

  async removeOne(query: FindOneOptions<Wish>): Promise<Wish> {
    const wish = await this.findOne(query);
    return await this.wishRepository.remove(wish);
  }

  async copyWish(wishId: number): Promise<void> {
    await this.wishRepository.increment({ id: wishId }, 'copied', 1);
  }
}
