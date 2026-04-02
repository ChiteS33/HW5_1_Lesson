import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CommentsQueryRepository } from '../../../repositories/commentsRepositories/comments.queryRepository';
import { LikeDislikeStatus } from '../../../domain/entities/posts.entity';
import { commentsViewMapperWithCount } from '../../../mappers/comment/commentsViewMapperWithCount';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { LikesForCommentRepository } from '../../../repositories/likesForCommentRepositories/comment.likes.repository';
import { CommentEntityWithLikeCounterType } from '../../../repositories/entity-types/commentEntityWithLikeStatus.type';
import { LikeEntityForCommentType } from '../../../repositories/entity-types/likeEntityForComment.type';

export class FindCommentByIdQuery {
  constructor(
    public commentId: string,
    public userId?: string,
  ) {}
}

@QueryHandler(FindCommentByIdQuery)
export class GetCommentByIdQueryHandler implements IQueryHandler<FindCommentByIdQuery> {
  constructor(
    @Inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
    @Inject(LikesForCommentRepository)
    private likesForCommentRepository: LikesForCommentRepository,
  ) {}
  async execute(query: FindCommentByIdQuery): Promise<any> {
    const foundCommentEntity: CommentEntityWithLikeCounterType =
      await this.commentsQueryRepository.findCommentById(
        query.commentId,
        query.userId,
      );

    if (!foundCommentEntity) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'commentId',
        message: 'Comment not found',
      });
    }

    let myStatus: LikeDislikeStatus = LikeDislikeStatus.none;
    if (!query.userId) {
      return commentsViewMapperWithCount(foundCommentEntity, myStatus);
    }

    const foundLikeForComment: LikeEntityForCommentType =
      await this.likesForCommentRepository.findLikeByUserIdAndCommentId(
        query.userId,
        query.commentId,
      );

    if (!foundLikeForComment) {
      return commentsViewMapperWithCount(foundCommentEntity, myStatus);
    }
    myStatus = foundLikeForComment.status;
    return commentsViewMapperWithCount(foundCommentEntity, myStatus);
  }
}
