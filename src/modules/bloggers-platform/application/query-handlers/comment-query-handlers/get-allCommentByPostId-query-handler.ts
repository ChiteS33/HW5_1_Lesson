import { CommentsQueryRepository } from '../../../repositories/commentsRepositories/comments.queryRepository';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  paginationValuesForRepo,
  paginationValuesMakerMapper,
} from '../../../../../core/mappers/paginationValuesMakerMapper';
import { commentsViewMapperWithPagination } from '../../../mappers/comment/commentsViewMapperWithPagination';
import { PostService } from '../../posts.service';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortDirection } from '../../../../../core/types/enumSortDirection.type';
import { CommentEntityWithLikeCounterType } from '../../../repositories/entity-types/commentEntityWithLikeStatus.type';
import { TotalCount } from '../../../../../core/types/totalCount.type';
import { commentsViewMapperWithCount } from '../../../mappers/comment/commentsViewMapperWithCount';
import { LikeDislikeStatus } from '../../../domain/entities/posts.entity';
import { FinalViewWithPaginationType } from '../../../../../core/types/finalViewWithPagination.type';
import { LikeEntityForCommentWithLikeStatusType } from '../../../repositories/entity-types/likeEntityForComment.type';

export class FindAllCommentsByPostIdQuery {
  constructor(
    public postId: string,
    public pagination: InputQueryPaginationType,
    public userId?: string,
  ) {}
}
@QueryHandler(FindAllCommentsByPostIdQuery)
export class FindAllCommentsByPostIdQueryHandler implements IQueryHandler<FindAllCommentsByPostIdQuery> {
  constructor(
    @Inject(CommentsQueryRepository)
    private readonly commentsQueryRepository: CommentsQueryRepository,
    @Inject(PostService) private postService: PostService,
  ) {}

  async execute(
    query: FindAllCommentsByPostIdQuery,
  ): Promise<
    FinalViewWithPaginationType<LikeEntityForCommentWithLikeStatusType>
  > {
    await this.postService.findPostById(query.postId);
    const paginationValues: paginationValuesForRepo =
      paginationValuesMakerMapper(query.pagination);

    const foundCommentsWithLikeCounterAndTotalCount =
      await this.commentsQueryRepository.findAllCommentsByPostId(
        query.postId,
        paginationValues,
      );
    const foundComments: CommentEntityWithLikeCounterType[] =
      foundCommentsWithLikeCounterAndTotalCount.foundCommentsWithLikeCounter;
    const totalCount: TotalCount[] =
      foundCommentsWithLikeCounterAndTotalCount.totalCount;
    const commentsIds = foundComments.map(
      (comment: CommentEntityWithLikeCounterType) => comment.id.toString(),
    );
    const mappedCommentsPromises = commentsIds.map(
      (commentId): Promise<CommentEntityWithLikeCounterType> => {
        return this.findCommentById(commentId);
      },
    );
    const mappedComments = await Promise.all(mappedCommentsPromises);
    const commentsWithLikesPromise = mappedComments.map(async (comment) => {
      return {
        ...comment,
        likeStatus: query.userId
          ? await this.commentsQueryRepository.findLikeStatusForComment(
              comment.id.toString(),
              query.userId,
            )
          : LikeDislikeStatus.none,
      };
    });
    const commentsWithLikes = await Promise.all(commentsWithLikesPromise);
    const mappedCommentsToView = commentsWithLikes.map((comment) =>
      commentsViewMapperWithCount(comment, comment.likeStatus),
    );

    const paginationView = {
      pagesCount: Math.ceil(totalCount[0].count / paginationValues.pageSize),
      page: paginationValues.pageNumber,
      pageSize: paginationValues.pageSize,
      totalCount: totalCount[0].count,
    };

    return commentsViewMapperWithPagination(
      mappedCommentsToView,
      paginationView,
    );
  }
  private findCommentById(
    commentId: string,
  ): Promise<CommentEntityWithLikeCounterType> {
    return this.commentsQueryRepository.findCommentById(commentId);
  }
}

export class InputQueryPaginationType {
  @IsOptional()
  @IsString()
  pageNumber?: string;
  @IsOptional()
  @IsString()
  pageSize?: string;
  @IsOptional()
  @IsString()
  sortBy?: string;
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
