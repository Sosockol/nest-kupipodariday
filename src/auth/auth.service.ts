import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      // Попробуем найти пользователя по username
      let user: User;
      try {
        user = await this.usersService.findOne({ where: { username } });
      } catch {
        // Если не найден по username, попробуем по email
        try {
          user = await this.usersService.findOne({
            where: { email: username },
          });
        } catch {
          return null;
        }
      }

      const isPasswordValid = await this.hashService.verify(
        password,
        user.password,
      );
      if (isPasswordValid) {
        return user;
      }
      return null;
    } catch {
      return null;
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    // Проверяем, не существует ли уже пользователь с таким username или email
    try {
      await this.usersService.findOne({
        where: { username: signUpDto.username },
      });
      throw new ConflictException('Пользователь с таким именем уже существует');
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
    }

    try {
      await this.usersService.findOne({ where: { email: signUpDto.email } });
      throw new ConflictException('Пользователь с таким email уже существует');
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
    }

    // Хешируем пароль
    const hashedPassword = await this.hashService.hash(signUpDto.password);

    // Создаем пользователя
    const user = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
    });

    return user;
  }

  async signIn(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
