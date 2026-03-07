import { InputQueryPaginationTypeWithSearchName } from '../../../../../core/pagination/inputQueryPaginationTypeWithSearchName';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostsQueryRepository } from '../../../repositories/postsRepositories/posts.queryRepository';
import { FinalViewWithPaginationType } from '../../../../../core/types/finalViewWithPagination.type';
import { PostViewType } from '../../../api/view-types/posts/postView.type';

export class GetAllPostsQuery {
  constructor(
    public query: InputQueryPaginationTypeWithSearchName,
    public userId?: string,
  ) {}
}

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsQueryHandlers implements IQueryHandler<GetAllPostsQuery> {
  constructor(
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
  ) {}
  async execute(
    query: GetAllPostsQuery,
  ): Promise<FinalViewWithPaginationType<PostViewType>> {
    return await this.postsQueryRepository.findAllPosts(
      query.query,
      query.userId,
    );
  }
}
