import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from '../services/users.service';
import { CurrentUserMiddleWare } from 'src/core/middleware/current-user.middleware';
import { AuthService } from 'src/services/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleWare).forRoutes('*');
  }
}
