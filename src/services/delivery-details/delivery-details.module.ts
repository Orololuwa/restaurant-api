import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryDetailsController } from 'src/controllers/delivery-details.controller';
import { DeliveryDetails } from 'src/frameworks/typeorm/entities/delivery-details.entity';
import { DeliveryDetailsService } from './delivery-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryDetails])],
  controllers: [DeliveryDetailsController],
  providers: [DeliveryDetailsService],
})
export class DeliveryDetailsModule {}
