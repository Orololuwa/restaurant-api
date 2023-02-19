import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.inteceptor';
import { CurrentUser } from 'src/core/decorators/current-user.decorators';
import { CreateUserDTO } from 'src/users/dtos/dto';
import { CreateOrderDTO } from './dto/create-order.dto';
import { OrderDTO } from './dto/order.dto';
import { OrdersService } from '../services/orders.service';

@Controller('orders')
@Serialize(OrderDTO)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() body: CreateOrderDTO) {
    return this.ordersService.create({
      deliveryMethod: body.deliveryMethod,
      price: body.price,
      email: body.email,
      name: body.name,
      address: body.address,
      ingredients: body.ingredients,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllOrders(@CurrentUser() user: CreateUserDTO) {
    return this.ordersService.find(user);
  }

  @Delete()
  deleteOrder(@Body() { id }: { id: number }) {
    return this.ordersService.delete(id);
  }
}
