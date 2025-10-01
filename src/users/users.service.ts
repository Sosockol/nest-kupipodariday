import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findMany(query: FindManyOptions<User> = {}): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['wishes', 'offers', 'wishlists'],
      ...query,
    });
  }

  async findOne(query: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: ['wishes', 'offers', 'wishlists'],
      ...query,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateOne(
    query: FindOneOptions<User>,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOne(query);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async removeOne(query: FindOneOptions<User>): Promise<User> {
    const user = await this.findOne(query);
    return await this.userRepository.remove(user);
  }
}
