import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UpdateIngredientCountDTO } from '../core/dtos/ingredients/update-ingredient.dto';
import { IngredientsService } from '../services/ingredients/ingredients.service';
import { CreateIngredientDTO } from 'src/core/dtos/ingredients/create-ingredient.dto';
import { Response } from 'express';

@Controller('ingredients')
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService) {}

  @Get()
  async getAllIngredients(
    @Query() query: { name: string },
    @Res() res: Response,
  ) {
    try {
      const { name } = query;
      const response = await this.ingredientsService.find({ name });
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error.response);
    }
  }

  @Post()
  async createIngredient(
    @Body() body: CreateIngredientDTO,
    @Res() res: Response,
  ) {
    try {
      const response = await this.ingredientsService.create(body);
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error.response);
    }
  }

  @Patch('/:id')
  async updateIngredient(
    @Param('id') id: string,
    @Body() body: UpdateIngredientCountDTO,
    @Res() res: Response,
  ) {
    try {
      const response = await this.ingredientsService.update(+id, body);
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error.response);
    }
  }

  @Delete('/:id')
  async deleteIngredient(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await this.ingredientsService.delete(+id);
      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error.response);
    }
  }
}
