import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Дата создания пользователя',
    example: '2023-12-01T10:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2023-12-01T10:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Имя пользователя', example: 'john_doe' })
  @Column({ unique: true, length: 30 })
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiProperty({
    description: 'Информация о пользователе',
    example: 'Люблю дарить подарки!',
    default: 'Пока ничего не рассказал о себе',
  })
  @Column({ length: 200, default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @Length(2, 200)
  about: string;

  @ApiProperty({
    description: 'Ссылка на аватар',
    example: 'https://i.pravatar.cc/300',
    default: 'https://i.pravatar.cc/300',
  })
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'john@example.com',
  })
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Хешированный пароль пользователя' })
  @Column()
  @IsString()
  password: string;

  @OneToMany(
    () => Wish,
    (wish) => wish.owner,
  )
  wishes: Wish[];

  @OneToMany(
    () => Offer,
    (offer) => offer.user,
  )
  offers: Offer[];

  @OneToMany(
    () => Wishlist,
    (wishlist) => wishlist.owner,
  )
  wishlists: Wishlist[];
}
