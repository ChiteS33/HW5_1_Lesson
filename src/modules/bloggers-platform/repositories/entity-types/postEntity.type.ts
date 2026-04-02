export type PostEntityWithLikeCounterType = {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  blogName: string;
  createdAt: Date;
  likes_count: number;
  dislikes_count: number;
};
