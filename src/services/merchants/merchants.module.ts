import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from 'src/frameworks/typeorm/entities/merchants.entity';
import { MerchantsService } from './merchants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant])],
  providers: [MerchantsService],
  exports: [MerchantsService],
})
export class MerchantsModule {}
