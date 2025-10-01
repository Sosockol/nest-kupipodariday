import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import type { CreateOfferDto } from './dto/create-offer.dto';
import type { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const { userId, itemId, ...offerData } = createOfferDto;

    // Находим пользователя и подарок
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const wish = await this.wishRepository.findOne({
      where: { id: itemId },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    // Проверяем, что пользователь не скидывается на свой же подарок
    if (wish.owner.id === userId) {
      throw new BadRequestException('Cannot contribute to your own wish');
    }

    const offer = this.offerRepository.create({
      ...offerData,
      user,
      item: wish,
      hidden: offerData.hidden || false,
    });

    const savedOffer = await this.offerRepository.save(offer);

    // Обновляем сумму сбора в подарке
    await this.wishRepository.increment(
      { id: itemId },
      'raised',
      createOfferDto.amount,
    );

    return savedOffer;
  }

  async findMany(query: FindManyOptions<Offer> = {}): Promise<Offer[]> {
    return await this.offerRepository.find({
      relations: ['user', 'item'],
      ...query,
    });
  }

  async findOne(query: FindOneOptions<Offer>): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      relations: ['user', 'item'],
      ...query,
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    return offer;
  }

  async updateOne(
    query: FindOneOptions<Offer>,
    updateOfferDto: UpdateOfferDto,
  ): Promise<Offer> {
    const offer = await this.findOne(query);
    Object.assign(offer, updateOfferDto);
    return await this.offerRepository.save(offer);
  }

  async removeOne(query: FindOneOptions<Offer>): Promise<Offer> {
    const offer = await this.findOne(query);

    // Уменьшаем сумму сбора в подарке
    await this.wishRepository.decrement(
      { id: offer.item.id },
      'raised',
      offer.amount,
    );

    return await this.offerRepository.remove(offer);
  }
}
