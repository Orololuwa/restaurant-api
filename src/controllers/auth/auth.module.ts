import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_CONSTANT } from 'src/lib/config/app.config';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtStrategy } from 'src/services/auth/jwt.strategy';
import { LocalStrategy } from 'src/services/auth/local.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_CONSTANT.secret,
      signOptions: { expiresIn: `${JWT_CONSTANT.expiration}s` },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
