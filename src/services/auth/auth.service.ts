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
    try {
      const { email, phone, password, ...rest } = body;
      const [emailExisting, phoneExisting] = await Promise.all([
        this.usersService.findOneWithField({ email }),
        this.usersService.findOneWithField({ phone }),
      ]);

      if (emailExisting) {
        throw new BadRequestException('Email in use!');
      }
      if (phoneExisting) {
        throw new BadRequestException('Phone no in use!');
      }

      const isPasswordValidated = isPasswordValid(password);

      if (!isPasswordValidated) {
        throw new BadRequestException('Password Invalid!');
      }

      const user = await this.usersService.create({
        email,
        phone,
        password: await createHash(password),
        ...rest,
      });

      return this.signIn({ email: user.email, password });
    } catch (error) {
      throw error;
    }
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
