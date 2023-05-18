import { ValidateNested, IsNotEmptyObject, IsString } from 'class-validator';
import { CreateAddressDTO } from '../address/create-address.dto';
import { Type } from 'class-transformer';

export class AddRestaurantAddressDTO {
  @IsString()
  email: string;

  @ValidateNested()
  @Type(() => CreateAddressDTO)
  @IsNotEmptyObject()
  address: CreateAddressDTO;
}
