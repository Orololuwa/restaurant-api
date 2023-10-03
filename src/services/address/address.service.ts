import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDTO } from 'src/core/dtos/address/create-address.dto';
import { OptionalQuery } from 'src/core/types';
import { Address } from 'src/frameworks/typeorm/entities/address.entity';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import { ResponseState } from 'src/lib/helpers';
import { DataSource } from 'typeorm';
import { DataSourceGenericService } from '../shared/dataSource-generic.service';

@Injectable()
export class AddressService extends DataSourceGenericService<Address> {
  constructor(dataSource: DataSource) {
    super(dataSource, Address);
  }
  async createUserAdress(body: CreateAddressDTO, user: User) {
    try {
      const primaryAddress = await this.findOne({
        where: { primaryAddress: true, user },
      });

      if (primaryAddress) {
        await this.update(primaryAddress.id, { primaryAddress: false });
      }

      const newPrimaryAddress = this.create(body);
      newPrimaryAddress.user = user;

      const address = await this.insert(newPrimaryAddress);

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

  async createRestaurantAdress(body: CreateAddressDTO) {
    try {
      const createdAddress = this.create(body);

      const address = await this.insert(createdAddress);

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
      const primaryAddress = await this.findOne({
        where: { primaryAddress: true, user },
      });

      // If there is a previous primary address, find it and update it to false
      if (primaryAddress) {
        await this.update(primaryAddress.id, { primaryAddress: false });
      }

      // Now create a new primary address
      const newPrimaryAddress = await this.findOne({ where: { id } });

      await this.update(primaryAddress.id, { primaryAddress: true });

      return {
        message: 'Address created successfully',
        data: newPrimaryAddress,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAnAddress(field: OptionalQuery<Address>) {
    try {
      const address = await this.findOne({ where: field });
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

  async getAllUserAdresses(user: User) {
    try {
      const addresses = await this.findAllWithPagination(
        { where: { user: { id: user.id } } },
        {},
      );

      return {
        message: 'Addresses retrieved successfully',
        data: addresses,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {}
  }
}
