import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.inteceptor';
import { CreateOrderDTO } from './dto/create-order.dto';
import { OrderDTO } from './dto/order.dto';
import { OrdersService } from './orders.service';

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
  getAllOrders() {
    return this.ordersService.find();
  }

  @Delete()
  deleteOrder(@Body() { id }: { id: number }) {
    return this.ordersService.delete(id);
  }
}
