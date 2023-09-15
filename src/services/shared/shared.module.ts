import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANT } from 'src/lib/config/app.config';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_CONSTANT.secret,
      signOptions: { expiresIn: `${JWT_CONSTANT.expiration}s` },
    }),
  ],
  exports: [JwtModule],
})
export class SharedModule {}
