import { LikeDislikeStatus } from '../../domain/entities/posts.entity';

export type LikeEntityForPostType = {
  userId: string;
  login: string;
  postId: string;
  status: LikeDislikeStatus;
  data: Date;
};
