import { LikesInfo, MyStatus } from '../comments.entity';

export type CommentOutPutType = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: Date;
  likesInfo: LikesInfo;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};
