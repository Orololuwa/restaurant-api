import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { auth } from 'src/core/decorators';
import { CreateAddressDTO } from 'src/core/dtos/address/create-address.dto';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import { Role } from 'src/lib/helpers';
import { AddressService } from 'src/services/address/address.service';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  @auth(Role.User)
  createAddress(@Body() body: CreateAddressDTO, @Req() req: Request) {
    return this.addressService.createUserAdress(body, req.user as User);
  }

  @Get()
  @auth(Role.User)
  getAddresses(@Req() req: Request) {
    return this.addressService.getAllUserAdresses(req.user as User);
  }
}
