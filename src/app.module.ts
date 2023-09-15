import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from 'db/data-source';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANT } from 'src/lib/config/app.config';
import services from './services';
import { Merchant } from './frameworks/typeorm/entities/merchants.entity';
import { MerchantAuthGuard } from './core/guards/merchant.guard';
// import { AllExceptionsFilter } from './core/interceptors/exception-filter';
const cookieSession = require('cookie-session');

declare global {
  namespace Express {
    interface Request {
      user?: User;
      merchant?: Merchant;
    }
  }
}

@Module({
  imports: [
    ...services,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    JwtModule.register({
      secret: JWT_CONSTANT.secret,
      signOptions: { expiresIn: `${JWT_CONSTANT.expiration}s` },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // AllExceptionsFilter,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: MerchantAuthGuard,
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
