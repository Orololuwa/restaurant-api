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
import { CreateUserDTO } from 'src/controllers/users/dtos/dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(body: CreateUserDTO) {
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

  async signIn(body: { email: string; password: string }) {
    const [existingUser] = await this.usersService.find(body.email);

    if (!existingUser) {
      throw new NotFoundException('Email does not exist');
    }

    if (!existingUser.password) {
      throw new BadRequestException('Password not set: Cannot sign you in');
    }

    if (await compareHash(body.password, existingUser.password)) {
      throw new BadRequestException('Incorrect Email or password');
    }

    return existingUser;
  }

  async validateUser(email: string, pass: string): Promise<any> {
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

  async signUpJWT(body: CreateUserDTO) {
    const { email, password, address, name } = body;
    const [existingUser] = await this.usersService.find(email);

    if (existingUser) {
      throw new BadRequestException('Email in use!');
    }

    const isPasswordValidated = isPasswordValid(password);

    if (!isPasswordValidated)
      return Promise.reject({
        status: HttpStatus.BAD_REQUEST,
        message: 'Password Invalid',
        error: null,
        state: ResponseState.ERROR,
      });

    const user = await this.usersService.create({
      email,
      password: await createHash(password),
      address,
      name,
    });

    return this.signInJWT({ email: user.email, id: user.id });
  }

  async signInJWT(user: { email: string; id: number }) {
    const payload = { username: user.email, sub: user.id };

    const access_token = this.jwtService.sign(payload);

    return {
      user,
      access_token,
    };
  }
}
