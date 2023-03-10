import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from '../../core/entities/ingredients.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient) private repo: Repository<Ingredient>,
  ) {}

  create(name: string) {
    const count = 0;
    const ingredient = this.repo.create({ name, count });

    return this.repo.save(ingredient);
  }

  find() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, body: Partial<Ingredient>) {
    const ingredient = await this.findOne(id);

    if (!ingredient) throw new NotFoundException("Ingredient doesn't exist");

    Object.assign(ingredient, body);

    return this.repo.save(ingredient);
  }

  async delete(id: number) {
    const ingredient = await this.findOne(id);

    if (!ingredient) throw new NotFoundException("Ingredient doesn't exist");
    return this.repo.remove(ingredient);
  }
}
