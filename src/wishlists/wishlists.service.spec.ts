import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { User } from '../users/entities/user.entity';
import type { CreateWishlistDto } from './dto/create-wishlist.dto';
import type { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

describe('WishlistsService', () => {
  let service: WishlistsService;

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

  const mockWishlist: Wishlist = {
    id: 1,
    name: 'Test Wishlist',
    description: 'Test description',
    image: 'https://example.com/image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: mockUser,
    items: [],
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistsService,
        {
          provide: getRepositoryToken(Wishlist),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WishlistsService>(WishlistsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new wishlist with owner', async () => {
      const createWishlistDto: CreateWishlistDto = {
        name: 'Test Wishlist',
        description: 'Test description',
        image: 'https://example.com/image.jpg',
      };

      const expectedWishlistData = {
        ...createWishlistDto,
        owner: mockUser,
      };

      mockRepository.create.mockReturnValue(mockWishlist);
      mockRepository.save.mockResolvedValue(mockWishlist);

      const result = await service.create(createWishlistDto, mockUser);

      expect(mockRepository.create).toHaveBeenCalledWith(expectedWishlistData);
      expect(mockRepository.save).toHaveBeenCalledWith(mockWishlist);
      expect(result).toEqual(mockWishlist);
    });

    it('should create wishlist without description', async () => {
      const createWishlistDto: CreateWishlistDto = {
        name: 'Test Wishlist',
        image: 'https://example.com/image.jpg',
      };

      const expectedWishlistData = {
        ...createWishlistDto,
        owner: mockUser,
      };

      mockRepository.create.mockReturnValue(mockWishlist);
      mockRepository.save.mockResolvedValue(mockWishlist);

      await service.create(createWishlistDto, mockUser);

      expect(mockRepository.create).toHaveBeenCalledWith(expectedWishlistData);
    });
  });

  describe('findMany', () => {
    it('should return wishlists with relations', async () => {
      const wishlists = [mockWishlist];
      mockRepository.find.mockResolvedValue(wishlists);

      const result = await service.findMany();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['owner', 'items'],
      });
      expect(result).toEqual(wishlists);
    });

    it('should return wishlists with custom query', async () => {
      const wishlists = [mockWishlist];
      const query = { where: { name: 'Test Wishlist' } };
      mockRepository.find.mockResolvedValue(wishlists);

      const result = await service.findMany(query);

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['owner', 'items'],
        ...query,
      });
      expect(result).toEqual(wishlists);
    });
  });

  describe('findOne', () => {
    it('should return a wishlist when found', async () => {
      const query = { where: { id: 1 } };
      mockRepository.findOne.mockResolvedValue(mockWishlist);

      const result = await service.findOne(query);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        relations: ['owner', 'items'],
        ...query,
      });
      expect(result).toEqual(mockWishlist);
    });

    it('should throw NotFoundException when wishlist not found', async () => {
      const query = { where: { id: 999 } };
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(query)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        relations: ['owner', 'items'],
        ...query,
      });
    });
  });

  describe('updateOne', () => {
    it('should update and return a wishlist', async () => {
      const query = { where: { id: 1 } };
      const updateWishlistDto: UpdateWishlistDto = { name: 'Updated Wishlist' };
      const updatedWishlist = { ...mockWishlist, ...updateWishlistDto };

      mockRepository.findOne.mockResolvedValue(mockWishlist);
      mockRepository.save.mockResolvedValue(updatedWishlist);

      const result = await service.updateOne(query, updateWishlistDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        relations: ['owner', 'items'],
        ...query,
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockWishlist,
        ...updateWishlistDto,
      });
      expect(result).toEqual(updatedWishlist);
    });

    it('should throw NotFoundException when wishlist to update not found', async () => {
      const query = { where: { id: 999 } };
      const updateWishlistDto: UpdateWishlistDto = { name: 'Updated Wishlist' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateOne(query, updateWishlistDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeOne', () => {
    it('should remove and return a wishlist', async () => {
      const query = { where: { id: 1 } };

      mockRepository.findOne.mockResolvedValue(mockWishlist);
      mockRepository.remove.mockResolvedValue(mockWishlist);

      const result = await service.removeOne(query);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        relations: ['owner', 'items'],
        ...query,
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockWishlist);
      expect(result).toEqual(mockWishlist);
    });

    it('should throw NotFoundException when wishlist to remove not found', async () => {
      const query = { where: { id: 999 } };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.removeOne(query)).rejects.toThrow(NotFoundException);
    });
  });
});
