import { Injectable } from '@nestjs/common';
import { UserDocument, UserModel, UserModelI } from './users.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  FinalWithPaginationType,
  OutPutPaginationType,
  SortDirection,
} from '../blogs/blogs.trash';

import {
  outPutPaginationUserMapper,
  valuesMakerWithSearchLoginAndEmail,
} from './users.trash';
import { DomainException } from '../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(UserModel.name)
    private userModel: UserModelI,
  ) {}

  async getAllUsers(
    query: InPutPaginationWithSearchLoginTermAndSearchEMailTerm,
  ): Promise<FinalWithPaginationType<UserOutPut>> {
    const pagination = valuesMakerWithSearchLoginAndEmail(query);
    const skip = (pagination.pageNumber - 1) * pagination.pageSize;
    const limit = pagination.pageSize;
    const sort = { [pagination.sortBy]: pagination.sortDirection };
    const search = {
      $or: [
        { login: { $regex: pagination.searchLoginTerm, $options: 'i' } },
        { email: { $regex: pagination.searchEmailTerm, $options: 'i' } },
      ],
    };
    const foundedUsers = await this.userModel
      .find(search)
      .skip(skip)
      .limit(limit)
      .sort(sort);
    const totalCount = await this.userModel.countDocuments(search);
    const params: OutPutPaginationType = {
      pagesCount: Math.ceil(totalCount / pagination.pageSize),
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
    };
    const usersForFrontend: UserOutPut[] = foundedUsers.map(outPutUserMapper);
    return outPutPaginationUserMapper(usersForFrontend, params);
  }

  async findUserByUserId(userId: string): Promise<UserOutPut> {
    const foundedUser = await this.userModel.findOne({ _id: userId });
    if (!foundedUser) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'userId',
        message: 'User not found',
      });
    }
    return outPutUserMapper(foundedUser);
  }
}

export const outPutUserMapper = (user: UserDocument): UserOutPut => {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
};

export type UserOutPut = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type InPutPaginationWithSearchLoginTermAndSearchEMailTerm = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: string;
  pageSize?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};
