import { LikeDislikeStatus } from '../../domain/entities/posts.entity';
import { CommentDocument } from '../../domain/entities/comments.entity';
import { CommentViewType } from '../../api/view-types/comments/commentView.type';

export const commentsViewMapperWithCount = (
  comment: CommentDocument,
  like: number,
  dislike: number,
  myStatus: LikeDislikeStatus,
): CommentViewType => {
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
