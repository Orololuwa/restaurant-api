import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../frameworks/typeorm/entities/users.entity';
import { UsersService } from 'src/services/users/users.service';
import { UsersController } from 'src/controllers/users/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
