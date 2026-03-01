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
  UserInDB,
  UserOutPut,
} from '../types/users.types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TotalCount } from '../../common/types/common.types';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: UserModelI,
    @InjectDataSource() private datasource: DataSource,
  ) {}

  async getAllUsers(
    query: InPutPaginationWithSearchLoginTermAndSearchEMailTerm,
  ): Promise<FinalWithPaginationType<UserOutPut>> {
    const pagination = valuesMakerWithSearchLoginAndEmail(query);
    const skip = (pagination.pageNumber - 1) * pagination.pageSize;
    const limit = pagination.pageSize;
    const allowedSortFields = ['login', 'createdAt', 'email', 'id'];
    const allowedDirections = ['ASC', 'DESC'];
    const safeSortBy = allowedSortFields.includes(pagination.sortBy)
      ? pagination.sortBy
      : 'createdAt';
    const safeSortDirection = allowedDirections.includes(
      pagination.sortDirection.toUpperCase(),
    )
      ? pagination.sortDirection.toUpperCase()
      : 'DESC';

    const foundedUsers: UserInDB[] = await this.datasource.query(
      `SELECT "id", "login", "email", "createdAt"
    FROM "Users"
    WHERE "login" ILIKE $1 OR "email" ILIKE $2
    ORDER BY "${safeSortBy}" ${safeSortDirection}
    LIMIT $4 OFFSET $3`,
      [
        `%${pagination.searchLoginTerm}%`,
        `%${pagination.searchEmailTerm}%`,
        skip,
        limit,
      ],
    );

    const totalCount: TotalCount[] = await this.datasource.query(
      `SELECT COUNT(*) :: int as count 
    FROM "Users"
       WHERE "login" ILIKE $1 OR "email" ILIKE $2`,
      [`%${pagination.searchLoginTerm}%`, `%${pagination.searchEmailTerm}%`],
    );
    const mappedUsers: UserOutPut[] = foundedUsers.map(outPutUserMapper);
    const params: OutPutPaginationType = {
      pagesCount: Math.ceil(totalCount[0].count / limit),
      page: pagination.pageNumber,
      pageSize: limit,
      totalCount: totalCount[0].count,
    };
    return outPutPaginationUserMapper(mappedUsers, params);
  }

  async findUserByUserId(userId: string): Promise<UserOutPut> {
    const foundUser: UserInDB[] = await this.datasource.query(
      `SELECT "id", "login", "email", "createdAt"
      FROM "Users" WHERE id = $1`,
      [userId],
    );
    if (!foundUser[0]) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'userId',
        message: 'User not found',
      });
    }
    return outPutUserMapper(foundUser[0]);
  }
}

// const allowedSortFields = ['name', 'createdAt', 'updatedAt', 'id'];
// const allowedDirections = ['ASC', 'DESC'];

// const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
// const safeSortDirection = allowedDirections.includes(sortDirection.toUpperCase())
//   ? sortDirection.toUpperCase()
//   : 'ASC';
//
// const query = `
//     SELECT *
//     FROM "Blogs"
//     WHERE "name" ILIKE $1
//     ORDER BY "${safeSortBy}" COLLATE "C" ${safeSortDirection}
//     LIMIT $2 OFFSET $3
// `;
