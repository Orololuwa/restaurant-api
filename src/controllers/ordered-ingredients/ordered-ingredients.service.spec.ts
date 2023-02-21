import { Test, TestingModule } from '@nestjs/testing';
import { OrderedIngredientsService } from '../services/ordered-ingredients.service';

describe('OrderedIngredientsService', () => {
  let service: OrderedIngredientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderedIngredientsService],
    }).compile();

    service = module.get<OrderedIngredientsService>(OrderedIngredientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
