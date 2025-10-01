import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { User } from '../users/entities/user.entity';
import type { CreateWishDto } from './dto/create-wish.dto';
import type { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';

describe('WishesService', () => {
  let service: WishesService;

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
    owner: mockUser,
    offers: [],
    wishlists: [],
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    increment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishesService,
        {
          provide: getRepositoryToken(Wish),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WishesService>(WishesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new wish with owner', async () => {
      const createWishDto: CreateWishDto = {
        name: 'Test Wish',
        link: 'https://example.com',
        image: 'https://example.com/image.jpg',
        price: 100.5,
        description: 'Test description',
      };

      const expectedWishData = {
        ...createWishDto,
        owner: mockUser,
        raised: 0,
        copied: 0,
      };

      mockRepository.create.mockReturnValue(mockWish);
      mockRepository.save.mockResolvedValue(mockWish);

      const result = await service.create(createWishDto, mockUser);

      expect(mockRepository.create).toHaveBeenCalledWith(expectedWishData);
      expect(mockRepository.save).toHaveBeenCalledWith(mockWish);
      expect(result).toEqual(mockWish);
    });

    it('should use provided raised and copied values', async () => {
      const createWishDto: CreateWishDto = {
        name: 'Test Wish',
        link: 'https://example.com',
        image: 'https://example.com/image.jpg',
        price: 100.5,
        description: 'Test description',
        raised: 25.0,
        copied: 5,
      };

      const expectedWishData = {
        ...createWishDto,
        owner: mockUser,
        raised: 25.0,
        copied: 5,
      };

      mockRepository.create.mockReturnValue(mockWish);
      mockRepository.save.mockResolvedValue(mockWish);

      await service.create(createWishDto, mockUser);

      expect(mockRepository.create).toHaveBeenCalledWith(expectedWishData);
    });
  });

  describe('findMany', () => {
    it('should return wishes with relations', async () => {
      const wishes = [mockWish];
      mockRepository.find.mockResolvedValue(wishes);

      const result = await service.findMany();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['owner', 'offers', 'wishlists'],
      });
      expect(result).toEqual(wishes);
    });
  });

  describe('findOne', () => {
    it('should return a wish when found', async () => {
      const query = { where: { id: 1 } };
      mockRepository.findOne.mockResolvedValue(mockWish);

      const result = await service.findOne(query);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        relations: ['owner', 'offers', 'wishlists'],
        ...query,
      });
      expect(result).toEqual(mockWish);
    });

    it('should throw NotFoundException when wish not found', async () => {
      const query = { where: { id: 999 } };
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(query)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOne', () => {
    it('should update and return a wish', async () => {
      const query = { where: { id: 1 } };
      const updateWishDto: UpdateWishDto = { name: 'Updated Wish' };
      const updatedWish = { ...mockWish, ...updateWishDto };

      mockRepository.findOne.mockResolvedValue(mockWish);
      mockRepository.save.mockResolvedValue(updatedWish);

      const result = await service.updateOne(query, updateWishDto);

      expect(result).toEqual(updatedWish);
    });
  });

  describe('removeOne', () => {
    it('should remove and return a wish', async () => {
      const query = { where: { id: 1 } };

      mockRepository.findOne.mockResolvedValue(mockWish);
      mockRepository.remove.mockResolvedValue(mockWish);

      const result = await service.removeOne(query);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockWish);
      expect(result).toEqual(mockWish);
    });
  });

  describe('copyWish', () => {
    it('should increment copied counter', async () => {
      const wishId = 1;

      await service.copyWish(wishId);

      expect(mockRepository.increment).toHaveBeenCalledWith(
        { id: wishId },
        'copied',
        1,
      );
    });
  });
});
