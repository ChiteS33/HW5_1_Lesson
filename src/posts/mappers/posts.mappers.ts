import { PostDocument } from '../posts.entity';
import {
  FinalWithPaginationType,
  OutPutPaginationType,
} from '../../blogs/types/blog.types';
import { LikeInDbForPost, PostOutPutType } from '../types/posts.types';

export const postMapper = (post: PostDocument): PostOutPutType => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
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

export const outPutMapperForPostWithNewestLikes = (
  post: PostDocument,
  totalCountLike: any,
  totalCountDislike: any,
  status: string,
  newestLikesForPost: LikeInDbForPost[],
): any => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo: {
      likesCount: totalCountLike,
      dislikesCount: totalCountDislike,
      myStatus: status,

      newestLikes: newestLikesForPost.map((like) => ({
        addedAt: like.data.toISOString(),
        userId: like.userId,
        login: like.login,
      })),
    },
  };
};
