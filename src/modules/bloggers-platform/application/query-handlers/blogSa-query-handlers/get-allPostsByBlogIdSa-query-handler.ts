import { InputQueryPaginationTypeWithSearchName } from '../../../../../core/pagination/inputQueryPaginationTypeWithSearchName';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostsQueryRepository } from '../../../repositories/postsRepositories/posts.queryRepository';
import { FinalViewWithPaginationType } from '../../../../../core/types/finalViewWithPagination.type';
import { PostViewType } from '../../../api/view-types/posts/postView.type';

export class GetAllPostsByBlogIdSaQuery {
  constructor(
    public blogId: string,
    public query: InputQueryPaginationTypeWithSearchName,
  ) {}
}

@QueryHandler(GetAllPostsByBlogIdSaQuery)
export class GetAllPostsByBlogIdSaQueryHandler implements IQueryHandler<GetAllPostsByBlogIdSaQuery> {
  constructor(
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
  ) {}
  async execute(
    query: GetAllPostsByBlogIdSaQuery,
  ): Promise<FinalViewWithPaginationType<PostViewType>> {
    return await this.postsQueryRepository.findAllPostsByBlogId(
      query.blogId,
      query.query,
    );
  }
}
