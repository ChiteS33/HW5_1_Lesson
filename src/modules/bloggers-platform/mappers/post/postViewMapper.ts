import { PostEntityWithLikeCounterType } from '../../repositories/entity-types/postEntity.type';

export const postViewMapperWithCount = (
  post: PostEntityWithLikeCounterType,
  // myStatus: LikeDislikeStatus,
): any => {
  return {
    id: post.id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo: {
      likesCount: post.likes_count,
      dislikesCount: post.dislikes_count,
      myStatus: 'Like',
      newestLikes: [],
    },
  };
};
