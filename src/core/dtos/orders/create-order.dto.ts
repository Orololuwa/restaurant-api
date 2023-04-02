import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { CreateMenuItemPurchaseDTO } from '../menu-item-purchase/menu-item-purchase';

export class CreateOrderDTO {
  @IsNumber()
  price: number;

  @IsString()
  deliveryMethod: string;

  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemPurchaseDTO)
  ingredients: CreateMenuItemPurchaseDTO[];
}
