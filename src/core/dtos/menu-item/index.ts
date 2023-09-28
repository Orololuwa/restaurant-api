import { OptionalQuery } from 'src/core/types';
import { IPaginationParams } from '..';
import { MenuItem } from 'src/frameworks/typeorm/entities/menu-item.entity';

export interface IGetAllMenuItemsPayload {
  query: IMenuItemQuery;
  options?: OptionalQuery<MenuItem>;
}

export interface IMenuItemQuery extends IPaginationParams {
  from: string;
  to: string;
}
