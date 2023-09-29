import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { OptionalQuery } from 'src/core/types';
import { IPaginationParams } from '..';
import { MenuItem } from 'src/frameworks/typeorm/entities/menu-item.entity';
import { Restaurant } from 'src/frameworks/typeorm/entities/restaurants.entity';
import { MenuItemStatus } from 'src/lib/helpers/menu-items';

export interface IGetAllMenuItemsPayload {
  query: IMenuItemQuery;
  options?: OptionalQuery<MenuItem>;
}

export interface IMenuItemQuery extends IPaginationParams {
  from: string;
  to: string;
}

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

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsBoolean()
  isNewCategory: string;
}

export class EditMenuItemDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  image: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsEnum(MenuItemStatus)
  @IsNotEmpty()
  status: string;
}

export interface CreateMenuItemPayload {
  body: CreateMenuItemDTO;
  restaurant: Restaurant;
}
