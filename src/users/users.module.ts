import { MiddlewareConsumer, Module } from '@nestjs/common';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../services/auth.service';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptors';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from '../services/users.service';
import { CurrentUserMiddleWare } from 'src/core/middleware/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CurrentUserInterceptor,
    // },
  ],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleWare).forRoutes('*');
  }
}
