import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../repositories/blogsRepositories/blogs.queryRepository';
import { Inject } from '@nestjs/common';
import { InputQueryPaginationTypeWithSearchName } from '../../../../../core/pagination/inputQueryPaginationTypeWithSearchName';
import { FinalViewWithPaginationType } from '../../../../../core/types/finalViewWithPagination.type';
import { BlogViewType } from '../../../api/view-types/blogs/blogView.type';

export class GetAllBlogsQuery {
  constructor(public query: InputQueryPaginationTypeWithSearchName) {}
}

@QueryHandler(GetAllBlogsQuery)
export class GetAllBlogsQueryHandlers implements IQueryHandler<GetAllBlogsQuery> {
  constructor(
    @Inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async execute(
    query: GetAllBlogsQuery,
  ): Promise<FinalViewWithPaginationType<BlogViewType>> {
    return await this.blogsQueryRepository.getAllBlogs(query.query);
  }
}
