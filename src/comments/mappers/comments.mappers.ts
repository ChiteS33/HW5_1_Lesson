import { CommentDocument } from '../comments.entity';
import {
  FinalWithPaginationType,
  OutPutPaginationType,
} from '../../blogs/types/blog.types';
import { CommentOutPutType } from '../types/comments.types';
import { LikeDislikeStatus } from '../../posts/posts.entity';

export const finalCommentsMapperWithPago = (
  comment: CommentOutPutType[],
  pagination: OutPutPaginationType,
): FinalWithPaginationType<CommentOutPutType> => {
  return {
    pagesCount: pagination.pagesCount,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalCount: pagination.totalCount,
    items: comment,
  };
};

export const commentsFinalMapperWithCount = (
  comment: CommentDocument,
  like: number,
  dislike: number,
  myStatus: LikeDislikeStatus,
): CommentOutPutType => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: like,
      dislikesCount: dislike,
      myStatus: myStatus,
    },
  };
};
