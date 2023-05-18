import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddressDTO } from 'src/core/dtos/address/create-address.dto';
import { OptionalQuery } from 'src/core/types';
import { Address } from 'src/frameworks/typeorm/entities/address.entity';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import { ResponseState } from 'src/lib/helpers';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private repo: Repository<Address>,
  ) {}
  async create(body: CreateAddressDTO, user: User) {
    try {
      const primaryAddress = (
        await this.findOneWith({ primaryAddress: true, user })
      ).data;

      if (primaryAddress) {
        primaryAddress.primaryAddress = false;

        await this.repo.save(primaryAddress);
      }

      const newPrimaryAddress = this.repo.create(body);
      newPrimaryAddress.user = user;

      const address = await this.repo.save(newPrimaryAddress);

      delete address.user;

      return {
        message: 'Address created successfully',
        data: address,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async createForRestaurant(body: CreateAddressDTO) {
    try {
      const createdAddress = this.repo.create(body);

      const address = await this.repo.save(createdAddress);

      return {
        message: 'Address created successfully',
        data: address,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePrimary(id: number, user: User) {
    try {
      const primaryAddress = (
        await this.findOneWith({ primaryAddress: true, user })
      ).data;

      if (primaryAddress) {
        primaryAddress.primaryAddress = false;

        await this.repo.save(primaryAddress);
      }

      const newPrimaryAddress = (await this.findOneWith({ id })).data;
      newPrimaryAddress.primaryAddress = true;

      const address = await this.repo.save(newPrimaryAddress);

      return {
        message: 'Address created successfully',
        data: address,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneWith(field: OptionalQuery<Address>) {
    try {
      const address = await this.repo.findOne({ where: field });
      return {
        message: 'Address retrieved successfully',
        data: address,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async find(user: User) {
    try {
      const addresses = await this.repo.find({ where: { user } });

      return {
        message: 'Addresses retrieved successfully',
        data: addresses,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {}
  }
}
