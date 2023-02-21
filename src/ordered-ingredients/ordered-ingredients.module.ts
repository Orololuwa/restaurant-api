import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderedIngredientsController } from './ordered-ingredients.controller';
import { OrderedIngredients } from './ordered-ingredients.entity';
import { OrderedIngredientsService } from '../services/ordered-ingredients.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderedIngredients])],
  providers: [OrderedIngredientsService],
  controllers: [OrderedIngredientsController],
  exports: [OrderedIngredientsService],
})
export class OrderedIngredientsModule {}
