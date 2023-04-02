import { IsNumber } from 'class-validator';

export class CreateMenuItemPurchaseDTO {
  @IsNumber()
  menuItemId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  packNumber: number;

  @IsNumber()
  pricePurchased: number;
}
