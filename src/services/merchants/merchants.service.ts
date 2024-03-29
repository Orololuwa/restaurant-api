import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OptionalQuery } from 'src/core/types';
import { Merchant } from 'src/frameworks/typeorm/entities/merchants.entity';
import { CreateMerchantDTO } from 'src/core/dtos/merchants/create-merchant.dto';
import { ResponseState } from 'src/lib/helpers';
import { RestaurantService } from '../restaurants/restaurants.service';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant) private repo: Repository<Merchant>,
    private restaurantService: RestaurantService,
    private dataSource: DataSource,
  ) {}

  async create(body: CreateMerchantDTO) {
    try {
      const merchant = this.dataSource.manager.create(Merchant, { ...body });

      await this.dataSource.manager.save(merchant);

      return {
        message: 'Order created successfully',
        data: merchant,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async find(email: string) {
    try {
      const merchant = await this.repo.find({ where: { email } });

      return {
        message: 'Found',
        data: merchant,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneWith(field: OptionalQuery<Merchant>) {
    try {
      const merchant = await this.repo.findOne({
        where: field,
        relations: { webAuthN: true },
      });

      return {
        message: 'Found',
        data: merchant,
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfile(merchant: Merchant) {
    try {
      const restaurants = (await this.restaurantService.findAll({ merchant }))
        .data;
      const profile = { ...merchant, setupComplete: !!restaurants.length };

      delete profile.password;

      return {
        data: profile,
        message: 'Profile retrieved',
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  //   async findAll() {
  //     const users = await this.repo
  //       .createQueryBuilder('user')
  //       .leftJoinAndSelect('user.address', 'address')
  //       .select(['user.id', 'user.name', 'user.email', 'address'])
  //       .getMany();

  //     return {
  //       message: 'Users retrieved successfully',
  //       data: { users },
  //       status: HttpStatus.OK,
  //       state: ResponseState.SUCCESS,
  //     };
  //   }

  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOne({ where: { id }, relations: { webAuthN: true } });
  }

  async update(id, field: OptionalQuery<Merchant>) {
    try {
      await this.repo.update(id, { ...field });

      return {
        message: 'Found',
        data: {},
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
