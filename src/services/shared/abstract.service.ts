import { OptionalQuery } from 'src/core/types';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';

export abstract class AbstractService<T> {
  protected constructor(protected readonly repository: Repository<any>) {}

  async save(options: SaveOptions): Promise<T> {
    return this.repository.save(options);
  }

  async find(options: FindManyOptions<T>): Promise<any[]> {
    return this.repository.find(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(options);
  }

  async update(id: number, options: OptionalQuery<T>): Promise<UpdateResult> {
    return this.repository.update(id, options);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
