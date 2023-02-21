import { Test, TestingModule } from '@nestjs/testing';
import { OrderedIngredientsController } from './ordered-ingredients.controller';

describe('OrderedIngredientsController', () => {
  let controller: OrderedIngredientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderedIngredientsController],
    }).compile();

    controller = module.get<OrderedIngredientsController>(OrderedIngredientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
