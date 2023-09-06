import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/frameworks/typeorm/entities/users.entity';
import { ResponseState } from 'src/lib/helpers';
import { OptionalQuery } from 'src/core/types';
import { CreateUserDTO } from 'src/core/dtos/users/dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(body: CreateUserDTO) {
    const user = this.repo.create(body);

    return this.repo.save(user);
  }

  async find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async findOneWith(field: OptionalQuery<User>) {
    return this.repo.findOne({ where: field });
  }

  async findAll() {
    try {
      const users = await this.repo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.address', 'address')
        .select([
          'user.id',
          'user.name',
          'user.email',
          'user.password',
          'address',
        ])
        .getMany();

      return {
        message: 'Users retrieved successfully',
        data: { users },
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    if (!id) return null;
    const { password, ...data } = await this.repo.findOneBy({ id });

    return data;
  }

  async update(id, field: OptionalQuery<User>) {
    try {
      await this.repo.update(id, { ...field });

      return {
        message: 'Found',
        data: {},
        status: HttpStatus.OK,
        state: ResponseState.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
