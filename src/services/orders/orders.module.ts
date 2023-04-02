import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemPurchaseModule } from 'src/services/menu-item-purchase/menu-item-purchase.module';
// import { UsersModule } from 'src/services/users/users.module';
import { OrdersController } from '../../controllers/orders.controller';
import { Order } from '../../frameworks/typeorm/entities/orders.entity';
import { OrdersService } from 'src/services/orders/orders.service';
import { AddressModule } from '../delivery-details/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    // UsersModule,
    MenuItemPurchaseModule,
    AddressModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
