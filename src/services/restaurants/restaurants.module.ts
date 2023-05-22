import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantController } from 'src/controllers/merchants/restaurants.controller';
import { Restaurant } from 'src/frameworks/typeorm/entities/restaurants.entity';
import { RestaurantService } from './restaurants.service';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant]), AddressModule],
  providers: [RestaurantService],
  controllers: [RestaurantController],
  exports: [RestaurantService],
})
export class RestaurantModule {}
