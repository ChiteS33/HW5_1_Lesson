import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BlogsQueryRepository } from '../../../repositories/blogsRepositories/blogs.queryRepository';
import { BlogViewType } from '../../../api/view-types/blogs/blogView.type';

export class GetBlogsByBlogIdQuery {
  constructor(public blogId: string) {}
}

@QueryHandler(GetBlogsByBlogIdQuery)
export class GetBlogsByBlogIdQueryHandler implements IQueryHandler<GetBlogsByBlogIdQuery> {
  constructor(
    @Inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async execute(query: GetBlogsByBlogIdQuery): Promise<BlogViewType> {
    return await this.blogsQueryRepository.getBlogById(query.blogId);
  }
}
