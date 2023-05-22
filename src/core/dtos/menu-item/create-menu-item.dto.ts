import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateMenuItemDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  restaurantId: string;
}
