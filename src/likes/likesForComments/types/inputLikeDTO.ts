import { LikeDislikeStatus } from '../../../posts/posts.entity';
import { ObjectId } from 'mongodb';
import { EmailConfirmation, RecoveryData } from '../../../users/users.entity';

export type InputLikeDTOForComment = {
  commentId: string;
  likeStatus: LikeDislikeStatus;
  user: {
    _id: ObjectId;
    login: string;
    email: string;
    password: string;
    createdAt: Date;
    emailConfirmation: EmailConfirmation;
    recoveryData: RecoveryData;
  };
};