import { InputQueryPaginationTypeWithSearchName } from '../../../../../core/pagination/inputQueryPaginationTypeWithSearchName';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostsQueryRepository } from '../../../repositories/postsRepositories/posts.queryRepository';
import { FinalViewWithPaginationType } from '../../../../../core/types/finalViewWithPagination.type';
import {
  paginationValuesForRepo,
  paginationValuesMakerMapper,
} from '../../../../../core/mappers/paginationValuesMakerMapper';
import { PaginationViewType } from '../../../../../core/types/paginationViewType';
import { TotalCount } from '../../../../../core/types/totalCount.type';
import { postViewMapperWithNewestLikes } from '../../../mappers/post/postViewMapperWithNewestLikes';
import { PostEntityWithLikeCounterType } from '../../../repositories/entity-types/postEntity.type';
import { LikeEntityForPostType } from '../../../repositories/entity-types/likeEntityForPost.type';
import { LikeDislikeStatus } from '../../../domain/entities/posts.entity';
import { PostViewWithLikesType } from '../../../api/view-types/posts/postViewWithLikes.type';
import { postViewWithPagination } from '../../../mappers/post/postViewMapperWithPagination';

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
  ): Promise<FinalViewWithPaginationType<PostViewWithLikesType>> {
    const paginationValues: paginationValuesForRepo =
      paginationValuesMakerMapper(query.query);
    const foundPostsAndTotalCount =
      await this.postsQueryRepository.findAllPostsByBlogId(
        query.blogId,
        paginationValues,
        query.userId,
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
        likeStatus: query.userId
          ? await this.postsQueryRepository.findLikeStatusForPost(
              post.foundPost.id.toString(),
              query.userId,
            )
          : LikeDislikeStatus.none,
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
