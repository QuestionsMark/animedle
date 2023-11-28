import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserNamespace } from 'src/types';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  async getUserResponse(id: string): Promise<UserNamespace.Response> {
    const { avatar, email, username } = await User.findOneOrFail({
      relations: ['avatar'],
      where: {
        id,
      },
    });

    return {
      avatar: avatar.id,
      email,
      id,
      username,
    };
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
