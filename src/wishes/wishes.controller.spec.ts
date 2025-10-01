import { Test, type TestingModule } from '@nestjs/testing';
import type { CreateWishDto } from './dto/create-wish.dto';
import type { UpdateWishDto } from './dto/update-wish.dto';
import type { Wish } from './entities/wish.entity';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';

describe('WishesController', () => {
  let controller: WishesController;
  let wishesService: WishesService;

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

  const mockWishesService = {
    create: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    removeOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishesController],
      providers: [
        {
          provide: WishesService,
          useValue: mockWishesService,
        },
      ],
    }).compile();

    controller = module.get<WishesController>(WishesController);
    wishesService = module.get<WishesService>(WishesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new wish', async () => {
      const createWishDto: CreateWishDto = {
        name: 'Test Wish',
        link: 'https://example.com',
        image: 'https://example.com/image.jpg',
        price: 100.5,
        description: 'Test description',
      };

      mockWishesService.create.mockResolvedValue(mockWish);

      const result = await controller.create(createWishDto, mockUser);

      expect(wishesService.create).toHaveBeenCalledWith(
        createWishDto,
        mockUser,
      );
      expect(result).toEqual(mockWish);
    });
  });

  describe('findAll', () => {
    it('should return an array of wishes', async () => {
      const wishes = [mockWish];
      mockWishesService.findMany.mockResolvedValue(wishes);

      const result = await controller.findAll();

      expect(wishesService.findMany).toHaveBeenCalled();
      expect(result).toEqual(wishes);
    });
  });

  describe('findOne', () => {
    it('should return a wish by id', async () => {
      const wishId = '1';
      mockWishesService.findOne.mockResolvedValue(mockWish);

      const result = await controller.findOne(wishId);

      expect(wishesService.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockWish);
    });
  });

  describe('update', () => {
    it('should update a wish', async () => {
      const wishId = '1';
      const updateWishDto: UpdateWishDto = { name: 'Updated Wish' };
      const updatedWish = { ...mockWish, ...updateWishDto };

      mockWishesService.updateOne.mockResolvedValue(updatedWish);

      const result = await controller.update(wishId, updateWishDto);

      expect(wishesService.updateOne).toHaveBeenCalledWith(
        { where: { id: 1 } },
        updateWishDto,
      );
      expect(result).toEqual(updatedWish);
    });
  });

  describe('remove', () => {
    it('should remove a wish', async () => {
      const wishId = '1';
      mockWishesService.removeOne.mockResolvedValue(mockWish);

      const result = await controller.remove(wishId);

      expect(wishesService.removeOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockWish);
    });
  });
});
