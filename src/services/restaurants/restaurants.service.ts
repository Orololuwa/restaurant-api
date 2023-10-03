import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDTO } from 'src/core/dtos/restaurants/create-restaurant.dto';
import { Merchant } from 'src/frameworks/typeorm/entities/merchants.entity';
import { Restaurant } from 'src/frameworks/typeorm/entities/restaurants.entity';
import { DataSource } from 'typeorm';
import { ResponseState } from 'src/lib/helpers';
import { OptionalQuery } from 'src/core/types';
import { AddressService } from '../address/address.service';
import {
  AddRestaurantAddressDTO,
  EditRestaurantAddressDTO,
} from 'src/core/dtos/restaurants/add-restaurant-address.dto';
import { EditRestaurantDTO } from 'src/core/dtos/restaurants/edit-restaurant.dto';
import { ErrorService } from '../error/error.service';
import { Address } from 'src/frameworks/typeorm/entities/address.entity';

@Injectable()
export class RestaurantService {
  constructor(
    private addressService: AddressService,
    private dataSource: DataSource,
    private errorService: ErrorService,
  ) {}

  async create(body: CreateRestaurantDTO, merchant: Merchant) {
    try {
      const isEmailExist = await this.dataSource.manager.findOneBy(Restaurant, {
        email: body.email,
      });

      if (isEmailExist) {
        throw new BadRequestException('A restaurant with this email exists');
      }

      const restaurant = this.dataSource.manager.create(Restaurant, {
        ...body,
      });
      restaurant.merchant = merchant;

      const created = await this.dataSource.manager.save(restaurant);

      return {
        status: HttpStatus.OK,
        data: { id: created.id },
        message: 'Restaurant created successfully',
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async addAddress(body: AddRestaurantAddressDTO) {
    try {
      const { address, id } = body;

      const restaurant = (await this.findOneWith({ id })).data;

      if (!restaurant) {
        throw new NotFoundException('Restaurant for merchant does not exist');
      }

      const createdAddress = (
        await this.addressService.createRestaurantAdress(address)
      ).data;

      await this.dataSource.manager.update(Restaurant, restaurant.id, {
        address: createdAddress,
      });

      return {
        message: 'Address added successfully',
        data: { id },
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async editAddress(body: EditRestaurantAddressDTO) {
    try {
      const { id, address } = body;

      const restaurant = await this.dataSource.manager.findOne(Restaurant, {
        where: {
          id,
        },
        relations: { address: true },
      });

      if (!restaurant) {
        throw new NotFoundException('Restaurant for merchant does not exist');
      }

      const existingAdress = restaurant.address;

      if (!existingAdress) {
        throw new NotFoundException('Address for merchant not found');
      }

      await this.dataSource.manager.update(Address, existingAdress.id, {
        ...address,
      });

      return {
        message: 'Address edited successfully',
        data: { id },
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async findAll(options?: { merchant?: Merchant }) {
    try {
      const restaurants = await this.dataSource.manager.find(Restaurant, {
        where: { merchant: { id: options?.merchant?.id } || undefined },
      });

      return {
        message: 'Restaurants retrieved successfully',
        data: restaurants,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async findOneWith(field: OptionalQuery<Restaurant>) {
    try {
      const { merchant, ...options } = field;
      const restaurant = await this.dataSource.manager.findOne(Restaurant, {
        where: { merchant: { id: merchant?.id }, ...options },
        relations: { address: true },
      });

      if (!restaurant) throw new NotFoundException('Restaurant not found');

      const setupComplete =
        !!restaurant.address &&
        !!restaurant.description &&
        !!restaurant.email &&
        !!restaurant.name &&
        !!restaurant.logo;

      return {
        message: 'Found',
        data: { ...restaurant, setupComplete },
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  async update(
    id: number,
    body: OptionalQuery<EditRestaurantDTO>,
    merchant: Merchant,
  ) {
    try {
      const restaurant = (
        await this.findOneWith({
          id,
          merchant,
        })
      ).data;

      if (!restaurant) {
        throw new BadRequestException('Restaurant does not exist');
      }

      await this.dataSource.manager.update(Restaurant, id, { ...body });

      return {
        status: HttpStatus.OK,
        data: { id },
        message: 'Restaurant updated successfully',
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      await this.errorService.error(error);
    }
  }

  // async addSocials(
  //   body: OptionalQuery<AddRestaurantSocialsDTO>,
  //   id: number,
  //   merchant: Merchant,
  // ) {
  //   try {
  //     const restaurant = await this.dataSource.manager.findOneBy(Restaurant, {
  //       id,
  //       merchant,
  //     });

  //     if (!restaurant) throw new NotFoundException('Restaurant not found');

  //     await this.dataSource.manager.update(Restaurant, id, { ...body });

  //     return {
  //       status: HttpStatus.OK,
  //       message: 'Created successfully',
  //       state: ResponseState.SUCCESS,
  //     };
  //   } catch (error) {
  //      await this.errorService.error(error);
  //   }
  // }
}
