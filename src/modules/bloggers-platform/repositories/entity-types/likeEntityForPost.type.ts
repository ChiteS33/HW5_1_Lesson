import { LikeDislikeStatus } from '../../domain/entities/posts.entity';

export type LikeEntityForPostType = {
  id: number;
  userId: number;
  login: string;
  postId: number;
  status: LikeDislikeStatus;
  createdAt: Date;
};
