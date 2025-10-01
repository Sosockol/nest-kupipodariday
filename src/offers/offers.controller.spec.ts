import { Test, type TestingModule } from '@nestjs/testing';
import type { CreateOfferDto } from './dto/create-offer.dto';
import type { UpdateOfferDto } from './dto/update-offer.dto';
import type { Offer } from './entities/offer.entity';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';

describe('OffersController', () => {
  let controller: OffersController;
  let service: OffersService;

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

  const mockWish = {
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

  const mockOffer: Offer = {
    id: 1,
    amount: 25.0,
    hidden: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
    item: mockWish,
  };

  const mockOffersService = {
    create: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    removeOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [
        {
          provide: OffersService,
          useValue: mockOffersService,
        },
      ],
    }).compile();

    controller = module.get<OffersController>(OffersController);
    service = module.get<OffersService>(OffersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new offer', async () => {
      const createOfferDto: CreateOfferDto = {
        amount: 25.0,
        hidden: false,
        userId: 1,
        itemId: 1,
      };

      mockOffersService.create.mockResolvedValue(mockOffer);

      const result = await controller.create(createOfferDto);

      expect(service.create).toHaveBeenCalledWith(createOfferDto);
      expect(result).toEqual(mockOffer);
    });
  });

  describe('findAll', () => {
    it('should return an array of offers', async () => {
      const offers = [mockOffer];
      mockOffersService.findMany.mockResolvedValue(offers);

      const result = await controller.findAll();

      expect(service.findMany).toHaveBeenCalled();
      expect(result).toEqual(offers);
    });
  });

  describe('findOne', () => {
    it('should return an offer by id', async () => {
      const offerId = '1';
      mockOffersService.findOne.mockResolvedValue(mockOffer);

      const result = await controller.findOne(offerId);

      expect(service.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockOffer);
    });
  });

  describe('update', () => {
    it('should update an offer', async () => {
      const offerId = '1';
      const updateOfferDto: UpdateOfferDto = { amount: 30.0 };
      const updatedOffer = { ...mockOffer, ...updateOfferDto };

      mockOffersService.updateOne.mockResolvedValue(updatedOffer);

      const result = await controller.update(offerId, updateOfferDto);

      expect(service.updateOne).toHaveBeenCalledWith(
        { where: { id: 1 } },
        updateOfferDto,
      );
      expect(result).toEqual(updatedOffer);
    });
  });

  describe('remove', () => {
    it('should remove an offer', async () => {
      const offerId = '1';
      mockOffersService.removeOne.mockResolvedValue(mockOffer);

      const result = await controller.remove(offerId);

      expect(service.removeOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockOffer);
    });
  });
});
