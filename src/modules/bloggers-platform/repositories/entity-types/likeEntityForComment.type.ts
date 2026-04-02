import { LikeDislikeStatus } from '../../domain/entities/posts.entity';

export type LikeEntityForCommentType = {
  id: number;
  userId: number;
  login: string;
  commentId: number;
  status: LikeDislikeStatus;
  createdAt: Date;
};

export type LikeEntityForCommentWithLikeStatusType = {
  id: number;
  userId: number;
  login: string;
  commentId: number;
  status: LikeDislikeStatus;
  createdAt: Date;
};
