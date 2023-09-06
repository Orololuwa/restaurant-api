import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebAuthN } from 'src/frameworks/typeorm/entities/web-auth-n.entity';
import { MerchantsModule } from '../merchants/merchants.module';
import { WebAuthService } from './web-auth-n.service';

@Module({
  imports: [TypeOrmModule.forFeature([WebAuthN]), MerchantsModule],
  providers: [WebAuthService],
})
export class WebAuthModule {}
