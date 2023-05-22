import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemsController } from '../../controllers/merchants/menu-item.controller';
import { MenuItem } from '../../frameworks/typeorm/entities/menu-item.entity';
import { MenuItemService } from './menu-item.service';
import { RestaurantModule } from '../restaurants/restaurants.module';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem]), RestaurantModule],
  providers: [MenuItemService],
  controllers: [MenuItemsController],
  exports: [MenuItemService],
})
export class MenuItemModule {}
