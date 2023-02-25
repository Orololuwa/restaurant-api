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
  createOrder(@Body() body: CreateOrderDTO, @Request() req: any) {
    return this.ordersService.create(body, req.user);
  }

  @Get()
  getAllOrders(@Request() req: any) {
    return this.ordersService.find(req.user);
  }

  @Delete()
  deleteOrder(@Body() { id }: { id: number }) {
    return this.ordersService.delete(id);
  }
}
