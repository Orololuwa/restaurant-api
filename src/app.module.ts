import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IngredientsModule } from './controllers/ingredients/ingredients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './controllers/users/users.module';
import { AuthModule } from './controllers/auth/auth.module';
import { OrdersModule } from './controllers/orders/orders.module';
import { OrderedIngredientsModule } from './controllers/ordered-ingredients/ordered-ingredients.module';
import { APP_GUARD } from '@nestjs/core';
import { AdminGuard } from './core/guards/admin.guard';
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
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
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
