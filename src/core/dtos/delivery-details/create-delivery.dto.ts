import { IsNumber, IsString } from 'class-validator';

export class CreateDeliveryDetailsDTO {
  @IsString()
  houseNumber: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsNumber()
  zipCode: number;
}
