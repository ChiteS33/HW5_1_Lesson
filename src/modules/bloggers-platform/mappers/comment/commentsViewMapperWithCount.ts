import { LikeDislikeStatus } from '../../domain/entities/posts.entity';
import { CommentViewType } from '../../api/view-types/comments/commentView.type';
import { CommentEntityWithLikeCounterType } from '../../repositories/entity-types/commentEntityWithLikeStatus.type';

export const commentsViewMapperWithCount = (
  comment: CommentEntityWithLikeCounterType,
  myStatus: LikeDislikeStatus,
): CommentViewType => {
  return {
    id: comment.id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.userId.toString(),
      userLogin: comment.userLogin,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: comment.likes_count,
      dislikesCount: comment.dislikes_count,
      myStatus: myStatus,
    },
  };
};
