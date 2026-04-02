import { PaginationViewType } from '../../../../core/types/paginationViewType';
import { FinalViewWithPaginationType } from '../../../../core/types/finalViewWithPagination.type';
import { LikeEntityForCommentWithLikeStatusType } from '../../repositories/entity-types/likeEntityForComment.type';

export const commentsViewMapperWithPagination = (
  comment: any[],
  pagination: PaginationViewType,
): FinalViewWithPaginationType<LikeEntityForCommentWithLikeStatusType> => {
  return {
    pagesCount: pagination.pagesCount,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalCount: pagination.totalCount,
    items: comment,
  };
};
