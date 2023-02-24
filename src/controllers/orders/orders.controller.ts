import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from 'src/core/interceptors/serialize.inteceptor';
import { CurrentUser } from 'src/core/decorators/current-user.decorators';
import { CreateUserDTO } from 'src/controllers/users/dtos/dto';
import { CreateOrderDTO } from './dto/create-order.dto';
import { OrderDTO } from './dto/order.dto';
import { OrdersService } from 'src/services/orders/orders.service';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Controller('orders')
@Serialize(OrderDTO)
@UseGuards(JwtAuthGuard)
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
  getAllOrders(@Request() user: CreateUserDTO) {
    return this.ordersService.find(user);
  }

  @Delete()
  deleteOrder(@Body() { id }: { id: number }) {
    return this.ordersService.delete(id);
  }
}
