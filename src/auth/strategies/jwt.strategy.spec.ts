import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

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

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    mockConfigService.get.mockReturnValue('test-secret');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user when payload is valid', async () => {
      const payload = { sub: 1, username: 'testuser' };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith({
        where: { id: payload.sub },
      });
    });

    it('should handle different user IDs', async () => {
      const payload = { sub: 2, username: 'anotheruser' };
      const anotherUser = { ...mockUser, id: 2, username: 'anotheruser' };
      mockUsersService.findOne.mockResolvedValue(anotherUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(anotherUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
      });
    });

    it('should throw error when user is not found', async () => {
      const payload = { sub: 999, username: 'nonexistent' };
      mockUsersService.findOne.mockRejectedValue(new Error('User not found'));

      await expect(strategy.validate(payload)).rejects.toThrow(
        'User not found',
      );
      expect(mockUsersService.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('constructor', () => {
    it('should use JWT_SECRET from config', () => {
      expect(mockConfigService.get).toHaveBeenCalledWith(
        'JWT_SECRET',
        'secret',
      );
    });
  });
});
