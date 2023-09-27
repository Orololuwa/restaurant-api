import { OptionalQuery } from 'src/core/types';
import {
  DataSource,
  DeepPartial,
  DeleteResult,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class DataSourceGenericService<T> {
  protected constructor(
    protected readonly dataSource: DataSource,
    protected readonly entity: EntityTarget<T>,
  ) {}

  async create(payload: DeepPartial<T>): Promise<T> {
    return this.dataSource.manager.create(this.entity, payload);
  }

  async findAll(options: FindManyOptions<T>): Promise<T[]> {
    try {
      const data = await this.dataSource.manager.find(this.entity, options);

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAllWithPagination(
    options: FindManyOptions<T>,
    query: {
      page?: number;
      perpage?: number;
    },
  ): Promise<{
    data: T[];
    pagination: {
      hasPrevious: boolean;
      prevPage: number;
      hasNext: boolean;
      next: number;
      currentPage: number;
      pageSize: number;
      lastPage: number;
      total: any;
    };
  }> {
    try {
      const perpage = Number(query.perpage) || 10;
      const page = Number(query.page) || 1;

      const excludedFields = [
        'page',
        'perpage',
        'dateFrom',
        'dateTo',
        'sort',
        'search',
        'sortBy',
        'orderBy',
      ];
      excludedFields.forEach((el) => delete query[el]);

      const data = await this.dataSource.manager.find(this.entity, {
        ...options,
        take: perpage,
        skip: page * perpage - perpage,
      });

      const total = await this.dataSource.manager.count(this.entity);

      const pagination = {
        hasPrevious: page > 1,
        prevPage: page - 1,
        hasNext: page < Math.ceil(total / perpage),
        next: page + 1,
        currentPage: Number(page),
        pageSize: perpage,
        lastPage: Math.ceil(total / perpage),
        total,
      };

      return { data, pagination };
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    try {
      const data = await this.dataSource.manager.findOne(this.entity, options);

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async insert(
    payload: T,
    options?: { transaction?: EntityManager },
  ): Promise<T> {
    try {
      if (options?.transaction)
        return await options.transaction
          .getRepository(this.entity)
          .save(payload);

      return await this.dataSource.manager.save(payload);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async bulkInsert(
    payload: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  ): Promise<InsertResult> {
    try {
      const data = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(this.entity)
        .values(payload)
        .execute();

      return data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async update(
    id: number,
    payload: QueryDeepPartialEntity<T>,
    options?: { transaction?: EntityManager },
  ): Promise<UpdateResult> {
    try {
      if (options?.transaction) {
        const data = await options.transaction
          .getRepository(this.entity)
          .update(id, { ...payload });
        return data.raw[0];
      }

      const data = await this.dataSource.manager.update(this.entity, id, {
        ...payload,
      });
      return data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async delete(
    id: number,
    options?: { transaction: EntityManager },
  ): Promise<DeleteResult> {
    try {
      if (options?.transaction) {
        const data = await options.transaction
          .getRepository(this.entity)
          .delete(id);
        return data;
      }
      const data = await this.dataSource.manager.delete(this.entity, id);
      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async increment(
    filter: FindOptionsWhere<T>,
    key: string,
    inc: number,
    options?: { transaction: EntityManager },
  ): Promise<UpdateResult> {
    try {
      if (options?.transaction) {
        const data = await options.transaction
          .getRepository(this.entity)
          .increment({ ...filter }, key, inc);
        return data;
      }
      const data = await this.dataSource.manager.increment(
        this.entity,
        { ...filter },
        key,
        inc,
      );
      return data;
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async decrement(
    filter: FindOptionsWhere<T>,
    key: string,
    dec: number,
    options?: { transaction: EntityManager },
  ): Promise<UpdateResult> {
    try {
      if (options?.transaction) {
        const data = await options.transaction
          .getRepository(this.entity)
          .decrement({ ...filter }, key, dec);
        return data;
      }
      const data = await this.dataSource.manager.decrement(
        this.entity,
        { ...filter },
        key,
        dec,
      );
      return data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async length(filter: OptionalQuery<T>) {
    try {
      const data = await this.dataSource.manager.count(this.entity, {
        ...filter,
      });
      return Promise.resolve(data);
    } catch (e: any) {
      return Promise.reject(e);
    }
  }
}
