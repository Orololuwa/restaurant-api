import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDTO } from 'src/core/dtos/restaurants/create-restaurant.dto';
import { Merchant } from 'src/frameworks/typeorm/entities/merchants.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/frameworks/typeorm/entities/restaurants.entity';
import { Repository } from 'typeorm';
import { ResponseState } from 'src/lib/helpers';
import { OptionalQuery } from 'src/core/types';
import { AddressService } from '../address/address.service';
import { AddRestaurantAddressDTO } from 'src/core/dtos/restaurants/add-restaurant-address.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) private repo: Repository<Restaurant>,
    private addressService: AddressService,
  ) {}

  async create(body: CreateRestaurantDTO, merchant: Merchant) {
    try {
      const isEmailExist = await this.findOneWith({ email: body.email });

      if (isEmailExist.data) {
        throw new BadRequestException('A restaurant with this email exists');
      }

      const restaurant = this.repo.create(body);
      restaurant.merchant = merchant;

      await this.repo.save(restaurant);

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

      await this.repo.save(restaurantCopy);

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

  async findOneWith(field: OptionalQuery<Restaurant>) {
    try {
      const restaurant = await this.repo.findOne({ where: field });

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
}
