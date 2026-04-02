export type CommentEntityType = {
  id: number;
  content: string;
  postId: number;
  commentatorInfo: {
    userId: number;
    userLogin: string;
  };
  userId: number;
  userLogin: string;
  createdAt: Date;
};
