import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { merchantAuth } from 'src/core/decorators/auth.decorator';
import { AssertEndRemoveDTO, AttestateEndDTO } from 'src/core/dtos/web-auth-n';
import { Role } from 'src/lib/helpers';
import { WebAuthService } from 'src/services/web-auth-n/web-auth-n.service';

@Controller('merchant/webauthn/resident')
export class MerchantWebAuthController {
  constructor(private webAuthService: WebAuthService) {}

  @Get('')
  @merchantAuth(Role.Merchant)
  async getResidentKeys(@Req() req: Request, @Res() res: Response) {
    try {
      const merchant = req.merchant;

      const response = await this.webAuthService.getResidentKeys({
        id: merchant.id,
      });

      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Get('/attestate/begin')
  @merchantAuth(Role.Merchant)
  async attestateBegin(@Req() req: Request, @Res() res: Response) {
    try {
      const merchant = req.merchant;
      const response = await this.webAuthService.attestateBegin({
        user: merchant,
      });

      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Post('/attestate/end')
  @merchantAuth(Role.Merchant)
  async attestateEnd(
    @Body() body: AttestateEndDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const merchant = req.merchant;

      const response = await this.webAuthService.attestateEnd({
        user: merchant,
        attestation: body,
      });

      return res.status(response.status || 500).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Get('/assert/begin')
  async assertBegin(@Res() res: Response) {
    try {
      const response = await this.webAuthService.assertBegin();

      return res.status(response.status).json(response);
    } catch (error) {
      return res.status(error.status || 500).json(error);
    }
  }

  @Post('/assert/end-remove')
  @merchantAuth(Role.Merchant)
  async assertEndRemove(
    @Body() body: AssertEndRemoveDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const merchant = req.merchant;
      const { challenge, response: assertResponse, rawId } = body;

      const response = await this.webAuthService.assertEndRemove({
        user: merchant,
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
