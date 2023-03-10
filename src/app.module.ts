import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IngredientsModule } from './services/ingredients/ingredients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './services/users/users.module';
import { AuthModule } from './services/auth/auth.module';
import { OrdersModule } from './services/orders/orders.module';
import { OrderedIngredientsModule } from './services/ordered-ingredients/ordered-ingredients.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANT } from 'src/lib/config/app.config';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    IngredientsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    OrderedIngredientsModule,
    JwtModule.register({
      secret: JWT_CONSTANT.secret,
      signOptions: { expiresIn: `${JWT_CONSTANT.expiration}s` },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
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
