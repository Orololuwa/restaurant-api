import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  AssertEndRemoveDTO,
  AttestateEndDTO,
  GetResidentKeysDTO,
} from 'src/core/dtos/web-auth-n';
import { WebAuthService } from 'src/services/web-auth-n/web-auth-n.service';

@Controller('resident')
export class WebAuthController {
  constructor(private webAuthService: WebAuthService) {}

  @Get('')
  async getResidentKeys(
    @Body() body: GetResidentKeysDTO,
    @Res() res: Response,
  ) {
    try {
      const response = await this.webAuthService.getResidentKeys(body);

      return res.status(response.status).json(response);
    } catch (error) {
      throw error;
    }
  }

  @Get('/attestate/begin')
  async attestateBegin(@Req() req: Request, @Res() res: Response) {
    try {
      const merchant = req.merchant;
      const response = await this.webAuthService.attestateBegin({
        user: merchant,
      });

      return res.status(response.status).json(response);
    } catch (error) {
      throw error;
    }
  }

  @Post('attestate/end')
  async attestateEnd(
    @Body() body: AttestateEndDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const merchant = req.merchant;
      const { rawId, attestationObject, clientDataJSON } = body;

      const response = await this.webAuthService.attestateEnd({
        user: merchant,
        attestation: { rawId, response: { attestationObject, clientDataJSON } },
      });
      return res.status(response.status).json(response);
    } catch (error) {
      throw error;
    }
  }

  @Get('assert/end')
  async assertBegin(@Res() res: Response) {
    try {
      const response = await this.webAuthService.assertBegin();

      return res.status(response.status).json(response);
    } catch (error) {
      throw error;
    }
  }

  @Post('assert/end-remove')
  async assertEndRemove(
    @Body() body: AssertEndRemoveDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const merchant = req.merchant;
      const { authenticatorData, signature, challenge, clientDataJSON, rawId } =
        body;

      const response = await this.webAuthService.assertEndRemove({
        user: merchant,
        challenge,
        assertion: {
          rawId,
          response: {
            authenticatorData,
            clientDataJSON,
            signature,
          },
        },
      });

      return res.status(response.status).json(response);
    } catch (error) {
      throw error;
    }
  }
}
