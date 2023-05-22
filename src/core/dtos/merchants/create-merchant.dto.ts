import { IsString, IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';

export class CreateMerchantDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  middleName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;
}
