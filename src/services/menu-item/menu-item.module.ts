import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemsController } from '../../controllers/menu-item.controller';
import { MenuItem } from '../../frameworks/typeorm/entities/menu-item.entity';
import { MenuItemService } from './menu-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem])],
  providers: [MenuItemService],
  controllers: [MenuItemsController],
})
export class MenuItemModule {}
