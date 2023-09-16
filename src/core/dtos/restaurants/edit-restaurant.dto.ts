import { IsOptional, IsString, IsUrl } from 'class-validator';

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

  @IsOptional()
  @IsString()
  @IsUrl(undefined, { message: 'website link must be a valid URL' })
  website: string;

  @IsOptional()
  @IsString()
  @IsUrl(undefined, { message: 'twitter link must be a valid URL' })
  twitter: string;

  @IsOptional()
  @IsString()
  @IsUrl(undefined, { message: 'instagram link must be a valid URL' })
  instagram: string;

  @IsOptional()
  @IsString()
  @IsUrl(undefined, { message: 'linkedIn link must be a valid URL' })
  linkedIn: string;

  @IsOptional()
  @IsString()
  @IsUrl(undefined, { message: 'facebook link must be a valid URL' })
  facebook: string;
}
