import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderedIngredientsService } from 'src/services/ordered-ingredients/ordered-ingredients.service';
import { OrderedIngredientsController } from '../../core/dtos/ordered-ingredients/ordered-ingredients.controller';
import { OrderedIngredients } from '../../core/entities/ordered-ingredients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderedIngredients])],
  providers: [OrderedIngredientsService],
  controllers: [OrderedIngredientsController],
  exports: [OrderedIngredientsService],
})
export class OrderedIngredientsModule {}
