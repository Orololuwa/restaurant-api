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
import { AddRestaurantAddressDTO } from 'src/core/dtos/restaurants/add-restaurant-address.dto';
import { EditRestaurantDTO } from 'src/core/dtos/restaurants/edit-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    private addressService: AddressService,
    private dataSource: DataSource,
  ) {}

  async create(body: CreateRestaurantDTO, merchant: Merchant) {
    try {
      const isEmailExist = await this.findOneWith({ email: body.email });

      if (isEmailExist.data) {
        throw new BadRequestException('A restaurant with this email exists');
      }

      const restaurant = this.dataSource.manager.create(Restaurant, {
        ...body,
      });
      restaurant.merchant = merchant;

      await this.dataSource.manager.save(restaurant);

      return {
        status: HttpStatus.OK,
        message: 'Restaurant created successfully',
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async addAddress(body: AddRestaurantAddressDTO, _merchant: Merchant) {
    try {
      const { address, email } = body;

      const restaurant = (await this.findOneWith({ email })).data;

      if (!restaurant) {
        throw new NotFoundException('Restaurant for merchant does not exist');
      }

      const createdAddress = (
        await this.addressService.createForRestaurant(address)
      ).data;

      const restaurantCopy = { ...restaurant, address: createdAddress };

      await this.dataSource.manager.save(restaurantCopy);

      return {
        message: 'Address added successfully',
        data: restaurantCopy,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  async findOneWith(field: OptionalQuery<Restaurant>) {
    try {
      const { merchant, ...options } = field;
      const restaurant = await this.dataSource.manager.findOne(Restaurant, {
        where: { merchant: { id: merchant?.id }, ...options },
      });

      return {
        message: 'Found',
        data: restaurant,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
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

      Object.assign(restaurant, body);

      restaurant.merchant = merchant;

      await this.dataSource.manager.save(restaurant);

      return {
        status: HttpStatus.OK,
        message: 'Restaurant updated successfully',
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async testOneToOne() {
    try {
      const restaurants = await this.dataSource.manager.find(Restaurant, {
        relations: { address: true },
      });

      return {
        data: restaurants,
        status: HttpStatus.OK,
        message: 'Restaurant updated successfully',
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
