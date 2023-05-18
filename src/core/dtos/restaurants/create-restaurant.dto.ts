import {
  IsString,
  IsEmail,
  // ValidateNested,
  // IsNotEmptyObject,
} from 'class-validator';
// import { CreateAddressDTO } from '../address/create-address.dto';
// import { Type } from 'class-transformer';

export class CreateRestaurantDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  logo: string;

  @IsString()
  description: string;

  // @ValidateNested()
  // @Type(() => CreateAddressDTO)
  // @IsNotEmptyObject()
  // address: CreateAddressDTO;
}
