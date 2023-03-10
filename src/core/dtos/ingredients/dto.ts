import { IsNumber, IsString } from 'class-validator';

export class CreateIngredientDTO {
  @IsString()
  name: string;
}

export class UpdateIngredientCountDTO {
  @IsNumber()
  count: number;
}
