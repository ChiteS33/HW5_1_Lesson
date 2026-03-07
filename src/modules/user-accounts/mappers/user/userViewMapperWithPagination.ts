import { PaginationViewType } from '../../../../core/types/paginationViewType';
import { FinalViewWithPaginationType } from '../../../../core/types/finalViewWithPagination.type';
import { UserViewType } from '../../api/view-types/user/userView.type';

export const userViewMapperWithPagination = (
  dto: UserViewType[],
  params: PaginationViewType,
): FinalViewWithPaginationType<UserViewType> => {
  return {
    pagesCount: params.pagesCount,
    page: params.page,
    pageSize: params.pageSize,
    totalCount: params.totalCount,
    items: dto,
  };
};
