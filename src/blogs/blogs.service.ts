import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  BlogDocument,
  BlogInputDto,
  BlogModel,
  BlogModelI,
} from './blogs.entity';
import { BlogsRepository } from './blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(BlogModel.name) private blogModel: BlogModelI,
    @Inject(BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}

  async findBlogById(BlogId: string): Promise<BlogDocument> {
    const foundedBlog = await this.blogsRepository.findBlogByBlogId(BlogId);
    if (!foundedBlog) {
      throw new NotFoundException({
        code: DomainExceptionCode.NotFound,
        field: 'blogId',
        message: 'Blog not found.',
      });
    }
    return foundedBlog;
  }

  async createBlog(inputDto: BlogInputDto): Promise<string> {
    const createdBlog = this.blogModel.createBlog(inputDto);
    return await this.blogsRepository.save(createdBlog);
  }

  async updateBlog(blogId: string, blogInputDto: BlogInputDto): Promise<void> {
    const foundBlog = await this.findBlogById(blogId);
    foundBlog.updateBlog(blogInputDto);
    await this.blogsRepository.save(foundBlog);
    return;
  }

  async deleteBlog(blogId: string): Promise<void> {
    await this.findBlogById(blogId);
    await this.blogsRepository.deleteBlogById(blogId);
    return;
  }
}
