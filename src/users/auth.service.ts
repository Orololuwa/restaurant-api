import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { CreateUserDTO } from './dtos/dto';
import { UsersService } from './users.service';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(body: CreateUserDTO) {
    const [existingUser] = await this.usersService.find(body.email);

    if (existingUser) {
      throw new BadRequestException('Email in use!');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(body.password, salt, 32)) as Buffer;

    const password = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create({ ...body, password });

    return user;
  }

  async signIn(body: { email: string; password: string }) {
    const [existingUser] = await this.usersService.find(body.email);

    if (!existingUser) {
      throw new NotFoundException('Email does not exist');
    }

    if (!existingUser.password) {
      throw new BadRequestException('Password not set: Cannot sign you in');
    }

    const [salt, storedHash] = existingUser.password.split('.');

    const hash = (await scrypt(body.password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Incorrect password');
    }

    return existingUser;
  }
}
