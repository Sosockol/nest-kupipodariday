import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

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
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findMany', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findMany();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['wishes', 'offers', 'wishlists'],
      });
      expect(result).toEqual(users);
    });

    it('should return users with custom query', async () => {
      const users = [mockUser];
      const query = { where: { username: 'testuser' } };
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findMany(query);

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['wishes', 'offers', 'wishlists'],
        ...query,
      });
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const query = { where: { id: 1 } };
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(query);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        relations: ['wishes', 'offers', 'wishlists'],
        ...query,
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      const query = { where: { id: 999 } };
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(query)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        relations: ['wishes', 'offers', 'wishlists'],
        ...query,
      });
    });
  });

  describe('updateOne', () => {
    it('should update and return a user', async () => {
      const query = { where: { id: 1 } };
      const updateUserDto: UpdateUserDto = { about: 'Updated about' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateOne(query, updateUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        relations: ['wishes', 'offers', 'wishlists'],
        ...query,
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        ...updateUserDto,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when user to update not found', async () => {
      const query = { where: { id: 999 } };
      const updateUserDto: UpdateUserDto = { about: 'Updated about' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateOne(query, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeOne', () => {
    it('should remove and return a user', async () => {
      const query = { where: { id: 1 } };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      const result = await service.removeOne(query);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        relations: ['wishes', 'offers', 'wishlists'],
        ...query,
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user to remove not found', async () => {
      const query = { where: { id: 999 } };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.removeOne(query)).rejects.toThrow(NotFoundException);
    });
  });
});
