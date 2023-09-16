import { ValidateNested, IsNotEmptyObject, IsString } from 'class-validator';
import {
  CreateAddressDTO,
  EditAddressDTO,
} from '../address/create-address.dto';
import { Type } from 'class-transformer';

export class AddRestaurantAddressDTO {
  @IsString()
  id: number;

  @ValidateNested()
  @Type(() => CreateAddressDTO)
  @IsNotEmptyObject()
  address: CreateAddressDTO;
}

export class EditRestaurantAddressDTO {
  @IsString()
  id: number;

  @ValidateNested()
  @Type(() => EditAddressDTO)
  @IsNotEmptyObject()
  address: EditAddressDTO;
}
