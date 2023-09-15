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
  ],
})
export class AppModule {}
