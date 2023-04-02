import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemPurchaseService } from 'src/services/menu-item-purchase/menu-item-purchase.service';
import { MenuItemPurchase } from '../../frameworks/typeorm/entities/menu-item-purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItemPurchase])],
  providers: [MenuItemPurchaseService],
  exports: [MenuItemPurchaseService],
})
export class MenuItemPurchaseModule {}
