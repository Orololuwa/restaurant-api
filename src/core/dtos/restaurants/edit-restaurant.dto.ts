import { IsOptional, IsString } from 'class-validator';

export class EditRestaurantDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  logo: string;

  @IsString()
  @IsOptional()
  description: string;
}
