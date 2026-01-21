import { Inject, Injectable } from '@nestjs/common';
import { CommentsRepository } from './repositories/comments.repository';
import { DomainException } from '../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';
import { CommentDocument } from './comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(CommentsRepository) private commentsRepository: CommentsRepository,
  ) {}

  async findCommentById(commentId: string): Promise<CommentDocument> {
    const foundedComment =
      await this.commentsRepository.findCommentById(commentId);
    if (!foundedComment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'commentId',
        message: 'Comment not found',
      });
    }
    return foundedComment;
  }
}
