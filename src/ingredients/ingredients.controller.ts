import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateIngredientDTO, UpdateIngredientCountDTO } from './dto';
import { IngredientsService } from '../services/ingredients.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService) {}

  @Get()
  getAllIngredients() {
    return this.ingredientsService.find();
  }

  @Post('/create')
  createIngredient(@Body() body: CreateIngredientDTO) {
    return this.ingredientsService.create(body.name);
  }

  @Post('/:id')
  incrementIngredientCount(
    @Param('id') id: string,
    @Body() body: UpdateIngredientCountDTO,
  ) {
    return this.ingredientsService.update(+id, { count: body.count });
  }

  @Delete('/:id')
  deleteIngredient(@Param('id') id: string) {
    return this.ingredientsService.delete(+id);
  }
}
