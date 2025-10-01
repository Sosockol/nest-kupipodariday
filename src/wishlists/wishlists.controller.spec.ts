import { Test, type TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import type { CreateWishlistDto } from './dto/create-wishlist.dto';
import type { UpdateWishlistDto } from './dto/update-wishlist.dto';
import type { Wishlist } from './entities/wishlist.entity';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';

describe('WishlistsController', () => {
  let controller: WishlistsController;
  let wishlistsService: WishlistsService;
  let usersService: UsersService;

  const mockUser = {
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

  const mockWishlistsService = {
    create: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    removeOne: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistsController],
      providers: [
        {
          provide: WishlistsService,
          useValue: mockWishlistsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<WishlistsController>(WishlistsController);
    wishlistsService = module.get<WishlistsService>(WishlistsService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new wishlist', async () => {
      const createWishlistDto: CreateWishlistDto = {
        name: 'Test Wishlist',
        description: 'Test description',
        image: 'https://example.com/image.jpg',
      };

      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockWishlistsService.create.mockResolvedValue(mockWishlist);

      const result = await controller.create(createWishlistDto);

      expect(usersService.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(wishlistsService.create).toHaveBeenCalledWith(
        createWishlistDto,
        mockUser,
      );
      expect(result).toEqual(mockWishlist);
    });
  });

  describe('findAll', () => {
    it('should return an array of wishlists', async () => {
      const wishlists = [mockWishlist];
      mockWishlistsService.findMany.mockResolvedValue(wishlists);

      const result = await controller.findAll();

      expect(wishlistsService.findMany).toHaveBeenCalled();
      expect(result).toEqual(wishlists);
    });
  });

  describe('findOne', () => {
    it('should return a wishlist by id', async () => {
      const wishlistId = '1';
      mockWishlistsService.findOne.mockResolvedValue(mockWishlist);

      const result = await controller.findOne(wishlistId);

      expect(wishlistsService.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockWishlist);
    });
  });

  describe('update', () => {
    it('should update a wishlist', async () => {
      const wishlistId = '1';
      const updateWishlistDto: UpdateWishlistDto = { name: 'Updated Wishlist' };
      const updatedWishlist = { ...mockWishlist, ...updateWishlistDto };

      mockWishlistsService.updateOne.mockResolvedValue(updatedWishlist);

      const result = await controller.update(wishlistId, updateWishlistDto);

      expect(wishlistsService.updateOne).toHaveBeenCalledWith(
        { where: { id: 1 } },
        updateWishlistDto,
      );
      expect(result).toEqual(updatedWishlist);
    });
  });

  describe('remove', () => {
    it('should remove a wishlist', async () => {
      const wishlistId = '1';
      mockWishlistsService.removeOne.mockResolvedValue(mockWishlist);

      const result = await controller.remove(wishlistId);

      expect(wishlistsService.removeOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockWishlist);
    });
  });
});
