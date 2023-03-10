import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderedIngredientsModule } from 'src/controllers/ordered-ingredients/ordered-ingredients.module';
import { UsersModule } from 'src/controllers/users/users.module';
import { OrdersController } from './orders.controller';
import { Order } from '../../core/entities/orders.entity';
import { OrdersService } from 'src/services/orders/orders.service';

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
