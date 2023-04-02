import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateMenuItemDTO {
  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  price: number;
}
