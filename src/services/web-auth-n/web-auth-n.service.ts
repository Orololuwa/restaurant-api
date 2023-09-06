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
import { WebAuthN as WebAuthNHelper } from 'src/lib/helpers/web-auth-n';
import { MerchantsService } from '../merchants/merchants.service';

@Injectable()
export class WebAuthService {
  constructor(
    @InjectRepository(WebAuthN) private data: Repository<WebAuthN>,
    private merchantService: MerchantsService,
  ) {}

  async getResidentKeys(payload: IGetResidentKeys) {
    try {
      const { id } = payload;
      const webAuthNkeys = await this.data.findOneBy({ id });

      return {
        data: webAuthNkeys,
        message: 'Profile retrieved',
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async attestateBegin(payload: IAttestateBegin) {
    try {
      const { user } = payload;
      const data = await WebAuthNHelper.attestate(user!, true);

      return {
        data,
        message: 'Profile retrieved',
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async attestateEnd(payload: IAttestateEnd) {
    try {
      const { user, attestation } = payload;
      const webAuthData = await WebAuthNHelper.verifyAttestation(
        user,
        attestation,
        true,
      );

      const data = await this.data.create({ ...webAuthData });
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
      throw error;
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
      throw error;
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
      throw error;
    }
  }
}
