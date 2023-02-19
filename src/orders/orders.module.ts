import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderedIngredientsModule } from 'src/ordered-ingredients/ordered-ingredients.module';
import { UsersModule } from 'src/users/users.module';
import { OrdersController } from './orders.controller';
import { Order } from './orders.entity';
import { OrdersService } from '../services/orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UsersModule,
    OrderedIngredientsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
