import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateMerchantDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;
}
