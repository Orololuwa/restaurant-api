import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderedIngredientsModule } from 'src/services/ordered-ingredients/ordered-ingredients.module';
import { UsersModule } from 'src/services/users/users.module';
import { OrdersController } from '../../controllers/orders.controller';
import { Order } from '../../frameworks/typeorm/entities/orders.entity';
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
