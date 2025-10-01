import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from '../hash/hash.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';

describe('AuthService', () => {
  let service: AuthService;

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
    create: jest.fn(),
  };

  const mockHashService = {
    hash: jest.fn(),
    verify: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: HashService,
          useValue: mockHashService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user with correct username and password', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockHashService.verify.mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password');

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(mockHashService.verify).toHaveBeenCalledWith(
        'password',
        'hashedPassword',
      );
    });

    it('should validate user with correct email and password', async () => {
      mockUsersService.findOne
        .mockRejectedValueOnce(new Error('User not found'))
        .mockResolvedValueOnce(mockUser);
      mockHashService.verify.mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith({
        where: { username: 'test@example.com' },
      });
      expect(mockUsersService.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null for incorrect password', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockHashService.verify.mockResolvedValue(false);

      const result = await service.validateUser('testuser', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      mockUsersService.findOne.mockRejectedValue(new Error('User not found'));

      const result = await service.validateUser('nonexistent', 'password');

      expect(result).toBeNull();
    });
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
      about: 'New user',
    };

    it('should create a new user successfully', async () => {
      mockUsersService.findOne.mockRejectedValue(new Error('User not found'));
      mockHashService.hash.mockResolvedValue('hashedPassword123');
      mockUsersService.create.mockResolvedValue({
        ...mockUser,
        ...signUpDto,
        password: 'hashedPassword123',
      });

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({
        ...mockUser,
        ...signUpDto,
        password: 'hashedPassword123',
      });
      expect(mockHashService.hash).toHaveBeenCalledWith('password123');
      expect(mockUsersService.create).toHaveBeenCalledWith({
        ...signUpDto,
        password: 'hashedPassword123',
      });
    });

    it('should throw ConflictException if username already exists', async () => {
      mockUsersService.findOne.mockResolvedValueOnce(mockUser);

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUsersService.findOne).toHaveBeenCalledWith({
        where: { username: signUpDto.username },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUsersService.findOne
        .mockRejectedValueOnce(new Error('User not found'))
        .mockResolvedValueOnce(mockUser);

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUsersService.findOne).toHaveBeenCalledWith({
        where: { email: signUpDto.email },
      });
    });
  });

  describe('signIn', () => {
    it('should generate JWT token for user', async () => {
      const expectedToken = 'jwt-token';
      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = await service.signIn(mockUser);

      expect(result).toEqual({ access_token: expectedToken });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
    });
  });
});
