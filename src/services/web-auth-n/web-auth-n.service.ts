import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IAssertRemove,
  IAttestateBegin,
  IAttestateEnd,
  IGetResidentKeys,
} from 'src/core/dtos/web-auth-n';
import { WebAuthN } from 'src/frameworks/typeorm/entities/web-auth-n.entity';
import { ResponseState } from 'src/lib/helpers';
import { Repository } from 'typeorm';
import { WebAuthNHelper } from 'src/frameworks/web-auth-n/web-auth-n';
import { MerchantsService } from '../merchants/merchants.service';
import { ErrorService } from '../error/error.service';

@Injectable()
export class WebAuthService {
  constructor(
    @InjectRepository(WebAuthN) private data: Repository<WebAuthN>,
    private merchantService: MerchantsService,
    private errorService: ErrorService,
  ) {}

  async getResidentKeys(payload: IGetResidentKeys) {
    try {
      const { id } = payload;
      const merchant = await this.merchantService.findOne(id);
      const isWebAuthEnabled = merchant.isWebAuthEnabled;

      return {
        data: { isWebAuthEnabled },
        message: 'Profile retrieved',
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async attestateBegin(payload: IAttestateBegin) {
    try {
      const { user } = payload;
      const data = await WebAuthNHelper.attestate(user!);

      return {
        data,
        message: 'Profile retrieved',
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async attestateEnd(payload: IAttestateEnd) {
    try {
      const { user, attestation } = payload;
      const webAuthData = await WebAuthNHelper.verifyAttestation(
        user,
        attestation,
      );

      const data = this.data.create({ ...webAuthData });
      await this.data.save(data);
      await this.merchantService.update(user.id, {
        webAuthN: data,
        isWebAuthEnabled: true,
      });

      return {
        data,
        message: 'Profile retrieved',
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async assertBegin() {
    try {
      const data = await WebAuthNHelper.assertResident();

      return {
        data,
        message: 'Profile retrieved',
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async assertEndRemove(payload: IAssertRemove) {
    try {
      const { user, assertion, challenge } = payload;

      const data = await this.merchantService.findOne(user.id);

      const { webAuthN } = data;

      if (!challenge || !webAuthN)
        return Promise.reject({
          message: 'Signature not found',
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

      await this.merchantService.update(user.id, {
        webAuthN: null,
        isWebAuthEnabled: false,
      });

      return {
        data: {},
        message: 'Profile retrieved',
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async getUserHandle(credentialId: string) {
    try {
      const data = await this.data.findOneBy({ credentialId });

      if (!data)
        return Promise.reject({
          message: 'Signature not found',
          error: 'NotFound',
          status: HttpStatus.NOT_FOUND,
          state: ResponseState.ERROR,
        });

      const merchant = await this.merchantService.findOneWith({
        webAuthN: data,
      });

      if (!merchant || !merchant.data)
        return Promise.reject({
          message: 'User not found',
          error: 'NotFound',
          status: HttpStatus.NOT_FOUND,
          state: ResponseState.ERROR,
        });

      return merchant.data;
    } catch (error) {
      await this.errorService.error(error);
    }
  }
}
