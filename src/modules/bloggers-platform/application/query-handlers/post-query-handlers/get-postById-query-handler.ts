import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostsQueryRepository } from '../../../repositories/postsRepositories/posts.queryRepository';
import { LikeEntityForPostType } from '../../../repositories/entity-types/likeEntityForPost.type';
import { PostViewWithLikesType } from '../../../api/view-types/posts/postViewWithLikes.type';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { LikeDislikeStatus } from '../../../domain/entities/posts.entity';
import { postViewMapperWithNewestLikes } from '../../../mappers/post/postViewMapperWithNewestLikes';
import { LikesForPostRepository } from '../../../repositories/likesForPostRepositories/post.likes.repository';

export class FindPostByPostIdQuery {
  constructor(
    public postId: string,
    public userId?: string,
  ) {}
}

@QueryHandler(FindPostByPostIdQuery)
export class GetPostByPostIdQueryHandler implements IQueryHandler<FindPostByPostIdQuery> {
  constructor(
    @Inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
    @Inject(LikesForPostRepository)
    private likesForPostRepository: LikesForPostRepository,
  ) {}

  async execute(query: FindPostByPostIdQuery): Promise<PostViewWithLikesType> {
    const foundPostEntity = await this.postsQueryRepository.findPostByPostId(
      query.postId,
    );

    if (!foundPostEntity.foundPost) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'postId',
        message: 'Post not found',
      });
    }
    const newestLikes: LikeEntityForPostType[] =
      await this.postsQueryRepository.findNewestLikesForPost(query.postId);

    let myStatus: LikeDislikeStatus = LikeDislikeStatus.none;
    if (!query.userId) {
      return postViewMapperWithNewestLikes(
        foundPostEntity.foundPost,
        myStatus,
        newestLikes,
      );
    }

    const foundLikeForPost: LikeEntityForPostType[] =
      await this.likesForPostRepository.findLikeByUserIdAndPostId(
        query.userId,
        query.postId,
      );
    if (!foundLikeForPost[0]) {
      return postViewMapperWithNewestLikes(
        foundPostEntity.foundPost,
        myStatus,
        newestLikes,
      );
    }
    myStatus = foundLikeForPost[0].status;
    return postViewMapperWithNewestLikes(
      foundPostEntity.foundPost,
      myStatus,
      newestLikes,
    );
  }
}
