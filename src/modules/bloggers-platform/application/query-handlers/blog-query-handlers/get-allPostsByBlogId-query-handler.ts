import { InputQueryPaginationTypeWithSearchName } from '../../../../../core/pagination/inputQueryPaginationTypeWithSearchName';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostsQueryRepository } from '../../../repositories/postsRepositories/posts.queryRepository';
import { FinalViewWithPaginationType } from '../../../../../core/types/finalViewWithPagination.type';
import { PostViewType } from '../../../api/view-types/posts/postView.type';

export class GetAllPostsByBlogIdQuery {
  constructor(
    public blogId: string,
    public query: InputQueryPaginationTypeWithSearchName,
    public userId: string,
  ) {}
}

@QueryHandler(GetAllPostsByBlogIdQuery)
export class GetAllPostsByBlogIdQueryHandler implements IQueryHandler<GetAllPostsByBlogIdQuery> {
  constructor(
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
  ) {}
  async execute(
    query: GetAllPostsByBlogIdQuery,
  ): Promise<FinalViewWithPaginationType<PostViewType>> {
    return await this.postsQueryRepository.findAllPostsByBlogId(
      query.blogId,
      query.query,
      query.userId,
    );
  }
}
