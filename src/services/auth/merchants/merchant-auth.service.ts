import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isPasswordValid } from 'src/lib/validators';
import { ResponseState } from 'src/lib/helpers';
import { compareHash, createHash } from 'src/lib/utils';
import { JwtService } from '@nestjs/jwt';
import { MerchantsService } from 'src/services/merchants/merchants.service';
import { CreateMerchantDTO } from 'src/core/dtos/merchants/create-merchant.dto';

@Injectable()
export class MerchantAuthService {
  constructor(
    private merchantService: MerchantsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const { data: merchant } = await this.merchantService.findOneWith({
      email,
    });

    if (!merchant) {
      throw new NotFoundException('Incorrect Email or password');
    }

    if (!(await compareHash(pass, merchant.password))) {
      throw new BadRequestException('Incorrect Email or password');
    }

    if (!merchant.password) {
      throw new BadRequestException('Password not set: Cannot sign you in');
    }

    const { password, ...result } = merchant;
    return result;
  }

  async signUp(body: CreateMerchantDTO) {
    try {
      const { email, phone, password, ...rest } = body;
      const [{ data: emailExisting }, { data: phoneExisting }] =
        await Promise.all([
          this.merchantService.findOneWith({ email }),
          this.merchantService.findOneWith({ phone }),
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

      const { data: merchant } = await this.merchantService.create({
        email,
        phone,
        password: await createHash(password),
        ...rest,
      });

      return this.signIn({ email: merchant.email, password }, { signUp: true });
    } catch (error) {
      throw error;
    }
  }

  async signIn(
    body: { email: string; password: string },
    options?: {
      signUp?: boolean;
    },
  ) {
    try {
      const merchant = await this.validateUser(body.email, body.password);
      const payload = { email: merchant.email, id: merchant.id };

      const access_token = this.jwtService.sign(payload);

      return {
        message: options?.signUp
          ? 'Merchant created successfully'
          : 'Merchant logged in successfully',
        data: {
          merchant,
          access_token,
        },
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
