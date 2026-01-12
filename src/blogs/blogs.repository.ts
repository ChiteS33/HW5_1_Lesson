import { Injectable } from '@nestjs/common';
import { BlogDocument, BlogModel, BlogModelI } from './blogs.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(BlogModel.name) private blogModel: BlogModelI) {}

  async save(blog: BlogDocument | BlogModel): Promise<string> {
    const dataAboutSavedBlog = await this.blogModel.create(blog);
    await dataAboutSavedBlog.save();
    return dataAboutSavedBlog._id.toString();
  }

  async findBlogByBlogId(blogId: string): Promise<BlogDocument | null> {
    return this.blogModel.findOne({ _id: blogId });
  }

  async deleteBlogById(blogId: string): Promise<void> {
    await this.blogModel.deleteOne({ _id: blogId });
    return;
  }
}
