import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { auth } from 'src/core/decorators/auth.decorator';
import { CreateDeliveryDetailsDTO } from 'src/core/dtos/delivery-details/create-delivery.dto';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import { Role } from 'src/lib/helpers';
import { DeliveryDetailsService } from 'src/services/delivery-details/delivery-details.service';

@Controller('delivery-details')
export class DeliveryDetailsController {
  constructor(private deliveryService: DeliveryDetailsService) {}

  @Post()
  @auth(Role.User)
  createAddress(@Body() body: CreateDeliveryDetailsDTO, @Req() req: Request) {
    return this.deliveryService.create(body, req.user as User);
  }

  @Get()
  @auth(Role.User)
  getAddresses(@Req() req: Request) {
    return this.deliveryService.find(req.user as User);
  }
}
