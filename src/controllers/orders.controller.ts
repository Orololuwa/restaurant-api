import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Serialize } from 'src/core/interceptors/serialize.inteceptor';
import { CreateOrderDTO } from '../core/dtos/orders/create-order.dto';
import { OrdersService } from 'src/services/orders/orders.service';
import { Request, Response } from 'express';
import { User } from '../frameworks/typeorm/entities/users.entity';
import { auth } from 'src/core/decorators/auth.decorator';
import { Role } from 'src/lib/helpers';
import { OrderDTO } from 'src/core/dtos/orders/order.dto';
import { Order } from 'src/frameworks/typeorm/entities/orders.entity';
import { OptionalQuery } from 'src/core/types';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @auth(Role.User)
  async createOrder(
    @Body() body: CreateOrderDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const response = await this.ordersService.create(body, req.user as User);
      return res.status(response.status).json(response);
    } catch (error) {
      res.status(error.status || 500).json(error);
    }
  }

  @Serialize(OrderDTO)
  @Get()
  @auth(Role.User)
  async getAllOrders(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query() query: OptionalQuery<Order> & { page?: number; perpage?: number },
  ) {
    try {
      const response = await this.ordersService.find(req.user as User, query);
      return res.status(response.status).json(response);
    } catch (error) {
      res.status(error.status || 500).json(error);
    }
  }

  @Get('/:id')
  @auth(Role.User)
  async getSingleOrder(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const response = await this.ordersService.findOne(id, req.user as User);
      return res.status(response.status).json(response);
    } catch (error) {
      res.status(error.status || 500).json(error);
    }
  }

  @Delete()
  async deleteOrder(@Body() { id }: { id: string }, @Res() res: Response) {
    try {
      const response = await this.ordersService.delete(id);
      return res.status(response.status).json(response);
    } catch (error) {
      res.status(error.status || 500).json(error);
    }
  }
}
