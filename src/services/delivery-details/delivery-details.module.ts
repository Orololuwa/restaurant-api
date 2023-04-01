import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryDetails } from 'src/frameworks/typeorm/entities/delivery-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryDetails])],
  controllers: [],
  providers: [],
})
export class OrdersModule {}
