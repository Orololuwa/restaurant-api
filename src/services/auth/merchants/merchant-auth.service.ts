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
import { IWebAuthLogin } from 'src/core/dtos/web-auth-n';
import { WebAuthNHelper } from 'src/frameworks/web-auth-n/web-auth-n';
import { ErrorService } from 'src/services/error/error.service';
import { WebAuthService } from 'src/services/web-auth-n/web-auth-n.service';
import { serializeMerchant } from 'src/lib/utils/serializers';

@Injectable()
export class MerchantAuthService {
  constructor(
    private merchantService: MerchantsService,
    private jwtService: JwtService,
    private errorService: ErrorService,
    private webAuthService: WebAuthService,
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

    return serializeMerchant(merchant);
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
      await this.errorService.error(error);
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
      await this.errorService.error(error);
    }
  }

  async loginWebAuthN(payload: IWebAuthLogin) {
    try {
      const { assertion, challenge } = payload;

      if (!challenge)
        return Promise.reject({
          error: 'NotFound',
          message: 'WebAuth Signature not found',
          status: HttpStatus.NOT_FOUND,
          state: ResponseState.ERROR,
        });

      const merchant = await this.webAuthService.getUserHandle(assertion.rawId);

      if (!merchant)
        return Promise.reject({
          message: 'User not found',
          error: 'NotFound',
          status: HttpStatus.NOT_FOUND,
          state: ResponseState.ERROR,
        });

      const { webAuthN, isWebAuthEnabled } = merchant;
      if (!webAuthN || !isWebAuthEnabled)
        return Promise.reject({
          message: 'WebAuth not enabled. Please log in normally and set it up',
          error: 'NotFound',
          status: HttpStatus.NOT_FOUND,
          state: ResponseState.ERROR,
        });

      const isAssertionVerified = await WebAuthNHelper.verifyAssertionResident(
        challenge as string,
        webAuthN,
        assertion,
      );

      if (!isAssertionVerified)
        return Promise.reject({
          message: 'Signature Invalid',
          error: 'NotFound',
          status: HttpStatus.NOT_FOUND,
          state: ResponseState.ERROR,
        });

      const jwtPayload = { email: merchant.email, id: merchant.id };
      const access_token = this.jwtService.sign(jwtPayload);

      return {
        data: {
          merchant,
          access_token,
        },
        message: 'WebAuth Login Succesful',
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }
}
