import {
  FinalWithPaginationType,
  OutPutPaginationType,
} from '../../blogs/types/blog.types';
import { UserOutPut } from '../repositories/users.queryRepository';

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
