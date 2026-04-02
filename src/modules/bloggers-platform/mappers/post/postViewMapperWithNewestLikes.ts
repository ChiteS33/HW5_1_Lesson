import { PostViewWithLikesType } from '../../api/view-types/posts/postViewWithLikes.type';
import { PostEntityWithLikeCounterType } from '../../repositories/entity-types/postEntity.type';
import { LikeEntityForPostType } from '../../repositories/entity-types/likeEntityForPost.type';
import { LikeDislikeStatus } from '../../domain/entities/posts.entity';

export const postViewMapperWithNewestLikes = (
  post: PostEntityWithLikeCounterType,
  status: LikeDislikeStatus,
  newestLikes: LikeEntityForPostType[],
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
      likesCount: post.likes_count,
      dislikesCount: post.dislikes_count,
      myStatus: status,
      newestLikes: newestLikes.map((like) => ({
        addedAt: like.createdAt.toISOString(),
        userId: like.userId.toString(),
        login: like.login,
      })),
    },
  };
};
