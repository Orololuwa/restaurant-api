import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/core/entities/users.entity';
import { ResponseState, Role } from 'src/lib/helpers';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(body: {
    name: string;
    email: string;
    address: string;
    password?: string;
    role?: Role;
  }) {
    const user = this.repo.create(body);

    return this.repo.save(user);
  }

  async find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async findAll() {
    const users = await this.repo
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.address'])
      .getMany();

    return {
      message: 'Users retrieved successfully',
      data: { users },
      status: HttpStatus.OK,
      state: ResponseState.SUCCESS,
    };
  }

  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.remove(user);
  }
}
