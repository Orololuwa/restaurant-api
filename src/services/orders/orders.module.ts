import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemPurchaseModule } from 'src/services/menu-item-purchase/menu-item-purchase.module';
import { OrdersController } from 'src/controllers/users/orders.controller';
import { Order } from '../../frameworks/typeorm/entities/orders.entity';
import { OrdersService } from 'src/services/orders/orders.service';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    MenuItemPurchaseModule,
    AddressModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
