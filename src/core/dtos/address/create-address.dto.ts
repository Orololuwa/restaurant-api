import { IsNumber, IsString } from 'class-validator';

export class CreateAddressDTO {
  @IsString()
  houseNumber: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsNumber()
  zipCode: number;
}
