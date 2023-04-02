import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeliveryDetailsDTO } from 'src/core/dtos/delivery-details/create-delivery.dto';
import { OptionalQuery } from 'src/core/types';
import { DeliveryDetails } from 'src/frameworks/typeorm/entities/delivery-details.entity';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import { ResponseState } from 'src/lib/helpers';
import { Repository } from 'typeorm';

@Injectable()
export class DeliveryDetailsService {
  constructor(
    @InjectRepository(DeliveryDetails)
    private repo: Repository<DeliveryDetails>,
  ) {}
  async create(body: CreateDeliveryDetailsDTO, user: User) {
    try {
      console.log(body);

      const primaryAddress = (await this.findOneWith({ primaryAddress: true }))
        .data;

      if (primaryAddress) {
        primaryAddress.primaryAddress = false;

        await this.repo.save(primaryAddress);
      }

      const newAddress = this.repo.create(body);
      newAddress.user = user;

      const newPrimaryAddress = await this.repo.save(newAddress);

      return {
        message: 'Address created successfully',
        data: newPrimaryAddress,
        status: HttpStatus.FOUND,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneWith(field: OptionalQuery<DeliveryDetails>) {
    try {
      const address = await this.repo.findOne({ where: field });
      return {
        message: 'Address retrieved successfully',
        data: address,
        status: HttpStatus.FOUND,
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
        status: HttpStatus.FOUND,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
