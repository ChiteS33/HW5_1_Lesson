import { PaginationViewType } from '../../../../core/types/paginationViewType';
import { FinalViewWithPaginationType } from '../../../../core/types/finalViewWithPagination.type';
import { PostViewWithLikesType } from '../../api/view-types/posts/postViewWithLikes.type';

export const postViewWithPagination = (
  postValue: PostViewWithLikesType[],
  paginationValues: PaginationViewType,
): FinalViewWithPaginationType<PostViewWithLikesType> => {
  return {
    pagesCount: paginationValues.pagesCount,
    page: paginationValues.page,
    pageSize: paginationValues.pageSize,
    totalCount: paginationValues.totalCount,
    items: postValue,
  };
};
