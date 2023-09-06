import { MenuItemModule } from './menu-item/menu-item.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { MenuItemPurchaseModule } from './menu-item-purchase/menu-item-purchase.module';
import { AddressModule } from './address/address.module';
import { RestaurantModule } from './restaurants/restaurants.module';
import { MerchantsModule } from './merchants/merchants.module';
import { MerchantsAuthModule } from './auth/merchants/merchant-auth.module';
import { WebAuthModule } from './web-auth-n/web-auth-n.module';

export default [
  MenuItemModule,
  UsersModule,
  AuthModule,
  OrdersModule,
  MenuItemPurchaseModule,
  AddressModule,
  RestaurantModule,
  MerchantsModule,
  MerchantsAuthModule,
  WebAuthModule,
];
