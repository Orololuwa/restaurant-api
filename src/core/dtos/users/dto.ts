import { Expose } from 'class-transformer';
import { IsEmail, IsString, IsPhoneNumber, IsOptional } from 'class-validator';
import { Role } from 'src/lib/helpers';

export class CreateUserDTO {
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

  @IsString()
  role: Role;
}

export class UserDTO {
  @Expose()
  id: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  middleName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  // @Expose()
  // role: Role;
}

export class SignInDTO {
  @IsEmail()
  email: string;

  @IsString({ message: 'Incorrect Password' })
  password: string;
}
