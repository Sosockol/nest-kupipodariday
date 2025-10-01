import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';

describe('AuthController', () => {
  let controller: AuthController;

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

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
      about: 'New user',
    };

    it('should register a new user successfully', async () => {
      const expectedUser = { ...mockUser, ...signUpDto };
      mockAuthService.signUp.mockResolvedValue(expectedUser);

      const result = await controller.signUp(signUpDto);

      expect(result).toEqual(expectedUser);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto);
    });

    it('should throw ConflictException when user already exists', async () => {
      mockAuthService.signUp.mockRejectedValue(
        new ConflictException('Пользователь с таким именем уже существует'),
      );

      await expect(controller.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto);
    });

    it('should handle signup with optional fields', async () => {
      const minimalSignUpDto: SignUpDto = {
        username: 'minimaluser',
        email: 'minimal@example.com',
        password: 'password123',
      };

      const expectedUser = { ...mockUser, ...minimalSignUpDto };
      mockAuthService.signUp.mockResolvedValue(expectedUser);

      const result = await controller.signUp(minimalSignUpDto);

      expect(result).toEqual(expectedUser);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(minimalSignUpDto);
    });
  });

  describe('signIn', () => {
    it('should authenticate user and return JWT token', async () => {
      const expectedResponse = { access_token: 'jwt-token-123' };
      const mockRequest = { user: mockUser };
      mockAuthService.signIn.mockResolvedValue(expectedResponse);

      const result = await controller.signIn(mockRequest);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(mockUser);
    });

    it('should handle authentication with different user', async () => {
      const differentUser: User = {
        ...mockUser,
        id: 2,
        username: 'differentuser',
        email: 'different@example.com',
      };
      const expectedResponse = { access_token: 'different-jwt-token' };
      const mockRequest = { user: differentUser };
      mockAuthService.signIn.mockResolvedValue(expectedResponse);

      const result = await controller.signIn(mockRequest);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(differentUser);
    });
  });
});
