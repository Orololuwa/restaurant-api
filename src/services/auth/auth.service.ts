import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { isPasswordValid } from 'src/lib/validators';
import { ResponseState } from 'src/lib/helpers';
import { compareHash, createHash } from 'src/lib/utils';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/core/dtos/users/dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createUser(body: CreateUserDTO) {
    const [existingUser] = await this.usersService.find(body.email);

    if (existingUser) {
      throw new BadRequestException('Email in use!');
    }

    const user = await this.usersService.create({
      ...body,
      password: await createHash(body.password),
    });

    return user;
  }

  async validateUser(email: string, pass: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('Incorrect Email or password');
    }

    if (!(await compareHash(pass, user.password))) {
      throw new BadRequestException('Incorrect Email or password');
    }

    if (!user.password) {
      throw new BadRequestException('Password not set: Cannot sign you in');
    }

    // if (user && (await compareHash(pass, user.password))) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    // return null;

    const { password, ...result } = user;
    return result;
  }

  async signUp(body: CreateUserDTO) {
    const { email, password, address, name, role } = body;
    const [existingUser] = await this.usersService.find(email);

    if (existingUser) {
      throw new BadRequestException('Email in use!');
    }

    const isPasswordValidated = isPasswordValid(password);

    if (!isPasswordValidated) {
      throw new BadRequestException('Password Invalid!');
    }

    const user = await this.usersService.create({
      email,
      password: await createHash(password),
      address,
      name,
      role,
    });

    return this.signIn({ email: user.email, password });
  }

  async signIn(body: { email: string; password: string }) {
    const user = await this.validateUser(body.email, body.password);
    const payload = { username: user.email, sub: user.id };

    const access_token = this.jwtService.sign(payload);

    return {
      message: 'User logged in successfully',
      data: {
        user,
        access_token,
      },
      status: HttpStatus.OK,
      state: ResponseState.SUCCESS,
    };
  }
}
