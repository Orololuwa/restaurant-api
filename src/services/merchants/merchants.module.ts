import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from 'src/frameworks/typeorm/entities/merchants.entity';
import { MerchantsService } from './merchants.service';
import { MerchantController } from 'src/controllers/merchants/merchant.controller';
import { RestaurantModule } from '../restaurants/restaurants.module';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant]), RestaurantModule],
  providers: [MerchantsService],
  exports: [MerchantsService],
  controllers: [MerchantController],
})
export class MerchantsModule {}
