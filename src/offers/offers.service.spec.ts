import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import type { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';

describe('OffersService', () => {
  let service: OffersService;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    about: 'Test user',
    avatar: 'https://i.pravatar.cc/300',
    createdAt: new Date(),
    updatedAt: new Date(),
    wishes: [],
    offers: [],
    wishlists: [],
  };

  const mockOwner: User = {
    id: 2,
    username: 'owner',
    email: 'owner@example.com',
    password: 'hashedPassword',
    about: 'Wish owner',
    avatar: 'https://i.pravatar.cc/300',
    createdAt: new Date(),
    updatedAt: new Date(),
    wishes: [],
    offers: [],
    wishlists: [],
  };

  const mockWish: Wish = {
    id: 1,
    name: 'Test Wish',
    link: 'https://example.com',
    image: 'https://example.com/image.jpg',
    price: 100.5,
    raised: 0,
    description: 'Test description',
    copied: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: mockOwner,
    offers: [],
    wishlists: [],
  };

  const mockOffer: Offer = {
    id: 1,
    amount: 25.0,
    hidden: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
    item: mockWish,
  };

  const mockOfferRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockWishRepository = {
    findOne: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        {
          provide: getRepositoryToken(Offer),
          useValue: mockOfferRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Wish),
          useValue: mockWishRepository,
        },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new offer successfully', async () => {
      const createOfferDto: CreateOfferDto = {
        amount: 25.0,
        hidden: false,
        userId: 1,
        itemId: 1,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockWishRepository.findOne.mockResolvedValue(mockWish);
      mockOfferRepository.create.mockReturnValue(mockOffer);
      mockOfferRepository.save.mockResolvedValue(mockOffer);
      mockWishRepository.increment.mockResolvedValue(undefined);

      const result = await service.create(createOfferDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockWishRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['owner'],
      });
      expect(mockOfferRepository.create).toHaveBeenCalledWith({
        amount: 25.0,
        user: mockUser,
        item: mockWish,
        hidden: false,
      });
      expect(mockWishRepository.increment).toHaveBeenCalledWith(
        { id: 1 },
        'raised',
        25.0,
      );
      expect(result).toEqual(mockOffer);
    });

    it('should throw NotFoundException when user not found', async () => {
      const createOfferDto: CreateOfferDto = {
        amount: 25.0,
        userId: 999,
        itemId: 1,
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createOfferDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when wish not found', async () => {
      const createOfferDto: CreateOfferDto = {
        amount: 25.0,
        userId: 1,
        itemId: 999,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockWishRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createOfferDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when user tries to contribute to own wish', async () => {
      const createOfferDto: CreateOfferDto = {
        amount: 25.0,
        userId: 2, // Same as wish owner
        itemId: 1,
      };

      mockUserRepository.findOne.mockResolvedValue(mockOwner);
      mockWishRepository.findOne.mockResolvedValue(mockWish);

      await expect(service.create(createOfferDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should use default hidden value when not provided', async () => {
      const createOfferDto: CreateOfferDto = {
        amount: 25.0,
        userId: 1,
        itemId: 1,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockWishRepository.findOne.mockResolvedValue(mockWish);
      mockOfferRepository.create.mockReturnValue(mockOffer);
      mockOfferRepository.save.mockResolvedValue(mockOffer);

      await service.create(createOfferDto);

      expect(mockOfferRepository.create).toHaveBeenCalledWith({
        amount: 25.0,
        user: mockUser,
        item: mockWish,
        hidden: false,
      });
    });
  });

  describe('findMany', () => {
    it('should return offers with relations', async () => {
      const offers = [mockOffer];
      mockOfferRepository.find.mockResolvedValue(offers);

      const result = await service.findMany();

      expect(mockOfferRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'item'],
      });
      expect(result).toEqual(offers);
    });
  });

  describe('findOne', () => {
    it('should return an offer when found', async () => {
      const query = { where: { id: 1 } };
      mockOfferRepository.findOne.mockResolvedValue(mockOffer);

      const result = await service.findOne(query);

      expect(mockOfferRepository.findOne).toHaveBeenCalledWith({
        relations: ['user', 'item'],
        ...query,
      });
      expect(result).toEqual(mockOffer);
    });

    it('should throw NotFoundException when offer not found', async () => {
      const query = { where: { id: 999 } };
      mockOfferRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(query)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeOne', () => {
    it('should remove offer and decrement wish raised amount', async () => {
      const query = { where: { id: 1 } };

      mockOfferRepository.findOne.mockResolvedValue(mockOffer);
      mockOfferRepository.remove.mockResolvedValue(mockOffer);
      mockWishRepository.decrement.mockResolvedValue(undefined);

      const result = await service.removeOne(query);

      expect(mockWishRepository.decrement).toHaveBeenCalledWith(
        { id: mockOffer.item.id },
        'raised',
        mockOffer.amount,
      );
      expect(mockOfferRepository.remove).toHaveBeenCalledWith(mockOffer);
      expect(result).toEqual(mockOffer);
    });
  });
});
