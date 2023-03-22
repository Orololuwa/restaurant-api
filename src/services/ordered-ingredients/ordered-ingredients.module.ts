import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderedIngredientsService } from 'src/services/ordered-ingredients/ordered-ingredients.service';
import { OrderedIngredients } from '../../frameworks/typeorm/entities/ordered-ingredients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderedIngredients])],
  providers: [OrderedIngredientsService],
  exports: [OrderedIngredientsService],
})
export class OrderedIngredientsModule {}
