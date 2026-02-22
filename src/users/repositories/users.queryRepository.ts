import { Injectable } from '@nestjs/common';
import { UserModel, UserModelI } from '../users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException } from '../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../core/exceptions/domain-exception-codes';
import {
  FinalWithPaginationType,
  OutPutPaginationType,
} from '../../blogs/types/blog.types';
import {
  outPutPaginationUserMapper,
  outPutUserMapper,
} from '../mappers/user.mappers';
import { valuesMakerWithSearchLoginAndEmail } from '../../common/mappers/common.mappers';
import {
  InPutPaginationWithSearchLoginTermAndSearchEMailTerm,
  UserOutPut,
} from '../types/users.types';

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
