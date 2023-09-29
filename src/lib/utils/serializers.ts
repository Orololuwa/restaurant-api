import * as _ from 'lodash';
import { MenuItem } from 'src/frameworks/typeorm/entities/menu-item.entity';
import { Merchant } from 'src/frameworks/typeorm/entities/merchants.entity';

export const serializeMerchant = (merchant: Partial<Merchant>) => {
  return _.omit(merchant, ['password', 'webAuthN']);
};

export const serializeMenuItem = (merchant: Partial<MenuItem>) => {
  return _.omit(merchant, ['restaurant']);
};
