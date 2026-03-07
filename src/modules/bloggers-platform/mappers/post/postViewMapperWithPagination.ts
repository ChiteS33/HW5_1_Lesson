import { PaginationViewType } from '../../../../core/types/paginationViewType';
import { FinalViewWithPaginationType } from '../../../../core/types/finalViewWithPagination.type';
import { PostViewType } from '../../api/view-types/posts/postView.type';

export const postViewWithPagination = (
  postValue: PostViewType[],
  paginationValues: PaginationViewType,
): FinalViewWithPaginationType<PostViewType> => {
  return {
    pagesCount: paginationValues.pagesCount,
    page: paginationValues.page,
    pageSize: paginationValues.pageSize,
    totalCount: paginationValues.totalCount,
    items: postValue,
  };
};
