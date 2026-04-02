import { InputQueryPaginationTypeWithSearchName } from '../../../../../core/pagination/inputQueryPaginationTypeWithSearchName';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostsQueryRepository } from '../../../repositories/postsRepositories/posts.queryRepository';
import { paginationValuesMakerMapper } from '../../../../../core/mappers/paginationValuesMakerMapper';
import { postViewWithPagination } from '../../../mappers/post/postViewMapperWithPagination';
import { TotalCount } from '../../../../../core/types/totalCount.type';
import { PostEntityWithLikeCounterType } from '../../../repositories/entity-types/postEntity.type';
import { PaginationViewType } from '../../../../../core/types/paginationViewType';
import { LikeDislikeStatus } from '../../../domain/entities/posts.entity';
import { postViewMapperWithNewestLikes } from '../../../mappers/post/postViewMapperWithNewestLikes';
import { LikeEntityForPostType } from '../../../repositories/entity-types/likeEntityForPost.type';
import { PostViewWithLikesType } from '../../../api/view-types/posts/postViewWithLikes.type';
import { FinalViewWithPaginationType } from '../../../../../core/types/finalViewWithPagination.type';

export class GetAllPostsQuery {
  constructor(
    public query: InputQueryPaginationTypeWithSearchName,
    public userId?: string,
  ) {}
}

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsQueryHandler implements IQueryHandler<GetAllPostsQuery> {
  constructor(
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
  ) {}
  async execute(
    query: GetAllPostsQuery,
  ): Promise<FinalViewWithPaginationType<PostViewWithLikesType>> {
    const paginationValues = paginationValuesMakerMapper(query.query);

    const foundPostsWithLikeCounter =
      await this.postsQueryRepository.findAllPosts(
        paginationValues,
        query.userId,
      );
    const totalCount: TotalCount = foundPostsWithLikeCounter.totalCount[0];
    const foundPosts: PostEntityWithLikeCounterType[] =
      foundPostsWithLikeCounter.foundPostsWithLikeCounter;
    const postsId = foundPosts.map((post) => post.id.toString());
    const mappedCommentsPromises = postsId.map(
      (
        postId,
      ): Promise<{
        foundPost: PostEntityWithLikeCounterType;
        newestLikes: LikeEntityForPostType[];
      }> => {
        return this.findPostById(postId);
      },
    );
    const mappedPosts = await Promise.all(mappedCommentsPromises);
    const commentsWithLikePromise = mappedPosts.map(async (post) => {
      return {
        ...post.foundPost,
        likeStatus: query.userId
          ? await this.postsQueryRepository.findLikeStatusForPost(
              post.foundPost.id.toString(),
              query.userId,
            )
          : LikeDislikeStatus.none,
        newestLikes: post.newestLikes,
      };
    });
    const postsWithLikes = await Promise.all(commentsWithLikePromise);
    const mappedPostsToView: PostViewWithLikesType[] = postsWithLikes.map(
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
