import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { merchantAuth } from 'src/core/decorators/auth.decorator';
import { CreateMerchantDTO } from 'src/core/dtos/merchants/create-merchant.dto';
import { Role } from 'src/lib/helpers';
import { MerchantAuthService } from 'src/services/auth/merchants/merchant-auth.service';

@Controller('merchant/auth')
export class MerchantAuthController {
  constructor(private merchantAuthService: MerchantAuthService) {}

  @Post('register')
  createMerchant(@Body() body: CreateMerchantDTO) {
    return this.merchantAuthService.signUp(body);
  }

  @Post('signin')
  signInMerchant(@Body() body: { email: string; password: string }) {
    return this.merchantAuthService.signIn(body);
  }

  @Get('profile')
  @merchantAuth(Role.Merchant)
  getMerchantProfile(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json(req.merchant);
  }
}
