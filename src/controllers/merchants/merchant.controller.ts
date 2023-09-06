import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { merchantAuth } from 'src/core/decorators/auth.decorator';
import { Role } from 'src/lib/helpers';
import { MerchantsService } from 'src/services/merchants/merchants.service';

@Controller('merchant')
export class MerchantController {
  constructor(private merchantService: MerchantsService) {}

  @Get('profile')
  @merchantAuth(Role.Merchant)
  async getMerchantProfile(@Req() req: Request, @Res() res: Response) {
    const response = await this.merchantService.getProfile(req.merchant);
    return res.status(response.status).json(response);
  }
}
