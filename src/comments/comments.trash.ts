import { CommentDocument, LikesInfo, MyStatus } from './comments.entity';
import {
  FinalWithPaginationType,
  OutPutPaginationType,
} from '../blogs/blogs.trash';

export type CommentOutPutType = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: Date;
  likesInfo: LikesInfo;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export const mockLikeInfo = {
  likesCount: 0,
  dislikesCount: 0,
  myStatus: MyStatus.none,
  newestLikes: [],
};

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
): CommentOutPutType => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
    likesInfo: mockLikeInfo,
  };
};
