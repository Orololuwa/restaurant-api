import { Expose, Transform } from 'class-transformer';
import { MenuItemPurchase } from 'src/frameworks/typeorm/entities/menu-item-purchase.entity';

export class OrderDTO {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  deliveryMethod: string;

  @Expose()
  @Transform(({ obj }) => obj.menuItem)
  menuItem: MenuItemPurchase;
}
