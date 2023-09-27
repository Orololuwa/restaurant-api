import * as _ from 'lodash';
import { Merchant } from 'src/frameworks/typeorm/entities/merchants.entity';

export const serializeMerchant = (merchant: Partial<Merchant>) => {
  return _.omit(merchant, ['password', 'webAuthN']);
};
