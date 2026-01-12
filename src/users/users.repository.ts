import { Injectable } from '@nestjs/common';
import { UserDocument, UserModel } from './users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel.name)
    private UserModel: Model<UserDocument>,
  ) {}

  async save(user: UserDocument | UserModel): Promise<string> {
    const dataAboutSavedUser = await this.UserModel.create(user);
    await dataAboutSavedUser.save();
    return dataAboutSavedUser._id.toString();
  }

  async findUserById(userId: string): Promise<UserDocument | null> {
    return this.UserModel.findById(userId);
  }

  async deleteUserById(userId: string): Promise<void> {
    await this.UserModel.deleteOne({ _id: userId });
    return;
  }
}
