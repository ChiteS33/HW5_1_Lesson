import {
  FinalWithPaginationType,
  OutPutPaginationType,
} from '../../blogs/types/blog.types';
import { UserInPut, UserOutPut } from '../types/users.types';

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

export const outPutUserMapper = (user: UserInPut): UserOutPut => {
  return {
    id: user.id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
};
