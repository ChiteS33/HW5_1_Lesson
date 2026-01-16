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
  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  }

  async findUserByConfirmationCode(code: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async findUserByRecoveryCode(
    recoveryCode: string,
  ): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'recoveryData.recoveryCode': recoveryCode,
    });
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ email: email });
  }
  async findUserByLogin(login: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ login: login });
  }
}
