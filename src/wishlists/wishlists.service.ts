import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import type { User } from '../users/entities/user.entity';
import type { CreateWishlistDto } from './dto/create-wishlist.dto';
import type { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    owner: User,
  ): Promise<Wishlist> {
    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner,
    });
    return await this.wishlistRepository.save(wishlist);
  }

  async findMany(query: FindManyOptions<Wishlist> = {}): Promise<Wishlist[]> {
    return await this.wishlistRepository.find({
      relations: ['owner', 'items'],
      ...query,
    });
  }

  async findOne(query: FindOneOptions<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      relations: ['owner', 'items'],
      ...query,
    });
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  async updateOne(
    query: FindOneOptions<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(query);
    Object.assign(wishlist, updateWishlistDto);
    return await this.wishlistRepository.save(wishlist);
  }

  async removeOne(query: FindOneOptions<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.findOne(query);
    return await this.wishlistRepository.remove(wishlist);
  }
}
