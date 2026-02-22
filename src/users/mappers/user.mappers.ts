import {
  FinalWithPaginationType,
  OutPutPaginationType,
} from '../../blogs/types/blog.types';
import { UserOutPut } from '../types/users.types';
import { UserDocument } from '../users.entity';

export const outPutPaginationUserMapper = (
  dto: UserOutPut[],
  params: OutPutPaginationType,
): FinalWithPaginationType<UserOutPut> => {
  return {
    pagesCount: params.pagesCount,
    page: params.page,
    pageSize: params.pageSize,
    totalCount: params.totalCount,
    items: dto,
  };
};

export const outPutUserMapper = (user: UserDocument): UserOutPut => {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
};
