import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsController } from '../../controllers/ingredients.controller';
import { Ingredient } from '../../core/entities/ingredients.entity';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  providers: [IngredientsService],
  controllers: [IngredientsController],
})
export class IngredientsModule {}
