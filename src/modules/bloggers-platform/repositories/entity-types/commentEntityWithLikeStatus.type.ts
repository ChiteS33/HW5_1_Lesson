export type CommentEntityWithLikeCounterType = {
  id: number;
  content: string;
  postId: number;
  userId: number;
  userLogin: string;
  createdAt: Date;
  likes_count: number;
  dislikes_count: number;
};
