import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIngredientDTO } from 'src/core/dtos/ingredients/create-ingredient.dto';
import { ResponseState } from 'src/lib/helpers';
import { Repository } from 'typeorm';
import { Ingredient } from '../../frameworks/typeorm/entities/ingredients.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient) private repo: Repository<Ingredient>,
  ) {}

  async create(body: CreateIngredientDTO) {
    try {
      const existing = await this.find({ name: body.name });

      if (existing.data.ingredient.length) {
        throw new BadRequestException(`Ingredient (${body.name}) exists`);
      }

      const created = this.repo.create(body);

      const ingredient = await this.repo.save(created);

      return {
        message: `Ingredient (${created.name}) created successfully`,
        data: {
          ingredient,
        },
        status: HttpStatus.CREATED,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async find({ name }: { name: string }) {
    try {
      const ingredient = await this.repo.find({ where: { name } });
      return {
        message: 'Ingredient(s) retrieved successfully',
        data: {
          ingredient,
        },
        status: HttpStatus.FOUND,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const ingredient = await this.repo.findOneBy({ id });

      return {
        message: 'Ingredient retrieved successfully',
        data: {
          ingredient,
        },
        status: HttpStatus.FOUND,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, body: Partial<Ingredient>) {
    try {
      const found = await this.findOne(id);
      const {
        data: { ingredient },
      } = found;

      if (!ingredient) throw new NotFoundException("Ingredient doesn't exist");

      Object.assign(ingredient, body);

      await this.repo.save(ingredient);

      return {
        message: 'Ingredient updated successfully',
        data: {
          ingredient,
        },
        status: HttpStatus.ACCEPTED,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const found = await this.findOne(id);

      const {
        data: { ingredient },
      } = found;

      if (!ingredient) throw new NotFoundException("Ingredient doesn't exist");

      await this.repo.remove(ingredient);

      return {
        message: 'Ingredient deleted successfully',
        data: {
          ingredient,
        },
        status: HttpStatus.ACCEPTED,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
