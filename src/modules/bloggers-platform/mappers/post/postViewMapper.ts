import { PostEntityType } from '../../repositories/entity-types/postEntity.type';
import { PostViewType } from '../../api/view-types/posts/postView.type';

export const postViewMapper = (post: PostEntityType): PostViewType => {
  return {
    id: post.id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    },
  };
};
