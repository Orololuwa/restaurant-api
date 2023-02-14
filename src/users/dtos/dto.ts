import { Expose } from 'class-transformer';
import { IsEmail, isString, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsString()
  password: string;
}

export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

export class SignInDTO {
  @IsEmail()
  email: string;

  @IsString({ message: 'Incorrect Password' })
  password: string;
}
