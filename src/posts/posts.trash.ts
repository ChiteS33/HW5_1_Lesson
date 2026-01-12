import {
  FinalWithPaginationType,
  InputPaginationType,
  OutPutPaginationType,
  SortDirection,
} from '../blogs/blogs.trash';
import { PostDocument } from './posts.entity';
import { mockLikeInfo } from '../comments/comments.trash';
import { LikesInfo } from '../comments/comments.entity';

export type PostOutPutType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: LikesInfo;
};

export const paginationValuesMaker = (pagination: InputPaginationType) => {
  return {
    pageNumber: pagination.pageNumber ? Number(pagination.pageNumber) : 1,
    pageSize: pagination.pageSize ? Number(pagination.pageSize) : 10,
    sortBy: pagination.sortBy ? pagination.sortBy : 'createdAt',
    sortDirection: pagination.sortDirection
      ? pagination.sortDirection
      : SortDirection.DESC,
  };
};

export const postMapper = (post: PostDocument): PostOutPutType => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo: mockLikeInfo,
  };
};

export const finalPaginationWithPostValue = (
  postValue: PostOutPutType[],
  paginationValues: OutPutPaginationType,
): FinalWithPaginationType<PostOutPutType> => {
  return {
    pagesCount: paginationValues.pagesCount,
    page: paginationValues.page,
    pageSize: paginationValues.pageSize,
    totalCount: paginationValues.totalCount,
    items: postValue,
  };
};
