import { Injectable } from '@nestjs/common';
import { PostDocument, PostModel, PostModelI } from '../posts.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  LikeForPostDocument,
  LikeForPostModel,
  LikeForPostModelI,
} from '../../likes/likesForPosts/post.likes.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(PostModel.name) private postModel: PostModelI,
    @InjectModel(LikeForPostModel.name) private likeModel: LikeForPostModelI,
  ) {}

  async save(post: PostDocument | PostModel): Promise<string> {
    const dataAboutPostBlog = await this.postModel.create(post);
    await dataAboutPostBlog.save();
    return dataAboutPostBlog._id.toString();
  }

  async findPostsById(postId: string): Promise<PostDocument | null> {
    return this.postModel.findOne({ _id: postId });
  }

  async deletePostById(postId: string): Promise<void> {
    await this.postModel.deleteOne({ _id: postId });
    return;
  }

  async findLikesByPostId(
    postId: string,
    userId: string,
  ): Promise<LikeForPostDocument | null> {
    return this.likeModel.findOne({ postId, userId });
  }
}
