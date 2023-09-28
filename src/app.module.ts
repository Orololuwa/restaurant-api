import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'db/data-source';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/guards/auth.guard';
import services from './services';
import { Merchant } from './frameworks/typeorm/entities/merchants.entity';
import { MerchantAuthGuard } from './core/guards/merchant.guard';
import { SharedModule } from './services/shared/shared.module';
import { Restaurant } from './frameworks/typeorm/entities/restaurants.entity';
import { IsRestaurantGuard } from './core/guards/restaurant.guard';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      merchant?: Merchant;
      restaurant?: Restaurant;
    }
  }
}

@Module({
  imports: [
    ...services,
    SharedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: MerchantAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: IsRestaurantGuard,
    },
  ],
})
export class AppModule {}
