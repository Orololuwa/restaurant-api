import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateMerchantDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;
}
