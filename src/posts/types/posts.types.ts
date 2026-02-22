import { LikeDislikeStatus } from '../posts.entity';

export type InputDtoForCreateComment = {
  postId: string;
  content: string;
  userId: string;
  userLogin: string;
};

export type InputDtoForUpdateComment = {
  commentId: string;
  content: string;
  userId: string;
};

export type PostOutPutType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type LikeInDbForPost = {
  userId: string;
  login: string;
  postId: string;
  status: LikeDislikeStatus;
  data: Date;
};

export type PostOutPutTypeWIthLikes = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;

    newestLikes: {
      addedAt: string;
      userId: string;
      login: string;
    }[];
  };
};
