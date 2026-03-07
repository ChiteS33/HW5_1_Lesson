import { PaginationViewType } from '../../../../core/types/paginationViewType';
import { FinalViewWithPaginationType } from '../../../../core/types/finalViewWithPagination.type';

export const blogViewMapperWithPagination = <T>(
  blogValues: T[],
  paginationValues: PaginationViewType,
): FinalViewWithPaginationType<T> => {
  return {
    pagesCount: paginationValues.pagesCount,
    page: paginationValues.page,
    pageSize: paginationValues.pageSize,
    totalCount: paginationValues.totalCount,
    items: blogValues,
  };
};
