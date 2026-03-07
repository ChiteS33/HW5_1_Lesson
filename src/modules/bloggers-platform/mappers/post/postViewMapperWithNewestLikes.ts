import { PostViewWithLikesType } from '../../api/view-types/posts/postViewWithLikes.type';
import { PostEntityType } from '../../repositories/entity-types/postEntity.type';

export const postViewMapperWithNewestLikes = (
  post: PostEntityType,
  totalCountLike: number,
  totalCountDislike: number,
  status: string,
  // newestLikesForPost: LikeInDbForPost,
): PostViewWithLikesType => {
  return {
    id: post.id.toString(),
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
      // newestLikes: newestLikesForPost.map((like) => ({
      //   addedAt: like.data.toISOString(),
      //   userId: like.userId,
      //   login: like.login,
      newestLikes: [],
      // })),
    },
  };
};
