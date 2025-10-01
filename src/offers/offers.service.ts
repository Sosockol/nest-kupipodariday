import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import type { CreateOfferDto } from './dto/create-offer.dto';
import type { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = this.offerRepository.create(createOfferDto);
    return await this.offerRepository.save(offer);
  }

  async findMany(query: FindManyOptions<Offer> = {}): Promise<Offer[]> {
    return await this.offerRepository.find(query);
  }

  async findOne(query: FindOneOptions<Offer>): Promise<Offer> {
    const offer = await this.offerRepository.findOne(query);
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
    return await this.offerRepository.remove(offer);
  }
}
