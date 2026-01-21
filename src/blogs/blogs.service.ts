import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BlogDocument, BlogModel, BlogModelI } from './blogs.entity';
import { BlogsRepository } from './repositories/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(BlogModel.name) private blogModel: BlogModelI,
    @Inject(BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}

  async findBlogById(BlogId: string): Promise<BlogDocument> {
    const foundBlog = await this.blogsRepository.findBlogByBlogId(BlogId);
    if (!foundBlog) {
      throw new NotFoundException({
        code: DomainExceptionCode.NotFound,
        field: 'blogId',
        message: 'Blog not found.',
      });
    }
    return foundBlog;
  }
}
