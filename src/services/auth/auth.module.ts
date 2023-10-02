import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controllers/users/auth.controller';
import { JWT_CONSTANT } from 'src/lib/config/app.config';
import { AuthService } from 'src/services/auth/auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: JWT_CONSTANT.secret,
      signOptions: { expiresIn: `${JWT_CONSTANT.expiration}s` },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
