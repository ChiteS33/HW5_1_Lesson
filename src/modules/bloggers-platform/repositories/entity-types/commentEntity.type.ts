export type CommentEntityWithType = {
  id: number;
  content: string;
  postId: number;
  userId: number;
  userLogin: string;
  createdAt: Date;
};
