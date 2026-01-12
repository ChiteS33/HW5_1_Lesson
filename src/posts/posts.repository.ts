import { Injectable } from '@nestjs/common';
import { PostDocument, PostModel, PostModelI } from './posts.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(PostModel.name) private postModel: PostModelI) {}

  async save(post: PostDocument | PostModel): Promise<string> {
    const dataAboutPostBlog = await this.postModel.create(post);
    await dataAboutPostBlog.save();
    return dataAboutPostBlog._id.toString();
  }

  async findPostsById(postId: string): Promise<PostDocument | null> {
    return this.postModel.findById(postId);
  }

  async findPostsByBlogId(blogId: string): Promise<PostDocument[] | null> {
    return this.postModel.find({ blogId });
  }

  async deletePostById(postId: string): Promise<void> {
    await this.postModel.deleteOne({ _id: postId });
    return;
  }
}
