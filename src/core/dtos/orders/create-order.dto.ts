import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { CreateMenuItemPurchaseDTO } from '../menu-item-purchase/menu-item-purchase';

export class CreateOrderDTO {
  @IsNumber()
  price: number;

  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemPurchaseDTO)
  @IsArray()
  ingredients: CreateMenuItemPurchaseDTO[];

  @IsNumber()
  addressId: number;
}
