import { InputQueryPaginationTypeWithSearchName } from '../../../../../core/pagination/inputQueryPaginationTypeWithSearchName';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostsQueryRepository } from '../../../repositories/postsRepositories/posts.queryRepository';
import { FinalViewWithPaginationType } from '../../../../../core/types/finalViewWithPagination.type';
import {
  paginationValuesForRepo,
  paginationValuesMakerMapper,
} from '../../../../../core/mappers/paginationValuesMakerMapper';
import { TotalCount } from '../../../../../core/types/totalCount.type';
import { PostEntityWithLikeCounterType } from '../../../repositories/entity-types/postEntity.type';
import { LikeEntityForPostType } from '../../../repositories/entity-types/likeEntityForPost.type';
import { LikeDislikeStatus } from '../../../domain/entities/posts.entity';
import { PostViewWithLikesType } from '../../../api/view-types/posts/postViewWithLikes.type';
import { postViewMapperWithNewestLikes } from '../../../mappers/post/postViewMapperWithNewestLikes';
import { PaginationViewType } from '../../../../../core/types/paginationViewType';
import { postViewWithPagination } from '../../../mappers/post/postViewMapperWithPagination';

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
  ): Promise<FinalViewWithPaginationType<PostViewWithLikesType>> {
    const paginationValues: paginationValuesForRepo =
      paginationValuesMakerMapper(query.query);
    const foundPostsAndTotalCount =
      await this.postsQueryRepository.findAllPostsByBlogId(
        query.blogId,
        paginationValues,
      );
    const totalCount: TotalCount = foundPostsAndTotalCount.totalCount[0];
    const foundPosts: PostEntityWithLikeCounterType[] =
      foundPostsAndTotalCount.foundPosts;

    const postsId = foundPosts.map((post) => post.id.toString());
    const foundPostsAgainPromises = postsId.map(
      (
        postId,
      ): Promise<{
        foundPost: PostEntityWithLikeCounterType;
        newestLikes: LikeEntityForPostType[];
      }> => {
        return this.findPostById(postId);
      },
    );
    const foundPostsAgain = await Promise.all(foundPostsAgainPromises);
    const gluedFoundPostsPromises = foundPostsAgain.map(async (post) => {
      return {
        ...post.foundPost,
        likeStatus: LikeDislikeStatus.none,
        newestLikes: post.newestLikes,
      };
    });
    const gluedFoundPosts = await Promise.all(gluedFoundPostsPromises);
    const mappedPostsToView: PostViewWithLikesType[] = gluedFoundPosts.map(
      (post) =>
        postViewMapperWithNewestLikes(post, post.likeStatus, post.newestLikes),
    );

    const paginationForFront: PaginationViewType = {
      pagesCount: Math.ceil(totalCount.count / paginationValues.pageSize),
      page: paginationValues.pageNumber,
      pageSize: paginationValues.pageSize,
      totalCount: totalCount.count,
    };

    return postViewWithPagination(mappedPostsToView, paginationForFront);
  }
  private findPostById(postId: string): Promise<{
    foundPost: PostEntityWithLikeCounterType;
    newestLikes: LikeEntityForPostType[];
  }> {
    return this.postsQueryRepository.findPostByPostId(postId);
  }
}
