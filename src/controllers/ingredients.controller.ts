import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateIngredientDTO,
  UpdateIngredientCountDTO,
} from '../core/dtos/ingredients/dto';
import { IngredientsService } from '../services/ingredients/ingredients.service';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { JwtAdminGuard } from 'src/core/guards/jwt-admin.guard';

@Controller('ingredients')
@UseGuards(JwtAuthGuard)
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService) {}

  @Get()
  getAllIngredients() {
    return this.ingredientsService.find();
  }

  @UseGuards(JwtAdminGuard)
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
