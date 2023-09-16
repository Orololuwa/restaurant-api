import { IsNumber, IsOptional, IsString } from 'class-validator';

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

export class EditAddressDTO {
  @IsString()
  @IsOptional()
  houseNumber: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsNumber()
  @IsOptional()
  zipCode: number;
}
