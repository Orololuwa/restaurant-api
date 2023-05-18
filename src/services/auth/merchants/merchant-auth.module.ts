import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MerchantAuthController } from 'src/controllers/merchants/merchant-auth.controller';
import { JWT_CONSTANT } from 'src/lib/config/app.config';
import { MerchantsModule } from 'src/services/merchants/merchants.module';
import { MerchantAuthService } from './merchant-auth.service';

@Module({
  imports: [
    MerchantsModule,
    JwtModule.register({
      secret: JWT_CONSTANT.secret,
      signOptions: { expiresIn: `${JWT_CONSTANT.expiration}s` },
    }),
  ],
  providers: [MerchantAuthService],
  controllers: [MerchantAuthController],
})
export class MerchantsAuthModule {}
