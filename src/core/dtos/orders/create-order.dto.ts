import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { CreateMenuItemPurchaseDTO } from '../menu-item-purchase/menu-item-purchase';

export class CreateOrderDTO {
  @IsNumber()
  price: number;

  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemPurchaseDTO)
  ingredients: CreateMenuItemPurchaseDTO[];

  @IsNumber()
  addressId: number;
}
