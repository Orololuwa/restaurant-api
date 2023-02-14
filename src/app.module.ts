import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IngredientsModule } from './ingredients/ingredients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './ingredients/ingredients.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/orders.entity';
import { OrderedIngredientsModule } from './ordered-ingredients/ordered-ingredients.module';
import { OrderedIngredients } from './ordered-ingredients/ordered-ingredients.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Ingredient, User, Order, OrderedIngredients],
      synchronize: true,
    }),
    IngredientsModule,
    UsersModule,
    OrdersModule,
    OrderedIngredientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
