import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { merchantAuth } from 'src/core/decorators/auth.decorator';
import { CreateMerchantDTO } from 'src/core/dtos/merchants/create-merchant.dto';
import { IWebAuthLoginDTO } from 'src/core/dtos/web-auth-n';
import { Role } from 'src/lib/helpers';
import { MerchantAuthService } from 'src/services/auth/merchants/merchant-auth.service';

@Controller('merchant/auth')
export class MerchantAuthController {
  constructor(private merchantAuthService: MerchantAuthService) {}

  @Post('register')
  async createMerchant(@Body() body: CreateMerchantDTO, @Res() res: Response) {
    try {
      return res.status(200).json(await this.merchantAuthService.signUp(body));
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Post('signin')
  async signInMerchant(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      return res.status(200).json(await this.merchantAuthService.signIn(body));
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Get('profile')
  @merchantAuth(Role.Merchant)
  getMerchantProfile(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json(req.merchant);
  }

  @Post('signin/webauthn')
  async loginWebAuthN(@Body() body: IWebAuthLoginDTO, @Res() res: Response) {
    try {
      const { challenge, response: assertResponse, rawId } = body;

      const response = await this.merchantAuthService.loginWebAuthN({
        challenge,
        assertion: {
          rawId,
          response: assertResponse,
        },
      });

      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }
}
