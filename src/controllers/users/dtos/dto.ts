import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { Role } from 'src/lib/helpers';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsString()
  password: string;

  @IsString()
  role: Role;
}

export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;
}

export class SignInDTO {
  @IsEmail()
  email: string;

  @IsString({ message: 'Incorrect Password' })
  password: string;
}
