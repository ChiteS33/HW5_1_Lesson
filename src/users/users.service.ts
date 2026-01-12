import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import {
  UserDocument,
  UserInputDto,
  UserModel,
  UserModelI,
} from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private userModel: UserModelI,
    @Inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async findUserById(userId: string): Promise<UserDocument> {
    const foundUser = await this.usersRepository.findUserById(userId);
    if (!foundUser) throw new NotFoundException();
    return foundUser;
  }

  async createUser(inputDto: UserInputDto): Promise<string> {
    const hash = await bcrypt.hash(inputDto.password, 10);

    const createDto = {
      login: inputDto.login,
      email: inputDto.email,
      passwordHash: hash,
    };
    const createdUser = this.userModel.createUserByAdmin(createDto);
    return await this.usersRepository.save(createdUser);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.findUserById(userId);
    await this.usersRepository.deleteUserById(userId);

    return;
  }
}
