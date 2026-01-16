import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
} from '@nestjs/common';
import { CommentsQueryRepository } from './comments.queryRepository';
import { DomainException } from '../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../core/exceptions/domain-exception-codes';

@Controller('comments')
export class CommentsController {
  constructor(
    @Inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getCommentById(@Param('id') commentId: string) {
    const foundedComment =
      await this.commentsQueryRepository.getCommentById(commentId);
    if (!foundedComment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        field: 'commentId',
        message: 'Could not find comment',
      });
    }
    return foundedComment;
  }
}
